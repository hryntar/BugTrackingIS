import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control } from "react-hook-form";
import type { CreateIssueFormData } from "@/lib/validations/issue";

interface TitleFieldProps {
  control: Control<CreateIssueFormData>;
  disabled?: boolean;
}

export function TitleField({ control, disabled }: TitleFieldProps) {
  return (
    <FormField
      control={control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title *</FormLabel>
          <FormControl>
            <Input placeholder="Brief summary of the issue" {...field} disabled={disabled} />
          </FormControl>
          <FormDescription>A clear, concise title that describes the issue (5-200 characters)</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
