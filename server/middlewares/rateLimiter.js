import rateLimit from "express-rate-limit";

export const scrapperLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many crawl requests. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  message:
    "Too many auth requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});
