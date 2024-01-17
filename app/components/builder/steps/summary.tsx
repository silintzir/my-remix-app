import type { ResumeValues } from "@/lib/types";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { TextareaInput } from "@/components/shadcn/TextareaInput";
import { useFetcher } from "@remix-run/react";
import { useAiContext } from "@/components/hooks/aiContext";
import { TextAlternatives } from "@/components/shadcn/TextAlternatives";
import { TextInput } from "@/components/shadcn/TextInput";

export function SummaryStep() {
  const { control, watch, setValue } = useFormContext<ResumeValues>();
  const lang = watch("meta.language");
  const enhancer = useFetcher<{ results: string[] }>({
    key: "summary-enhance",
  });
  const getContext = useAiContext();

  const summary = watch("resume.summary.content");
  const asObjective = watch("resume.summary.asObjective");
  const objectiveTarget = watch("resume.summary.objectiveTarget");

  return (
    <div className="space-y-4">
      <p className="small">
        A couple sentence recap of your experience and skills to date that will
        go at the top of your resume.
      </p>
      <FormField
        control={control}
        name="resume.summary.asObjective"
        render={({ field }) => (
          <FormItem className="flex items-center gap-4 space-y-0">
            <FormLabel>Treat as objective</FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      {asObjective ? (
        <TextInput
          control={control}
          name="resume.summary.objectiveTarget"
          placeholder="e.x. Get hired by Marathon Staffing"
          label="What is your target job"
        />
      ) : (
        <TextInput
          control={control}
          name="meta.steps.summary.title"
          placeholder="e.x. Senior Accountant"
          label="Title of your summary section"
        />
      )}

      <TextareaInput
        control={control}
        rows={7}
        name="resume.summary.content"
        label={
          <div className="flex justify-between items-center">
            <span>Content</span>
            <TextAlternatives
              fetcher={enhancer}
              endpoint="summary"
              context={{ ...getContext(), asObjective, objectiveTarget }}
              original={summary || ""}
              buttonLabel="Suggest/Enhance"
              update={(text: string) => {
                setValue("resume.summary.content", text, {
                  shouldDirty: true,
                });
              }}
              lang={lang}
            />
          </div>
        }
      />
    </div>
  );
}
