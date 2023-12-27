import { useFormContext } from "react-hook-form";
import { filter, map } from "lodash-es";
import type { ResumeValues, Step } from "@/lib/types";
import {
  transformSkills,
  transformWork,
  transformEducation,
} from "@/lib/jsonresume";

type Config = {
  step: Step;
  uuid: string;
};

export function useAiContext() {
  const { getValues } = useFormContext<ResumeValues>();

  const { resume } = getValues() as ResumeValues;
  const work = resume?.work || [];
  const education = resume?.education || [];
  const skills = resume?.skills || [];

  return (exclude?: Config) => {
    const { step, uuid } = exclude || {};
    const output = {
      work: step === "work" ? filter(work, (w) => w.uuid !== uuid) : work,
      education:
        step === "education"
          ? filter(education, (w) => w.uuid !== uuid)
          : education,
      skills:
        step === "skills" ? filter(skills, (w) => w.uuid !== uuid) : skills,
    };
    return {
      work: map(output.work, transformWork),
      education: map(output.education, transformEducation),
      skills: map(output.skills, transformSkills),
    };
  };
}
