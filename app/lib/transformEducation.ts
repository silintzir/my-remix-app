import type { EducationRecord } from "@/lib/types";
import { map } from "lodash-es";
import { JSONResumeEducation } from "./jsonresume";


export function transformEducation(
  values: EducationRecord
): JSONResumeEducation {
  return {
    ...(values.institution?.length
      ? { institution: values.institution }
      : {}),
    ...(values.area?.length ? { area: values.area } : {}),
    ...(values.studyType?.length
      ? { studyType: values.studyType }
      : {}),
    ...(values.startDate?.length
      ? { startDate: values.startDate }
      : {}),
    ...(values.endDate?.length
      ? { endDate: values.endDate }
      : {}),
    ...(values.city?.length ? { city: values.city } : {}),
    ...(values.state?.length ? { state: values.state } : {}),
    courses: map(values.bullets || [], (bullet) => bullet.content),
  };
}

