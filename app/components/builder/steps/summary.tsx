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

export function SummaryStep() {
  const { control, watch, setValue } = useFormContext<ResumeValues>();
  const lang = watch("meta.language");
  const enhancer = useFetcher<{ results: string[] }>({
    key: "summary-enhance",
  });
  const getContext = useAiContext();

  const summary = watch("resume.summary.content");
  const asObjective = watch("resume.summary.asObjective");

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
      <TextareaInput
        control={control}
        rows={7}
        name="resume.summary.content"
        label={
          <div className="flex justify-between items-center">
            <span>Summary</span>
            <TextAlternatives
              fetcher={enhancer}
              endpoint="summary"
              context={{ ...getContext(), asObjective }}
              original={summary || ""}
              buttonLabel="Suggest/Enhance"
              update={(text: string) => {
                setValue("resume.summary.content", text);
              }}
              lang={lang}
            />
          </div>
        }
      />
    </div>
  );
}
