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
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next/react";
import { sourceCookie } from "@/lib/cookies.server";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export const config = {
  maxDuration: 120,
};

export const meta: MetaFunction = () => {
  return [{ title: "Account :: Dashboard" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const source = await sourceCookie.parse(cookieHeader);

  const { toast, headers } = await getToast(request);
  const resumes = await getResumes(request);
  return json(
    { toast, resumes, source },
    {
      headers: {
        ...headers,
      },
    }
  );
}

export default function AppDashboard() {
  const { resumes, toast, source } = useLoaderData<typeof loader>();
  const me = useMe();
  useMyToast({ toast } as any);

  const fn = get(me, "firstName", "") || "";
  const ln = get(me, "lastName", "") || "";
  const { t } = useTranslation();
  useChangeLanguage(me.language || "en-US");

  return (
    <>
      {source?.startsWith("hc") && (
        <div className="max-w-3xl">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Are you a Marathon Staffig team member?</AlertTitle>
            <AlertDescription>
              <div className="flex flex-col gap-2 justify-end">
                <p>
                  You may either download one of the resumes from the list below
                  and import that to your Marathon account or create a new
                  resume and then import that one.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-fit"
                  onClick={() => {
                    switch (source) {
                      case "hc_oav3":
                        window.location.assign(
                          "http://localhost:8080/seekers/account/application/workHistory/resumerunner"
                        );
                        break;
                      case "hc_resumes":
                        window.location.assign(
                          "http://localhost:8080/seekers/upload_resume.go?source=resumerunner"
                        );
                        break;
                    }
                  }}
                >
                  Back to Marathon Portal
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
      <h4 className="text-lg">
        <span className="text-base sm:text-lg flex flex-wrap items-center gap-2">
          {t("base.welcome")}
          {(fn.length > 0 || ln.length > 0) && (
            <strong>{`${me.firstName || ""} ${me.lastName || ""}`}</strong>
          )}
        </span>
      </h4>
      <ResumesList resumes={resumes as unknown as StrapiShortResume[]} />
    </>
  );
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
    } else if (text.length > 6000) {
      return json({ error: "Exceeded 6000 characters limit" });
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

    const toStore = getResumeValues(response.data.resume);

    toStore.meta.title = [
      toStore.resume.basics.firstName,
      toStore.resume.basics.lastName,
    ]
      .join(" ")
      .trim();
    if (toStore.meta.title.length === 0) {
      toStore.meta.title = "Untitled resume";
    }

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
