import { type z } from "zod";
import type {
  bulletSchema,
  educationSchema,
  workSchema,
  resumeSchema,
  skillSchema,
  interestSchema,
  certificateSchema,
  accomplishmentSchema,
  summarySchema,
  basicsSchema,
  adapterSuggestionSchema,
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
  | "preview"
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

export interface StrapiUser {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  provider: "local" | "facebook" | "google";
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  firstName: string | null;
  lastName: string | null;
  language: string;
}

export type Lang = "en" | "es";

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

export type Template = "chicago" | "executive" | "accountant";

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
