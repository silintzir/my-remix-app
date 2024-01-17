import type { ResumeValues } from "@/lib/types";
import { useFormContext } from "react-hook-form";

import { BasicsStep } from "./basics";
import { WorkStep } from "./work";
import { EducationStep } from "./education";
import { SkillsStep } from "./skills";
import { CertificatesStep } from "./certificates";
import { AccomplishmentsStep } from "./accomplishments";
import { InterestsStep } from "./interests";
import { SummaryStep } from "./summary";
import { useEffect } from "react";

export function PreviewStep() {
  const { getValues, setValue, watch } = useFormContext<ResumeValues>();

  const values = getValues();

  const education = watch("resume.education");
  const work = watch("resume.work");
  const skills = watch("resume.skills");
  const certificates = watch("resume.certificates");
  const interests = watch("resume.interests");
  const accomplishments = watch("resume.accomplishments");

  useEffect(() => {
    if (education.length === 0) {
      setValue("meta.steps.education.enabled", false, { shouldDirty: true });
    }
  }, [education, setValue]);

  useEffect(() => {
    if (work.length === 0) {
      setValue("meta.steps.work.enabled", false, { shouldDirty: true });
    }
  }, [work, setValue]);

  useEffect(() => {
    if (skills.length === 0) {
      setValue("meta.steps.skills.enabled", false, { shouldDirty: true });
    }
  }, [skills, setValue]);

  useEffect(() => {
    if (certificates.length === 0) {
      setValue("meta.steps.certificates.enabled", false, { shouldDirty: true });
    }
  }, [certificates, setValue]);

  useEffect(() => {
    if (interests.length === 0) {
      setValue("meta.steps.interests.enabled", false, { shouldDirty: true });
    }
  }, [interests, setValue]);

  useEffect(() => {
    if (accomplishments.length === 0) {
      setValue("meta.steps.accomplishments.enabled", false, {
        shouldDirty: true,
      });
    }
  }, [accomplishments, setValue]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-1">{values.meta.steps.basics.title}</h3>
        <BasicsStep />
      </div>
      <div>
        <h3 className="font-semibold mb-1">
          {values.meta.steps.summary.title}
        </h3>
        <SummaryStep />
      </div>

      {values.resume.work.length > 0 && (
        <div>
          <h3 className="font-semibold mb-1">{values.meta.steps.work.title}</h3>
          <WorkStep />
        </div>
      )}
      {values.resume.education.length > 0 && (
        <div>
          <h3 className="font-semibold mb-1">
            {values.meta.steps.education.title}
          </h3>
          <EducationStep />
        </div>
      )}
      {values.resume.skills.length > 0 && (
        <div>
          <h3 className="font-semibold mb-1">
            {values.meta.steps.skills.title}
          </h3>
          <SkillsStep />
        </div>
      )}
      {values.resume.certificates.length > 0 && (
        <div>
          <h3 className="font-semibold mb-1">
            {values.meta.steps.certificates.title}
          </h3>
          <CertificatesStep />
        </div>
      )}
      {values.resume.accomplishments.length > 0 && (
        <div>
          <h3 className="font-semibold mb-1">
            {values.meta.steps.accomplishments.title}
          </h3>
          <AccomplishmentsStep />
        </div>
      )}
      {values.resume.interests.length > 0 && (
        <div>
          <h3 className="font-semibold mb-1">
            {values.meta.steps.interests.title}
          </h3>
          <InterestsStep />
        </div>
      )}
    </div>
  );
}
