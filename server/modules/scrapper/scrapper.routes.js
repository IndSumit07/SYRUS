import express from "express";
import { crawl } from "./scrapper.controller.js";
import { scrapperLimiter } from "../../middlewares/rateLimiter.js";

const scrapperRouter = express.Router();

scrapperRouter.post("/crawl", scrapperLimiter, crawl);

export default scrapperRouter;
