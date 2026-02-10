import { chromium } from "playwright";
import * as cheerio from "cheerio";
import { URL } from "url";

const getNormalizedUrl = (link, baseUrl, rootHostname) => {
  try {
    const fullUrl = new URL(link, baseUrl);
    if (!["http:", "https:"].includes(fullUrl.protocol)) return null;
    fullUrl.hash = "";
    if (fullUrl.hostname !== rootHostname) return null;
    return fullUrl.href;
  } catch (err) {
    return null;
  }
};

const _scrapePageData = async (page, url) => {
  try {
    const startTime = Date.now();

    const response = await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    if (!response) {
      console.warn(`No response received for ${url}`);
      return { data: null, rawLinks: [] };
    }

    console.log(`Scraped ${url} [Status: ${response.status()}]`);
    const statusCode = response.status();
    const html = await page.content();
    const loadTime = Date.now() - startTime;

    const $ = cheerio.load(html);

    /* ---------- BASIC PAGE DATA ---------- */
    const title = $("title").text().trim();
    const metaDescription = $('meta[name="description"]').attr("content") || "";
    const canonical = $('link[rel="canonical"]').attr("href") || "";

    /* ---------- HEADINGS ---------- */
    const headings = {
      h1: $("h1")
        .map((i, el) => $(el).text().trim())
        .get(),
      h2: $("h2")
        .map((i, el) => $(el).text().trim())
        .get(),
      h3: $("h3")
        .map((i, el) => $(el).text().trim())
        .get(),
    };

    /* ---------- CONTENT ---------- */
    const bodyText = $("body").text().replace(/\s+/g, " ").trim();
    const wordCount = bodyText.split(" ").length;

    /* ---------- IMAGES ---------- */
    const images = $("img")
      .map((i, el) => ({
        src: $(el).attr("src"),
        alt: $(el).attr("alt") || null,
      }))
      .get();

    const imagesWithoutAlt = images.filter((img) => !img.alt).length;

    /* ---------- LINKS ---------- */
    const rawLinks = $("a[href]")
      .map((i, el) => $(el).attr("href"))
      .get();

    const internalLinksCount = rawLinks.filter(
      (l) => l.startsWith("/") || l.includes(new URL(url).hostname),
    ).length;

    const externalLinksCount = rawLinks.filter(
      (l) => l.startsWith("http") && !l.includes(new URL(url).hostname),
    ).length;

    /* ---------- TECHNICAL SEO ---------- */
    const robots = $('meta[name="robots"]').attr("content") || "index, follow";
    const viewport = $('meta[name="viewport"]').attr("content") || null;
    const lang = $("html").attr("lang") || null;
    const favicon =
      $('link[rel="icon"], link[rel="shortcut icon"]').attr("href") || null;

    /* ---------- SOCIAL TAGS (OG & Twitter) ---------- */
    const social = {
      og_title: $('meta[property="og:title"]').attr("content") || null,
      og_description:
        $('meta[property="og:description"]').attr("content") || null,
      og_image: $('meta[property="og:image"]').attr("content") || null,
      og_url: $('meta[property="og:url"]').attr("content") || null,
      twitter_card: $('meta[name="twitter:card"]').attr("content") || null,
      twitter_title: $('meta[name="twitter:title"]').attr("content") || null,
      twitter_description:
        $('meta[name="twitter:description"]').attr("content") || null,
      twitter_image: $('meta[name="twitter:image"]').attr("content") || null,
    };

    /* ---------- SCHEMA MARKUP (JSON-LD) ---------- */
    const jsonLd = [];
    $('script[type="application/ld+json"]').each((i, el) => {
      try {
        const data = JSON.parse($(el).html());
        jsonLd.push(data);
      } catch (e) {
        // Ignore invalid JSON
      }
    });

    return {
      data: {
        url,
        status_code: statusCode,
        load_time_ms: loadTime,
        seo: {
          title,
          title_length: title.length,
          meta_description: metaDescription,
          description_length: metaDescription.length,
          canonical,
          robots,
          viewport,
          lang,
          favicon,
        },
        social,
        schema: jsonLd,
        structure: headings,
        content: {
          word_count: wordCount,
          text_sample: bodyText.slice(0, 1000),
        },
        media: {
          total_images: images.length,
          images_without_alt: imagesWithoutAlt,
          all_images: images,
        },
        links: {
          total_links: rawLinks.length,
          internal_links: internalLinksCount,
          external_links: externalLinksCount,
          all_links: rawLinks,
        },
      },
      rawLinks,
    };
  } catch (error) {
    console.error(`Failed to scrape ${url}: ${error.message}`);
    return { data: null, rawLinks: [] };
  }
};

export const scrapePage = async (url) => {
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
      ],
    });

    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });

    const page = await context.newPage();
    const { data, rawLinks } = await _scrapePageData(page, url);

    if (!data) {
      console.error(`Page data extraction failed for ${url}`);
      throw new Error("No data retrieved from page");
    }
    return data;
  } catch (error) {
    console.error("Scraping failure:", error);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
};

export const crawlWebsite = async (baseUrl, maxPages = 50) => {
  let browser;
  const results = [];
  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
      ],
    });

    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });

    const page = await context.newPage();

    const rootHostname = new URL(baseUrl).hostname;
    const startUrlNormalized =
      getNormalizedUrl(baseUrl, baseUrl, rootHostname) || baseUrl;

    const visited = new Set();
    const queue = [startUrlNormalized];

    while (queue.length > 0 && visited.size < maxPages) {
      const currentUrl = queue.shift();

      if (visited.has(currentUrl)) continue;
      visited.add(currentUrl);

      const { data, rawLinks } = await _scrapePageData(page, currentUrl);

      if (data) {
        results.push(data);

        for (const link of rawLinks) {
          const normalized = getNormalizedUrl(link, currentUrl, rootHostname);
          if (
            normalized &&
            !visited.has(normalized) &&
            !queue.includes(normalized)
          ) {
            queue.push(normalized);
          }
        }
      }
    }
    return results;
  } catch (error) {
    console.error("Crawl process failed:", error);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
};
