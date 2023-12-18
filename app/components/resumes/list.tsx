import { type StrapiShortResume } from "@/lib/types";
import { Form, Link } from "@remix-run/react";
import { CreateResume } from "@/components/builder/steps/create";
import { Trash } from "lucide-react";
import { get } from "lodash-es";

import { formatDistance } from "date-fns";
import { Separator } from "../ui/separator";
import { ClientOnly } from "remix-utils/client-only";

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
      <div className="flex flex-wrap justify-around">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className="w-1/2 border-muted bg-white border-2 rounded-md p-4 flex justify-between items-center shadow-lg"
          >
            <div className="flex gap-4">
              <Link
                className="link"
                to={`/app/resumes/${resume.id}/edit?view=preview`}
              >
                <img
                  src={resume.attributes.screenshot}
                  alt="Resume preview"
                  className="w-[140px] border-4 rounded-md border-muted p-2"
                />
              </Link>
              <div className="flex flex-col justify-between">
                <div className="space-y-2">
                  <Link className="link" to={`/app/resumes/${resume.id}/edit`}>
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
                  <div>
                    <Link
                      className="link small"
                      to={`/app/resumes/${resume.id}/docx`}
                      target="_blank"
                    >
                      Export to MS Word
                    </Link>
                  </div>
                  <div>
                    <Link
                      className="link small"
                      to={`/app/resumes/${resume.id}/json`}
                    >
                      Export to JSON
                    </Link>
                  </div>
                </div>
                <Form method="post" action={`/app/resumes/${resume.id}/delete`}>
                  <button
                    type="submit"
                    title="Delete resume"
                    onClick={(evt) => {
                      if (
                        confirm(
                          "Deleting a resume is an action that cannot be undone. Proceed anyway?"
                        )
                      ) {
                        return true;
                      }
                      evt.preventDefault();
                      return false;
                    }}
                    className="text-destructive flex items-center hover:opacity-80"
                  >
                    <Trash className="h-3 w-3 mr-2" />
                    <span>Delete resume</span>
                  </button>
                </Form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
