import { type StrapiShortResume } from "@/lib/types";
import { Link } from "@remix-run/react";
import { CreateResume } from "@/components/builder/steps/create";
import { get } from "lodash-es";
import { formatDistance } from "date-fns";
import { Separator } from "../ui/separator";
import { ClientOnly } from "remix-utils/client-only";
import { OpenPreview } from "../builder/open-preview";
import { SecondaryActions } from "../builder/secondary-actions";
import usFlag from "@/images/us-flag.svg";
import esFlag from "@/images/es-flag.svg";
import { RenameResume } from "./rename";
import { useTranslation } from "react-i18next";

interface Props {
  resumes: StrapiShortResume[];
}

export function ResumesList({ resumes }: Props) {
  const { t } = useTranslation();
  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-xl sm:text-2xl">
          {t("dashboard.my_resumes")}
        </h2>
        <ClientOnly>
          {() => <CreateResume startOpen={resumes.length === 0} />}
        </ClientOnly>
      </div>
      <Separator className="my-4 bg-gray-300" />
      <div className="flex flex-col gap-2">
        {resumes.map((resume) => {
          const language = get(
            resume,
            "attributes.document.meta.language",
            "en"
          );
          const updatedAt = get(resume, "attributes.updatedAt", new Date());
          return (
            <div
              key={resume.id}
              className="border-muted bg-white border-2 rounded-md p-4 flex justify-between items-center shadow-lg"
            >
              <div className="flex justify-between w-full items-center">
                <div className="space-y-2">
                  <div className="flex gap-1 items-center">
                    <Link
                      className="link"
                      to={`/resumes/${resume.id}/edit?step=preview`}
                    >
                      <h4 className="font-semibold text-lg flex gap-1">
                        {get(resume, "attributes.document.meta.title", "")}
                      </h4>
                    </Link>
                    <RenameResume
                      id={resume.id}
                      title={get(resume, "attributes.document.meta.title")}
                    />
                  </div>
                  <div className="small muted flex gap-1">
                    <span>
                      <img
                        src={language === "en" ? usFlag : esFlag}
                        height="16"
                        width="16"
                        alt="Language"
                      />
                    </span>
                    <Separator orientation="vertical" />
                    <span>
                      {t("base.last_updated")}:{" "}
                      {formatDistance(new Date(updatedAt), new Date(), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <OpenPreview resumeId={resume.id} size="sm" variant="ghost" />
                  <SecondaryActions
                    resumeId={resume.id}
                    size="sm"
                    variant="ghost"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
