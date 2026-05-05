import { z } from "zod";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const LLM_MODEL_NAME = "gemini-2.5-flash";
const LLM_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const LLM_ENABLED = Boolean(LLM_API_KEY);
const LLM_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS || 3500);
const LLM_MAX_PAGES = Number(process.env.LLM_MAX_PAGES || 1);

const normalizeConfidence = (value) => {
  const parsed = typeof value === "string" ? Number(value) : value;
  if (typeof parsed !== "number" || Number.isNaN(parsed)) return value;
  return parsed > 1 ? parsed / 100 : parsed;
};

const llmSchemaShape = {
  score: z.number().min(0).max(100),
  improvements: z.array(z.string()).min(1),
  summary: z.string(),
  priority_actions: z.array(z.string()),
  strengths: z.array(z.string()),
  risk_level: z.enum(["low", "medium", "high"]),
};

const llmSchemaFormat = z.object({
  ...llmSchemaShape,
  confidence: z.number().min(0).max(1),
});

const llmSchema = z.object({
  ...llmSchemaShape,
  confidence: z.preprocess(normalizeConfidence, z.number().min(0).max(1)),
});

const llmParser = StructuredOutputParser.fromZodSchema(llmSchemaFormat);

let cachedLlm = null;
const getLlm = () => {
  if (!LLM_ENABLED) return null;
  if (!cachedLlm) {
    cachedLlm = new ChatGoogleGenerativeAI({
      model: LLM_MODEL_NAME,
      temperature: 0.2,
      apiKey: LLM_API_KEY,
    });
  }
  return cachedLlm;
};

const buildLlmInput = (pageData) => {
  const schemaTypes = (pageData.schema || [])
    .map((item) => {
      const typeValue = item?.["@type"];
      return Array.isArray(typeValue)
        ? typeValue
        : typeValue
          ? [typeValue]
          : [];
    })
    .flat()
    .filter(Boolean)
    .slice(0, 10);

  return {
    url: pageData.url,
    status_code: pageData.status_code,
    load_time_ms: pageData.load_time_ms,
    seo: pageData.seo,
    social: pageData.social,
    schema_types: schemaTypes,
    structure: {
      h1: (pageData.structure?.h1 || []).slice(0, 3),
      h2: (pageData.structure?.h2 || []).slice(0, 5),
      h3_count: pageData.structure?.h3?.length || 0,
    },
    content: {
      word_count: pageData.content?.word_count || 0,
      text_sample: (pageData.content?.text_sample || "").slice(0, 600),
    },
    media: {
      total_images: pageData.media?.total_images || 0,
      images_without_alt: pageData.media?.images_without_alt || 0,
    },
    links: {
      total_links: pageData.links?.total_links || 0,
      internal_links: pageData.links?.internal_links || 0,
      external_links: pageData.links?.external_links || 0,
    },
  };
};

const stripJsonFence = (text) =>
  text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

const extractJsonBlock = (text) => {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : text;
};

const withTimeout = (promise, ms) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve({ timeout: true }), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });

const analyzePageSeoLlm = async (pageData) => {
  const llm = getLlm();
  if (!llm) return null;

  const prompt = new PromptTemplate({
    template: `You are a senior SEO auditor. Use ONLY the provided page data and do not infer anything that is not present.\n\nScore the page from 0-100 using clear SEO best practices across meta, structure, content, technical, social, and schema presence. If a signal is missing, treat it as a weakness.\n\nReturn JSON that exactly matches the schema instructions. Keep improvements actionable and specific to the provided data. Confidence must be between 0 and 1.\n\n{format_instructions}\n\nPage data (JSON):\n{page_json}`,
    inputVariables: ["page_json"],
    partialVariables: {
      format_instructions: llmParser.getFormatInstructions(),
    },
  });

  const invokeLlm = async () => {
    const message = await prompt.format({
      page_json: JSON.stringify(buildLlmInput(pageData)),
    });
    const response = await llm.invoke(message);
    const rawText =
      typeof response?.content === "string"
        ? response.content
        : JSON.stringify(response?.content ?? "");
    const cleaned = extractJsonBlock(stripJsonFence(rawText.trim()));

    try {
      return await llmParser.parse(cleaned);
    } catch (parseError) {
      const parsedJson = JSON.parse(cleaned);
      return llmSchema.parse(parsedJson);
    }
  };

  try {
    const result = await withTimeout(invokeLlm(), LLM_TIMEOUT_MS);
    if (result?.timeout) return null;
    return result;
  } catch (error) {
    console.error("LLM SEO analysis failed:", error?.message || error);
    return null;
  }
};


