import { type z } from "zod";
import {
  type bulletSchema,
  type educationSchema,
  type workSchema,
  type resumeSchema,
  type skillSchema,
  type interestSchema,
  type certificateSchema,
  type accomplishmentSchema,
  type summarySchema,
  type basicsSchema,
  type adapterSuggestionSchema,
  stepConfigSchema,
} from "./resume";

export type Step =
  | "start"
  | "basics"
  | "work"
  | "education"
  | "skills"
  | "interests"
  | "accomplishments"
  | "certificates"
  | "summary"
  | "tailor"
  | "finish";

export interface StrapiShortResume {
  id: number;
  attributes: {
    name: string;
    createdAt: Date;
    updatedAt: Date;
    document: ResumeValues;
  };
}

export type Lang = "en" | "es" | "zh";

export interface StrapiLongResume {
  id: number;
  attributes: {
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    document: ResumeValues;
  };
}

export type ResumeValues = z.infer<typeof resumeSchema>;

export type RecordWithBullets = { bullets: Bullet[] };
export type WorkRecord = z.infer<typeof workSchema>;
export type EducationRecord = z.infer<typeof educationSchema>;
export type CertificateRecord = z.infer<typeof certificateSchema>;
export type AccomplishmentRecord = z.infer<typeof accomplishmentSchema>;
export type SkillRecord = z.infer<typeof skillSchema>;
export type InterestRecord = z.infer<typeof interestSchema>;
export type Bullet = z.infer<typeof bulletSchema>;
export type SummaryValues = z.infer<typeof summarySchema>;
export type BasicsValues = z.infer<typeof basicsSchema>;
export type AdapterSuggestion = z.infer<typeof adapterSuggestionSchema>;
export type StepConfig = z.infer<typeof stepConfigSchema>;
