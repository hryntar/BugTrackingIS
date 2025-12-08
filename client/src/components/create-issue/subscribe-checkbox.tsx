import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import type { Control } from "react-hook-form";
import type { CreateIssueFormData } from "@/lib/validations/issue";

interface SubscribeCheckboxProps {
  control: Control<CreateIssueFormData>;
  disabled?: boolean;
}

export function SubscribeCheckbox({ control, disabled }: SubscribeCheckboxProps) {
  return (
    <FormField
      control={control}
      name="subscribeToUpdates"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-muted/30">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={disabled} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>Subscribe me to updates</FormLabel>
            <FormDescription>You'll receive notifications when this issue is updated or commented on</FormDescription>
          </div>
        </FormItem>
      )}
    />
  );
}
