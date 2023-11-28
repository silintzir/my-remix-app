import { Stepper } from "@/components/builder/stepper";
import { InlineEdit } from "@/components/inline-edit";
import { DEFAULT_RESUME_TITLE, DEFAULT_SECTION_TITLES } from "@/lib/defaults";
import { getEnabledSteps, hasEditableTitle } from "@/lib/steps";
import { ResumeValues, Step } from "@/lib/types"
import { useSearchParams } from "@remix-run/react";
import { useFormContext } from "react-hook-form";
import { ClientOnly } from "remix-utils/client-only";

type Props = {
  step: Step;
}
export function StepHeader({ step }: Props) {
  const { watch } = useFormContext<ResumeValues>();
  const steps = getEnabledSteps(watch('meta.steps'));
  const [searchParams] = useSearchParams();
  const activeStep = (searchParams.get('step') || "start") as Step;

  const currentIndex = steps.indexOf(activeStep);

  return <div className="mb-4">
    <h3 className="text-base font-bold sm:text-md flex justify-between w-auto mb-2">
      <div className="flex items-center gap-1">
        {currentIndex + 1}. {hasEditableTitle(step) ? (
          <ClientOnly fallback={<span>{DEFAULT_SECTION_TITLES[step]}</span>}>
            {() => (
              <InlineEdit
                showEditIcon
                name={`meta.steps.${step}.title`}
                defaultValue={DEFAULT_SECTION_TITLES[step]}
                title="Edit section title"
              />

            )}
          </ClientOnly>
        ) : (
          <span>{DEFAULT_SECTION_TITLES[step]}</span>
        )}
      </div>
      <ClientOnly fallback={<span>{DEFAULT_RESUME_TITLE}</span>}>
        {() => (
          <InlineEdit
            showEditIcon
            defaultValue={DEFAULT_RESUME_TITLE}
            name="meta.title"
            title="Edit resume title"
          />
        )}
      </ClientOnly>
    </h3>
    <Stepper steps={steps} current={currentIndex} />
  </div>

}
