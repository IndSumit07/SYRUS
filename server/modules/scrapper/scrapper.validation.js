import { z } from "zod";

export const crawlSchema = z.object({
  url: z
    .string({ required_error: "URL is required" })
    .url("Invalid URL format"),
  maxPages: z.number().int().min(1).max(50).optional().default(10),
});
