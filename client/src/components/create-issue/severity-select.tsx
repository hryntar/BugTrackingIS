import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Control } from "react-hook-form";
import type { CreateIssueFormData } from "@/lib/validations/issue";

interface SeveritySelectProps {
  control: Control<CreateIssueFormData>;
  disabled?: boolean;
}

const SEVERITY_OPTIONS = [
  { value: "TRIVIAL", label: "Trivial", color: "bg-gray-400" },
  { value: "MINOR", label: "Minor", color: "bg-blue-400" },
  { value: "MAJOR", label: "Major", color: "bg-orange-400" },
  { value: "CRITICAL", label: "Critical", color: "bg-red-400" },
] as const;

export function SeveritySelect({ control, disabled }: SeveritySelectProps) {
  return (
    <FormField
      control={control}
      name="severity"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Severity *</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {SEVERITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${option.color}`} />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>How serious is the impact?</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
