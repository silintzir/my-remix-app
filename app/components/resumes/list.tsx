import { type StrapiShortResume } from "@/lib/types";
import { Link } from "@remix-run/react";
import { CreateResume } from "@/components/builder/steps/create";
import { get } from "lodash-es";
import { formatDistance } from "date-fns";
import { Separator } from "../ui/separator";
import { ClientOnly } from "remix-utils/client-only";
import { OpenPreview } from "../builder/open-preview";
import { SecondaryActions } from "../builder/export-actions";

interface Props {
  resumes: StrapiShortResume[];
}

export function ResumesList({ resumes }: Props) {
  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-xl sm:text-2xl">My resumes</h2>
        <ClientOnly>
          {() => <CreateResume startOpen={resumes.length === 0} />}
        </ClientOnly>
      </div>
      <Separator className="my-4 bg-gray-300" />
      <div className="flex flex-col gap-2">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="border-muted bg-white border-2 rounded-md p-4 flex justify-between items-center shadow-lg"
          >
            <div className="flex justify-between w-full items-center">
              <div className="space-y-2">
                <Link className="link" to={`/resumes/${resume.id}/edit`}>
                  <h4 className="font-semibold text-lg">
                    {get(resume, "attributes.document.meta.title", "")}
                  </h4>
                </Link>
                <div className="small muted">
                  Last updated:{" "}
                  {formatDistance(
                    new Date(resume.attributes.updatedAt),
                    new Date(),
                    {
                      addSuffix: true,
                    }
                  )}
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
        ))}
      </div>
    </div>
  );
}
