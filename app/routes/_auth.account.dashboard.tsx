import { useMe } from "@/components/hooks/useMe";
import { useMyToast } from "@/components/hooks/useMyToast";
import { createResume, getResumes, importResume } from "@/lib/resumes.server";
import { trim, get } from "lodash-es";
import type { ResumeValues, StrapiShortResume } from "@/lib/types";
import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  redirect,
  unstable_parseMultipartFormData,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getToast } from "remix-toast";
import { ResumesList } from "@/components/resumes/list";
import { authenticatedFetch, fetchMe } from "@/lib/strapi.server";
import { parseText } from "@/lib/import-resume.server";
import { parseFile, s3UploadHandler } from "@/lib/upload-resume.server";

export const meta: MetaFunction = () => {
  return [{ title: "Account :: Dashboard" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { toast, headers } = await getToast(request);
  const resumes = await getResumes(request);
  return json({ toast, resumes }, { headers });
}

export async function action({ request }: ActionFunctionArgs) {
  const sp = new URL(request.url).searchParams;
  const intent = sp.get("intent");
  const me = await fetchMe(request);

  const fd = await request.formData();
  let id: number;
  if (intent === "text") {
    const text = trim((fd.get("text") as string) || "");
    if (!text || !text.length) {
      return json({ error: "Field is required" });
    }
    const toStore = (await parseText(text)) as ResumeValues;
    id = await importResume(request, toStore);
  } else if (intent === "manual") {
    id = await createResume(request, me, { language: "en" });
  } else if (intent === "rename") {
    id = fd.get("id") as unknown as number;
    let newTitle = fd.get("title") as string;

    if (trim(newTitle).length === 0) {
      newTitle = "Untitled resume";
    }

    const resume = await authenticatedFetch(request, `/api/resumes/${id}`, {
      method: "GET",
    });
    const document = get(
      resume,
      "data.attributes.document",
      {}
    ) as ResumeValues;
    document.meta.title = newTitle;

    await authenticatedFetch(request, `/api/resumes/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        data: { document },
      }),
    });

    return null;
  } else {
    try {
      const fd = await unstable_parseMultipartFormData(
        request,
        s3UploadHandler
      );
      const file = fd.get("file") as string;
      const toStore = (await parseFile(file)) as ResumeValues;
      id = await importResume(request, toStore);
    } catch (e) {
      return json({ error: "Invalid file type" });
    }
  }

  return redirect(`/resumes/${id}/edit`);
}

export default function AppDashboard() {
  const { resumes, toast } = useLoaderData<typeof loader>();
  const me = useMe();
  useMyToast({ toast } as any);

  const fn = get(me, "firstName", "") || "";
  const ln = get(me, "lastName", "") || "";

  return (
    <>
      <h4 className="text-lg">
        <span className="text-base sm:text-lg flex flex-wrap items-center gap-2">
          Happy to see you back
          {(fn.length > 0 || ln.length > 0) && (
            <strong>{`${me.firstName || ""} ${me.lastName || ""}`}</strong>
          )}
        </span>
      </h4>
      <ResumesList resumes={resumes as unknown as StrapiShortResume[]} />
    </>
  );
}
