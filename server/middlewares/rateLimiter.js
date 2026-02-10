import rateLimit from "express-rate-limit";

export const scrapperLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many crawl requests. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message:
    "Too many auth requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});
