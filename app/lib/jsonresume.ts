import type { EducationRecord, SkillRecord, WorkRecord } from "@/lib/types";
import { map } from "lodash-es";

export type JSONResumeWork = {
  name?: string; //company
  position?: string;
  highlights?: string[];
};

export type JSONResumeEducation = {
  institution?: string;
  area?: string;
  studyType?: string;
  courses: string[];
};

export type JSONResumeSkill = {
  name?: string;
};

export type JSONResumeCertificate = {
  name?: string;
  issuer?: string;
  date?: string;
  url?: string;
};

export type JSONContext = {
  work: JSONResumeWork[];
  education: JSONResumeEducation[];
  skills: JSONResumeSkill[];
  certificates: JSONResumeCertificate[];
};

export function transformWork(values: WorkRecord): JSONResumeWork {
  return {
    ...(values.name?.length ? { name: values.name } : {}),
    ...(values.position?.length
      ? { position: values.position }
      : {}),
    ...(values.startDate?.length
      ? { startDate: values.startDate }
      : {}),
    ...(values.endDate?.length
      ? { endDate: values.endDate }
      : {}),
    ...(values.city?.length ? { city: values.city } : {}),
    ...(values.state?.length ? { state: values.state } : {}),
    ...(values.bullets?.length
      ? { highlights: map(values.bullets, (bullet) => bullet.content) }
      : {}),
  };
}

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

export function transformSkills(values: SkillRecord): JSONResumeSkill {
  if (!values.name || !values.name.length) {
    return {};
  }
  return {
    name: values.name,
  };
}
