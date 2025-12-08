import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";

import { issueService } from "@/services/issue.service";
import { createIssueSchema, type CreateIssueFormData } from "@/lib/validations/issue";
import type { Issue } from "@/lib/types";

const DEFAULT_FORM_VALUES: CreateIssueFormData = {
   title: "",
   description: "",
   priority: "MEDIUM",
   severity: "MINOR",
   environment: "",
   subscribeToUpdates: true,
};

export function useCreateIssue() {
   const navigate = useNavigate();

   const form = useForm<CreateIssueFormData>({
      resolver: zodResolver(createIssueSchema),
      defaultValues: DEFAULT_FORM_VALUES,
   });

   const createIssueMutation = useMutation({
      mutationFn: (data: CreateIssueFormData) => issueService.createIssue(data),
      onSuccess: (issue: Issue) => {
         navigate({ to: `/issues/${issue.id}` });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
         console.error("Failed to create issue:", error);
         form.setError("root", {
            message: error.response?.data?.error?.message || "Failed to create issue. Please try again.",
         });
      },
   });

   const handleSubmit = (data: CreateIssueFormData) => {
      const payload = {
         ...data,
         environment: data.environment && data.environment.trim() !== "" ? data.environment : undefined,
      };
      createIssueMutation.mutate(payload);
   };

   const handleCancel = () => {
      navigate({ to: "/" });
   };

   return {
      form,
      isSubmitting: createIssueMutation.isPending,
      handleSubmit,
      handleCancel,
   };
}
