import { crawlWebsite } from "./scrapper.service.js";
import { crawlSchema } from "./scrapper.validation.js";
import { analyzeSiteSeo } from "../seo/seo.service.js";
import Project from "../../models/Project.model.js";
import Report from "../../models/Report.model.js";

import Activity from "../../models/Activity.model.js";

export const crawl = async (req, res) => {
  const parsed = crawlSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten().fieldErrors);
  }

  try {
    const { projectId, url, maxPages } = parsed.data;

    // Check project ownership
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized for this project" });
    }

    const targetUrl = url || project.url;

    // Crawl
    const crawlData = await crawlWebsite(targetUrl, maxPages);

    // Analyze
    const seoAnalysis = analyzeSiteSeo(crawlData);

    const mergedPages = seoAnalysis.pages.map((analysis) => {
      const originalData = crawlData.find((p) => p.url === analysis.url);
      return {
        ...analysis,
        details: originalData || null,
      };
    });

    // Find the main page data (entry point)
    const mainPageData =
      crawlData.find((p) => p.url === targetUrl) || crawlData[0];

    // Save Report to DB
    const report = await Report.create({
      project: projectId,
      user: req.user._id,
      score: seoAnalysis.overall_score || 0,
      improvements: seoAnalysis.top_improvements.map((i) => i.issue),
      technicalDetails: {
        ...mainPageData, // Spread main page details (seo, content, media, etc.) to root of technicalDetails
        crawlData_summary: {
          total_pages: seoAnalysis.total_pages_analyzed,
          score: seoAnalysis.overall_score,
        },
        pages: mergedPages,
      },
      scannedUrl: targetUrl,
    });

    // Log activity
    await Activity.create({
      user: req.user._id,
      type: "scan_completed",
      details: {
        reportId: report._id,
        score: report.score,
        projectId: projectId,
        projectName: project.name,
        projectUrl: project.url,
      },
    });

    // Update project lastScannedAt
    project.lastScannedAt = Date.now();
    await project.save();

    res.json({
      message: "Crawl and Analysis completed successfully",
      reportId: report._id,
      site_overview: {
        overall_score: seoAnalysis.overall_score,
        total_pages: seoAnalysis.total_pages_analyzed,
        top_improvements: seoAnalysis.top_improvements,
      },
      pages: mergedPages,
    });
  } catch (err) {
    console.error("Crawl error:", err);
    res.status(500).json({ error: "Failed to process website" });
  }
};
