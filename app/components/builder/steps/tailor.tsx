import { Button } from "@/components/ui/button";
import { useFetcher } from "@remix-run/react";
import { useCallback } from "react";
import { Loader2, Wand } from "lucide-react";
import { get, useFormContext } from "react-hook-form";
import type { AdapterSuggestion, ResumeValues, WorkRecord } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TextareaInput } from "@/components/shadcn/TextareaInput";
import { getEducationTitle, getExperienceTitle } from "@/lib/resume";
import { StepHeader } from "@/components/builder/header";

type Props = {
  id: number;
  values: ResumeValues;
};

export function TailorStep({ id, values }: Props) {
  const { getValues, control, watch } = useFormContext<ResumeValues>();

  const content = watch("meta.tailor.content");

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
  const education = get(values, "resume.education", []) as WorkRecord[];

  const suggestEnhancements = useCallback(() => {
    const resume = getValues();
    if (content) {
      const action = `/ai/tailor/suggest?id=${id}`;
      fetcher.submit(
        {
          data: JSON.stringify({
            language: "en",
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
  }, [content, fetcher, getValues, id]);

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
      <StepHeader step="tailor" />
      <p className="small mb-4 muted">
        Enter the description from a job posting and then click the button to
        get suggestions for your resume.
      </p>
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
            <span>Please wait</span>
          </>
        ) : (
          <>
            <Wand className="h-4 w-4 mr-2" />
            <span> Suggest enhancements</span>
          </>
        )}
      </Button>

      {Object.keys(suggestions).length > 0 && (
        <div className="space-y-2">
          <div className="font-semibold">Suggestions</div>
          <p className="text-left muted small">
            ResumeRunner has compared your resume to the requirements of your
            selected job and has suggested bullets below. Only incorporate
            bullets that genuinely reflect your experience.
          </p>

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
                          "flex-grow small flex gap-2 items-center text-primary",
                          section !== "" ? "line-through text-[#009900]" : ""
                          // selected ? "text-[#009900]" : ""
                        )}
                      >
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
                          <option value="">Do not use</option>
                          {work.length > 0 && (
                            <optgroup label="Work experience">
                              {work.map((exp) => {
                                const value = `work::${exp.uuid}`;
                                return (
                                  <option
                                    key={exp.uuid}
                                    value={value}
                                    selected={section === value}
                                  >
                                    {getExperienceTitle(exp)}
                                  </option>
                                );
                              })}
                            </optgroup>
                          )}
                          {education.length > 0 && (
                            <optgroup label="Education">
                              {education.map((edu) => {
                                const value = `education::${edu.uuid}`;
                                return (
                                  <option
                                    key={edu.uuid}
                                    value={value}
                                    selected={section === value}
                                  >
                                    {getEducationTitle(edu)}
                                  </option>
                                );
                              })}
                            </optgroup>
                          )}
                          <optgroup label="Skills">
                            <option
                              value="skills"
                              selected={section === "skills"}
                            >
                              Skills
                            </option>
                          </optgroup>
                          <optgroup label="Accomplishments">
                            <option
                              value="accomplishments"
                              selected={section === "accomplishments"}
                            >
                              Accomplishments
                            </option>
                          </optgroup>
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
