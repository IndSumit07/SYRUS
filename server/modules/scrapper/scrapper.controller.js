import { crawlWebsite } from "./scrapper.service.js";
import { crawlSchema } from "./scrapper.validation.js";
import { analyzeSiteSeo } from "../seo/seo.service.js";

export const crawl = async (req, res) => {
  const parsed = crawlSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten().fieldErrors);
  }

  try {
    const { url, maxPages } = parsed.data;

    // 1. Perform the crawl
    const crawlData = await crawlWebsite(url, maxPages);

    // 2. Perform SEO Analysis
    const seoAnalysis = analyzeSiteSeo(crawlData);

    // 3. Merge results for a clean response
    // We map over the analysis pages to attach the full crawl data to each entry
    const mergedPages = seoAnalysis.pages.map((analysis) => {
      const originalData = crawlData.find((p) => p.url === analysis.url);
      return {
        ...analysis,
        details: originalData || null,
      };
    });

    res.json({
      message: "Crawl and Analysis completed successfully",
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
