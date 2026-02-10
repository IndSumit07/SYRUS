import express from "express";
import { crawl } from "./scrapper.controller.js";
import { scrapperLimiter } from "../../middlewares/rateLimiter.js";

import { protect } from "../../middlewares/auth.middleware.js";

const scrapperRouter = express.Router();

scrapperRouter.post("/crawl", protect, scrapperLimiter, crawl);

export default scrapperRouter;
