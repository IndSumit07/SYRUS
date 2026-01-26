/**
 * Analyze a single page's data and return a score + improvements.
 * @param {Object} pageData - The data object returned from the crawler for a single page.
 */
export const analyzePageSeo = (pageData) => {
  const improvements = [];
  let score = 0;
  const weights = {
    meta: 30,
    structure: 20,
    content: 20,
    technical: 30,
  };

  // --- 1. META CHECKS (30 points) ---
  const { seo } = pageData;
  let metaScore = 0;
  const maxMetaScore = 30;

  // Title
  if (seo.title) {
    if (seo.title_length >= 10 && seo.title_length <= 60) {
      metaScore += 15;
    } else {
      metaScore += 8; // Present but poor length
      improvements.push("Title length should be between 10 and 60 characters.");
    }
  } else {
    improvements.push("Add a Title tag.");
  }

  // Description
  if (seo.meta_description) {
    if (seo.description_length >= 50 && seo.description_length <= 160) {
      metaScore += 15;
    } else {
      metaScore += 8; // Present but poor length
      improvements.push(
        "Meta description length should be between 50 and 160 characters.",
      );
    }
  } else {
    improvements.push("Add a Meta Description.");
  }

  // Normalize Meta Score to weight
  score += (metaScore / maxMetaScore) * weights.meta;

  // --- 2. STRUCTURE CHECKS (20 points) ---
  const { structure } = pageData;
  let structScore = 0;
  const maxStructScore = 20;

  const h1Count = structure.h1.length;
  if (h1Count === 1) {
    structScore += 20;
  } else if (h1Count === 0) {
    improvements.push("Add exactly one H1 tag.");
  } else {
    structScore += 10; // Multiple H1s is better than none but not ideal
    improvements.push("Use only one H1 tag per page.");
  }

  score += (structScore / maxStructScore) * weights.structure;

  // --- 3. CONTENT & MEDIA CHECKS (20 points) ---
  const { content, media } = pageData;
  let contentScore = 0;
  const maxContentScore = 20;

  // Word Count
  if (content.word_count > 300) {
    contentScore += 10;
  } else {
    improvements.push("Increase content word count (aim for >300 words).");
  }

  // Image Alt Tags
  const totalImages = media.total_images;
  const missingAlt = media.images_without_alt;

  if (totalImages === 0) {
    contentScore += 10; // No images means no broken alt tags, technically fine but bland.
  } else {
    const altRatio = (totalImages - missingAlt) / totalImages;
    contentScore += 10 * altRatio;
    if (missingAlt > 0) {
      improvements.push(`Add Alt text to ${missingAlt} images.`);
    }
  }

  score += (contentScore / maxContentScore) * weights.content;

  // --- 4. TECHNICAL CHECKS (30 points) ---
  const { status_code, load_time_ms, seo: tSeo, social } = pageData;
  let techScore = 0;
  const maxTechScore = 30;

  // Status Code
  if (status_code === 200) techScore += 10;
  else improvements.push(`Fix page status code (currently ${status_code}).`);

  // Load Time
  if (load_time_ms < 1000) techScore += 5;
  else if (load_time_ms < 2500) techScore += 3;
  else improvements.push("Improve page load speed (aim for <1s).");

  // Canonical
  if (tSeo.canonical) techScore += 5;
  else improvements.push("Add a Canonical link.");

  // Viewport
  if (tSeo.viewport) techScore += 5;
  else improvements.push("Add a Viewport meta tag for mobile responsiveness.");

  // Social (Bonus-ish inside tech)
  if (social.og_title || social.twitter_title) techScore += 5;
  else improvements.push("Add Open Graph or Twitter Card meta tags.");

  score += (techScore / maxTechScore) * weights.technical;

  return {
    url: pageData.url,
    score: Math.round(score),
    improvements,
  };
};

/**
 * Analyze all crawled pages and provide an overall report.
 * @param {Array} pagesData - Array of crawled page data objects.
 */
export const analyzeSiteSeo = (pagesData) => {
  if (!pagesData || pagesData.length === 0) return null;

  const pageResults = pagesData.map(analyzePageSeo);

  const totalScore = pageResults.reduce((acc, curr) => acc + curr.score, 0);
  const averageScore = Math.round(totalScore / pageResults.length);

  // Aggregate common improvements
  const commonImprovements = {};
  pageResults.forEach((p) => {
    p.improvements.forEach((imp) => {
      commonImprovements[imp] = (commonImprovements[imp] || 0) + 1;
    });
  });

  const topImprovements = Object.entries(commonImprovements)
    .sort(([, a], [, b]) => b - a)
    .map(([issue, count]) => ({ issue, count }));

  return {
    overall_score: averageScore,
    total_pages_analyzed: pagesData.length,
    top_improvements: topImprovements,
    pages: pageResults,
  };
};