export const analyzePageSeo = async (pageData) => {
  const rules = analyzePageSeoRules(pageData);
  const llmResult = await analyzePageSeoLlm(pageData);

  const finalScore = llmResult?.score ?? rules.score;
  const finalImprovements =
    llmResult?.improvements?.length > 0
      ? llmResult.improvements
      : rules.improvements;

  return {
    url: pageData.url,
    score: Math.round(finalScore),
    improvements: finalImprovements,
    score_source: llmResult ? "llm" : "rules",
    ai: llmResult,
  };
};

const buildRulesResult = (pageData) => {
  const rules = analyzePageSeoRules(pageData);
  return {
    url: pageData.url,
    score: Math.round(rules.score),
    improvements: rules.improvements,
    score_source: "rules",
    ai: null,
  };
};

function analyzePageSeoRules(pageData) {
  const improvements = [];
  let score = 0;
  const weights = {
    meta: 30,
    structure: 20,
    content: 20,
    technical: 30,
  };

  
  const { seo } = pageData;
  let metaScore = 0;
  const maxMetaScore = 30;

  
  if (seo.title) {
    if (seo.title_length >= 10 && seo.title_length <= 60) {
      metaScore += 15;
    } else {
      metaScore += 8; 
      improvements.push("Title length should be between 10 and 60 characters.");
    }
  } else {
    improvements.push("Add a Title tag.");
  }

  
  if (seo.meta_description) {
    if (seo.description_length >= 50 && seo.description_length <= 160) {
      metaScore += 15;
    } else {
      metaScore += 8; 
      improvements.push(
        "Meta description length should be between 50 and 160 characters.",
      );
    }
  } else {
    improvements.push("Add a Meta Description.");
  }

  
  score += (metaScore / maxMetaScore) * weights.meta;

  
  const { structure } = pageData;
  let structScore = 0;
  const maxStructScore = 20;

  const h1Count = structure.h1.length;
  if (h1Count === 1) {
    structScore += 20;
  } else if (h1Count === 0) {
    improvements.push("Add exactly one H1 tag.");
  } else {
    structScore += 10; 
    improvements.push("Use only one H1 tag per page.");
  }

  score += (structScore / maxStructScore) * weights.structure;

  
  const { content, media } = pageData;
  let contentScore = 0;
  const maxContentScore = 20;

  
  if (content.word_count > 300) {
    contentScore += 10;
  } else {
    improvements.push("Increase content word count (aim for >300 words).");
  }

  
  const totalImages = media.total_images;
  const missingAlt = media.images_without_alt;

  if (totalImages === 0) {
    contentScore += 10; 
  } else {
    const altRatio = (totalImages - missingAlt) / totalImages;
    contentScore += 10 * altRatio;
    if (missingAlt > 0) {
      improvements.push(`Add Alt text to ${missingAlt} images.`);
    }
  }

  score += (contentScore / maxContentScore) * weights.content;

  
  const { status_code, load_time_ms, seo: tSeo, social } = pageData;
  let techScore = 0;
  const maxTechScore = 30;

  
  if (status_code === 200) techScore += 10;
  else improvements.push(`Fix page status code (currently ${status_code}).`);

  
  if (load_time_ms < 1000) techScore += 5;
  else if (load_time_ms < 2500) techScore += 3;
  else improvements.push("Improve page load speed (aim for <1s).");

  
  if (tSeo.canonical) techScore += 5;
  else improvements.push("Add a Canonical link.");

  
  if (tSeo.viewport) techScore += 5;
  else improvements.push("Add a Viewport meta tag for mobile responsiveness.");

  
  if (social.og_title || social.twitter_title) techScore += 5;
  else improvements.push("Add Open Graph or Twitter Card meta tags.");

  score += (techScore / maxTechScore) * weights.technical;

  return {
    score: Math.round(score),
    improvements,
  };
}


export const analyzeSiteSeo = async (pagesData) => {
  if (!pagesData || pagesData.length === 0) return null;

  const pageResults = [];
  const llmPagesLimit = LLM_ENABLED ? Math.max(0, LLM_MAX_PAGES) : 0;

  for (let index = 0; index < pagesData.length; index += 1) {
    const pageData = pagesData[index];
    if (index < llmPagesLimit) {
      pageResults.push(await analyzePageSeo(pageData));
    } else {
      pageResults.push(buildRulesResult(pageData));
    }
  }

  const totalScore = pageResults.reduce((acc, curr) => acc + curr.score, 0);
  const averageScore = Math.round(totalScore / pageResults.length);

  
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
