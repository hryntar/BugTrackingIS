import { z } from "zod";

const baseCreateIssueSchema = z.object({
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
   priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
   severity: z.enum(["TRIVIAL", "MINOR", "MAJOR", "CRITICAL"]),
   environment: z
      .string()
      .max(100, "Environment must be less than 100 characters")
      .optional()
      .or(z.literal("")),
   subscribeToUpdates: z.boolean(),
});

export const createIssueSchema = baseCreateIssueSchema;

export type CreateIssueFormData = z.infer<typeof baseCreateIssueSchema>;
