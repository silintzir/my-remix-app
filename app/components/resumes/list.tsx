import { type StrapiShortResume } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, Link } from "@remix-run/react";
import { CreateResume } from "@/components/builder/steps/create";
import { Trash } from "lucide-react";

import { formatDistance } from "date-fns";

interface Props {
  resumes: StrapiShortResume[];
}

export function ResumesList({ resumes }: Props) {

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>My saved resumes</CardTitle>
        <CardDescription>
          This is beta version, you may create as many resumes as you want.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-none ml-0">
          {resumes.map((resume) => (
            <li
              key={resume.id}
              className="border-muted bg-muted border-2 rounded-md shadow-md px-4 py-2 flex justify-between items-center"
            >
              <div>
                <Link className="link" to={`/app/resumes/${resume.id}/edit`}>
                  <h4 className="font-semibold text-lg">
                    {resume.attributes.document.meta.title}
                  </h4>
                </Link>
                <span className="small muted">
                  Last updated:{" "}
                  {formatDistance(
                    new Date(resume.attributes.updatedAt),
                    new Date(),
                    { addSuffix: true }
                  )}
                </span>
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
                  className="text-destructive flex items-center hover:opacity-80 small"
                >
                  <Trash className="h-3 w-3 mr-2" />
                  <span>Delete resume</span>
                </button>
              </Form>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-end">
        <CreateResume startOpen={resumes.length === 0} />
      </CardFooter>
    </Card>
  );
}
