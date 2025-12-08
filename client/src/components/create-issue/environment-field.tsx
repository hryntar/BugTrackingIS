import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control } from "react-hook-form";
import type { CreateIssueFormData } from "@/lib/validations/issue";

interface EnvironmentFieldProps {
  control: Control<CreateIssueFormData>;
  disabled?: boolean;
}

export function EnvironmentField({ control, disabled }: EnvironmentFieldProps) {
  return (
    <FormField
      control={control}
      name="environment"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Environment</FormLabel>
          <FormControl>
            <Input placeholder="e.g., production, staging, Chrome 120, v2.5.1" {...field} disabled={disabled} />
          </FormControl>
          <FormDescription>Where did this issue occur? (e.g., prod, staging, browser version, product version)</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
