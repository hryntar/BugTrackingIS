import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { Control } from "react-hook-form";
import type { CreateIssueFormData } from "@/lib/validations/issue";

interface DescriptionFieldProps {
  control: Control<CreateIssueFormData>;
  disabled?: boolean;
}

export function DescriptionField({ control, disabled }: DescriptionFieldProps) {
  return (
    <FormField
      control={control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description *</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Detailed description of the issue, including steps to reproduce..."
              className="min-h-[150px] resize-y"
              {...field}
              disabled={disabled}
            />
          </FormControl>
          <FormDescription>
            Provide detailed information about the issue, including steps to reproduce, expected behavior, and actual behavior (10-5000 characters)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
