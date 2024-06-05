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
import { useTranslation } from "react-i18next";

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

  const hasText = (summary || "").trim().length > 0;
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <p className="small">{t("summary.intro")}</p>
      <FormField
        control={control}
        name="resume.summary.asObjective"
        render={({ field }) => (
          <FormItem className="flex items-center gap-4 space-y-0">
            <FormLabel>{t("summary.treat_as")}</FormLabel>
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
          label={t("summary.what_is")}
        />
      ) : (
        <TextInput
          control={control}
          name="meta.steps.summary.title"
          placeholder="e.x. Senior Accountant"
          label={t("summary.summary_title")}
        />
      )}

      <TextareaInput
        control={control}
        rows={7}
        name="resume.summary.content"
        label={
          <div className="flex justify-between items-center">
            <span>{t("summary.content")}</span>
            <TextAlternatives
              fetcher={enhancer}
              endpoint="summary"
              context={{ ...getContext(), asObjective, objectiveTarget }}
              original={summary || ""}
              buttonLabel={
                (hasText ? (
                  <strong>{t("builder.ai_enhance")}</strong>
                ) : (
                  <strong>{t("builder.ai_suggest")}</strong>
                )) as any
              }
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
