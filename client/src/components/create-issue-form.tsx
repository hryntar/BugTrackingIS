import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useCreateIssue } from "@/hooks/use-create-issue";
import {
  FormHeader,
  TitleField,
  DescriptionField,
  PrioritySelect,
  SeveritySelect,
  EnvironmentField,
  SubscribeCheckbox,
  FormError,
  FormActions,
} from "@/components/create-issue";

export function CreateIssueForm() {
  const { form, isSubmitting, handleSubmit, handleCancel } = useCreateIssue();

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <FormHeader />

      <Card>
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
          <CardDescription>Fill in the information below to create a new bug report. All fields marked with * are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <TitleField control={form.control} disabled={isSubmitting} />

              <DescriptionField control={form.control} disabled={isSubmitting} />

              <div className="grid gap-6 sm:grid-cols-2">
                <PrioritySelect control={form.control} disabled={isSubmitting} />
                <SeveritySelect control={form.control} disabled={isSubmitting} />
              </div>

              <EnvironmentField control={form.control} disabled={isSubmitting} />

              <SubscribeCheckbox control={form.control} disabled={isSubmitting} />

              {form.formState.errors.root?.message && <FormError message={form.formState.errors.root.message} />}

              <FormActions isSubmitting={isSubmitting} onCancel={handleCancel} />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
