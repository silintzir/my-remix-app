import { Button } from "@/components/ui/button";
import { useFetcher } from "@remix-run/react";
import { useCallback } from "react";
import { CheckIcon, Loader2, Wand } from "lucide-react";
import { get, useFormContext } from "react-hook-form";
import type {
  AdapterSuggestion,
  EducationRecord,
  ResumeValues,
  WorkRecord,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { TextareaInput } from "@/components/shadcn/TextareaInput";
import { getEducationTitle, getExperienceTitle } from "@/lib/resume";
import { useTranslation } from "react-i18next";

type Props = {
  id: number;
  values: ResumeValues;
};

export function TailorStep({ id, values }: Props) {
  const { getValues, control, watch } = useFormContext<ResumeValues>();
  const lang = watch("meta.language");

  const content = watch("meta.tailor.content");
  const { t } = useTranslation();

  const fetcher = useFetcher({
    key: "tailor-suggestions",
  });
  const appender = useFetcher({
    key: "tailor-appender",
  });
  const { state } = fetcher;

  const suggestions = get(values, "meta.tailor.suggestions", []) as Record<
    string,
    AdapterSuggestion
  >;

  const work = get(values, "resume.work", []) as WorkRecord[];
  const education = get(values, "resume.education", []) as EducationRecord[];

  const suggestEnhancements = useCallback(() => {
    const resume = getValues();
    if (content) {
      const action = `/ai/tailor/suggest?id=${id}`;
      fetcher.submit(
        {
          data: JSON.stringify({
            language: lang,
            jobDescription: content,
            resume,
            maxNewEntries: 5,
            temperature: 0.6,
          }),
        },
        { action, method: "POST" }
      );
    } else {
      window.alert("Please provide a description first");
      return;
    }
  }, [content, fetcher, getValues, id, lang]);

  const appendSuggestion = useCallback(
    (uuid: string, section: string) => {
      const action = `/ai/tailor/append?id=${id}`;
      appender.submit(
        {
          data: JSON.stringify({
            uuid,
            section,
          }),
        },
        {
          method: "POST",
          action,
        }
      );
    },
    [appender, id]
  );

  return (
    <div className="space-y-4">
      <p className="small mb-4 muted">{t("tailor.intro")}</p>
      <TextareaInput control={control} name="meta.tailor.content" rows={10} />
      <Button
        type="button"
        variant="outline"
        className="w-full bg-blue-600 hover:bg-blue-600 hover:opacity-80 text-white hover:text-white"
        onClick={suggestEnhancements}
      >
        {state === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            <span>{t("base.please_wait")}</span>
          </>
        ) : (
          <>
            <Wand className="h-4 w-4 mr-2" />
            <span>{t("builder.ai_enhance")}</span>
          </>
        )}
      </Button>

      {Object.keys(suggestions).length > 0 && (
        <div className="space-y-2">
          <div className="font-semibold">{t("base.suggestions")}</div>
          <p className="text-left muted small">{t("tailor.instructions")}</p>

          <div className="mt-2">
            <ul className="list-disc text-left">
              {Object.keys(suggestions).map((uuid) => {
                const { bullet, section } = suggestions[
                  uuid
                ] as AdapterSuggestion;
                return (
                  <li key={uuid}>
                    <div className="cursor-pointer bg-base-300 flex justify-start items-center gap-2 py-2 rounded-md">
                      <div
                        className={cn(
                          "flex-grow small flex gap-2 items-center text-primary"

                          // selected ? "text-[#009900]" : ""
                        )}
                      >
                        {section !== "" && (
                          <span className="flex font-bold text-[#009900]">
                            [&nbsp;
                            <CheckIcon className="h-4 w-4 mr-0.5" />
                            Added&nbsp;]
                          </span>
                        )}
                        {bullet}
                      </div>
                      <div>
                        <select
                          className="px-2 py-1 rounded bg-white shadow border-muted w-32 small"
                          onChange={(evt) => {
                            appendSuggestion(
                              uuid as string,
                              evt.currentTarget.value
                            );
                          }}
                        >
                          <option value="">{t("tailor.do_not_use")}</option>
                          {values.meta.steps.work.enabled &&
                            work.length > 0 && (
                              <optgroup label={t("Experience")}>
                                {work.map((exp) => {
                                  const value = `work::${exp.uuid}`;
                                  return (
                                    <option
                                      key={exp.uuid}
                                      value={value}
                                      selected={section === value}
                                    >
                                      {getExperienceTitle(exp) ||
                                        t("builder.not_specified")}
                                    </option>
                                  );
                                })}
                              </optgroup>
                            )}
                          {values.meta.steps.education.enabled &&
                            education.length > 0 && (
                              <optgroup label={t("Education")}>
                                {education.map((edu) => {
                                  const value = `education::${edu.uuid}`;
                                  return (
                                    <option
                                      key={edu.uuid}
                                      value={value}
                                      selected={section === value}
                                    >
                                      {getEducationTitle(edu) ||
                                        t("builder.not_specified")}
                                    </option>
                                  );
                                })}
                              </optgroup>
                            )}
                          {values.meta.steps.skills.enabled && (
                            <optgroup label={t("Skills")}>
                              <option
                                value="skills"
                                selected={section === "skills"}
                              >
                                {t("Skills")}
                              </option>
                            </optgroup>
                          )}
                          {values.meta.steps.accomplishments.enabled && (
                            <optgroup label={t("Accomplishments")}>
                              <option
                                value="accomplishments"
                                selected={section === "accomplishments"}
                              >
                                {t("Accomplishments")}
                              </option>
                            </optgroup>
                          )}
                        </select>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
