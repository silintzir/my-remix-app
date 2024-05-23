import { Stepper } from "@/components/builder/stepper-2";
import { InlineEdit } from "@/components/inline-edit";
import { DEFAULT_RESUME_TITLE, DEFAULT_SECTION_TITLES } from "@/lib/defaults";
import { getEnabledSteps } from "@/lib/steps";
import type { ResumeValues, Step } from "@/lib/types";
import { useSearchParams } from "@remix-run/react";
import { AlertCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { ClientOnly } from "remix-utils/client-only";
import { AutoSavedFeedback } from "./auto-saved-feedback";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { TranslateModal } from "./translate-modal";
import { useTranslation } from "react-i18next";

type Props = {
  step: Step;
  isSaving: boolean;
  hasErrors: boolean;
  children: ReactNode;
  resumeId: number;
  showStepper?: boolean;
  showStatus?: boolean;
  titleMode?: "resume" | "step";
  editable?: boolean;
};
export function StepHeader({
  step,
  isSaving,
  hasErrors,
  children,
  resumeId,
  showStepper = true,
  showStatus = true,
  titleMode = "resume",
  editable = true,
}: Props) {
  const { watch } = useFormContext<ResumeValues>();
  const steps = getEnabledSteps(watch("meta.steps"));
  const [searchParams] = useSearchParams();
  const activeStep = (searchParams.get("step") || "start") as Step;

  const currentIndex = steps.indexOf(activeStep);
  const { t } = useTranslation();

  return (
    <>
      <h2 className="text-xl font-semibold flex flex-col items-center gap-2 w-auto mb-2">
        <div
          className="flex gap-2 items-center"
          style={{ width: titleMode === "resume" ? "" : "100%" }}
        >
          {titleMode === "resume" ? (
            <>
              <TranslateModal resumeId={resumeId} />
              <ClientOnly fallback={<span>{DEFAULT_RESUME_TITLE}</span>}>
                {() =>
                  editable ? (
                    <InlineEdit
                      showEditIcon
                      defaultValue={DEFAULT_RESUME_TITLE}
                      name="meta.title"
                      title={t("builder.edit_resume_title")}
                    />
                  ) : (
                    <span>{DEFAULT_RESUME_TITLE}</span>
                  )
                }
              </ClientOnly>
            </>
          ) : (
            <ClientOnly
              fallback={<span>{t(DEFAULT_SECTION_TITLES[step])}</span>}
            >
              {() =>
                editable ? (
                  <InlineEdit
                    showEditIcon
                    defaultValue={t(DEFAULT_SECTION_TITLES[step])}
                    name={`meta.steps.${step}.title`}
                    title={t("builder.edit_section_title")}
                  />
                ) : (
                  <span>{t(DEFAULT_SECTION_TITLES[step])}</span>
                )
              }
            </ClientOnly>
          )}
        </div>

        {showStatus && (
          <div className="flex justify-center">
            {hasErrors ? (
              <span className="text-destructive flex items-center small">
                <AlertCircle className="w-4 h-4 mr-2" />
                {t("builder.fix_errors")}
              </span>
            ) : (
              <div className={cn({ muted: !isSaving })}>
                <AutoSavedFeedback isSaving={isSaving} />
              </div>
            )}
          </div>
        )}
      </h2>
      {showStepper && (
        <Stepper
          title={t(DEFAULT_SECTION_TITLES[step])}
          steps={steps}
          current={currentIndex}
        />
      )}
      {children}
    </>
  );
}
