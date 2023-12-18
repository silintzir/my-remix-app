import { Stepper } from "@/components/builder/stepper";
import { InlineEdit } from "@/components/inline-edit";
import { DEFAULT_RESUME_TITLE, DEFAULT_SECTION_TITLES } from "@/lib/defaults";
import { getEnabledSteps } from "@/lib/steps";
import type { ResumeValues, Step } from "@/lib/types";
import { useSearchParams } from "@remix-run/react";
import { useFormContext } from "react-hook-form";
import { ClientOnly } from "remix-utils/client-only";

type Props = {
  step: Step;
};
export function StepHeader({ step }: Props) {
  const { watch } = useFormContext<ResumeValues>();
  const steps = getEnabledSteps(watch("meta.steps"));
  const [searchParams] = useSearchParams();
  const activeStep = (searchParams.get("step") || "start") as Step;

  const currentIndex = steps.indexOf(activeStep);

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold flex justify-center w-auto mb-2">
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
      </h2>
      <Stepper steps={steps} current={currentIndex} />
      <h3 className="text-lg font-semibold my-2">
        {currentIndex + 1}. {DEFAULT_SECTION_TITLES[step]}
      </h3>
    </div>
  );
}
