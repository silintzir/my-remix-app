import { useMe } from "@/components/hooks/useMe";
import { useMyToast } from "@/components/hooks/useMyToast";
import { createResume, getResumes, importResume } from "@/lib/resumes.server";
import { trim, get, set } from "lodash-es";
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
import { getResumeValues } from "@/lib/import-resume.server";
import { parseFile, s3UploadHandler } from "@/lib/upload-resume.server";

export const config = {
  maxDuration: 120,
};

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

  let id: number;
  if (intent === "text") {
    const fd = await request.formData();
    const text = trim((fd.get("text") as string) || "");
    if (!text || !text.length) {
      return json({ error: "Field is required" });
    }

    // const toStore = (await parseText(text)) as ResumeValues;

    const response = await authenticatedFetch(request, "/api/import", {
      method: "POST",
      body: JSON.stringify({
        resumeText: text,
        service: "google",
        temperature: 0.1,
        parallel: false,
      }),
    });

    console.log(JSON.stringify(response));

    const toStore = getResumeValues(response.data.resume);

    id = await importResume(request, toStore);
    // id = 653;

    return redirect(`/resumes/${id}/edit?step=preview`);
  } else if (intent === "manual") {
    id = await createResume(request, me, { language: "en" });
  } else if (intent === "rename") {
    const fd = await request.formData();
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
    set(document, "meta.title", newTitle);

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

      const u = new URL(file);
      const pathname = u.pathname;
      const parts = pathname.split("/");
      const filename = parts[parts.length - 1] || "Untitled resume";

      const toStore = (await parseFile(file)) as ResumeValues;
      set(toStore, "meta.title", filename);
      id = await importResume(request, toStore);
      return redirect(`/resumes/${id}/edit?step=preview`);
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
