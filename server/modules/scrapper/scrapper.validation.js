import { z } from "zod";

export const crawlSchema = z.object({
  projectId: z.string({ required_error: "Project ID is required" }),
  url: z.string().url("Invalid URL format").optional(),
  maxPages: z.number().int().min(1).max(50).optional().default(10),
});
