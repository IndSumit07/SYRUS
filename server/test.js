import { crawlWebsite } from "./modules/scrapper/scrapper.service.js";

(async () => {
  console.log("Starting crawl...");
  // Crawl up to 3 pages
  const data = await crawlWebsite("https://karigar-link.vercel.app", 3);
  console.log(`Successfully crawled ${data.length} pages.`);

  if (data.length > 0) {
    console.log("Example data for first page (Full Structure):");
    console.log(JSON.stringify(data[0], null, 2));
  }
})();
