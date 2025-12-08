import { z } from "zod";

export const createIssueSchema = z.object({
   title: z
      .string()
      .min(1, "Title is required")
      .min(5, "Title must be at least 5 characters")
      .max(200, "Title must be less than 200 characters"),
   description: z
      .string()
      .min(1, "Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(5000, "Description must be less than 5000 characters"),
   priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"], {
      required_error: "Priority is required",
   }),
   severity: z.enum(["TRIVIAL", "MINOR", "MAJOR", "CRITICAL"], {
      required_error: "Severity is required",
   }),
   environment: z
      .string()
      .max(100, "Environment must be less than 100 characters")
      .optional()
      .nullable(),
   subscribeToUpdates: z.boolean().optional().default(true),
});

export type CreateIssueFormData = z.infer<typeof createIssueSchema>;
