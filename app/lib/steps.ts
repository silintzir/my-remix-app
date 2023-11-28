import type { ResumeValues, Step, StepConfig } from "@/lib/types";
import { filter, pick, mapValues, values, map } from "lodash-es";
import { DEFAULT_SECTION_TITLES, DEFAULT_STEPS } from "./defaults";

export function getEnabledSteps(config: Record<Step, StepConfig>) {
  const ordered = Object.keys(DEFAULT_SECTION_TITLES);
  const picked = pick(config, ordered);
  const collection = values(mapValues(picked, (v, k) => ({ ...v, step: k })));
  return map(filter(collection, m => m.enabled), 'step') as Step[];
}

type AdjacentSteps = {
  previous: Step | null;
  next: Step | null;
};
export function getAdjacentSteps(
  currentStep: Step,
  values: ResumeValues
): AdjacentSteps {
  const steps =
    values.meta?.mode === "standard" ? DEFAULT_STEPS : getEnabledSteps(values.meta.steps);
  const currentIndex = steps.indexOf(currentStep);

  // Object to hold the previous and next steps
  const adjacentSteps: AdjacentSteps = {
    previous: null,
    next: null,
  };

  // If current step is not found or it's the only step
  if (currentIndex === -1 || steps.length <= 1) {
    return adjacentSteps;
  }

  // Check and assign the previous step if it exists
  if (currentIndex > 0) {
    adjacentSteps.previous = steps[currentIndex - 1];
  }

  // Check and assign the next step if it exists
  if (currentIndex < steps.length - 1) {
    adjacentSteps.next = steps[currentIndex + 1];
  }

  return adjacentSteps;
}

export function hasEditableTitle(step: Step) {
  return step !== 'start' && step !== 'finish' && step !== 'tailor';
}
