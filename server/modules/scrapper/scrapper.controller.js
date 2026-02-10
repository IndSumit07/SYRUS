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

    let targetUrl = url || project.url;
    if (!targetUrl.startsWith("http")) {
      targetUrl = `https://${targetUrl}`;
    }

    // Crawl
    let crawlData;
    try {
      crawlData = await crawlWebsite(targetUrl, maxPages);
    } catch (crawlErr) {
      console.error("Scraper service failed:", crawlErr);
      return res.status(500).json({
        error: "Crawler error",
        message:
          "The scraping process failed to start. Please ensure the server has Playwright installed.",
      });
    }

    if (!crawlData || crawlData.length === 0) {
      console.warn(
        `Crawl returned no data for project ${projectId} at ${targetUrl}`,
      );
      return res.status(422).json({
        message:
          "No pages could be analyzed. The website might be blocking scrapers, requires a login, or is currently inaccessible.",
      });
    }

    // Analyze
    const seoAnalysis = analyzeSiteSeo(crawlData);
    if (!seoAnalysis) {
      return res
        .status(422)
        .json({ message: "SEO Analysis failed for the crawled data." });
    }

    const mergedPages = (seoAnalysis.pages || []).map((analysis) => {
      const originalData = crawlData.find((p) => p.url === analysis.url);
      return {
        ...analysis,
        details: originalData || null,
      };
    });

    const mainPageData =
      crawlData.find((p) => p.url === targetUrl) || crawlData[0] || {};

    // Save Report to DB
    const report = await Report.create({
      project: projectId,
      user: req.user._id,
      score: seoAnalysis.overall_score || 0,
      improvements: (seoAnalysis.top_improvements || []).map((i) => i.issue),
      technicalDetails: {
        ...mainPageData,
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
    }).catch((err) => console.error("Activity logging failed:", err));

    // Update project lastScannedAt
    project.lastScannedAt = Date.now();
    await project
      .save()
      .catch((err) => console.error("Project update failed:", err));

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
    console.error("Crawl error detailed:", {
      message: err.message,
      stack: err.stack,
      projectId: req.body.projectId,
      url: req.body.url,
    });
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred during the process.",
    });
  }
};
