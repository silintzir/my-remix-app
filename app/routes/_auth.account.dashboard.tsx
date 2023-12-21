import { useMe } from "@/components/hooks/useMe";
import { useMyToast } from "@/components/hooks/useMyToast";
import { getResumes } from "@/lib/resumes.server";
import type { StrapiShortResume } from "@/lib/types";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getToast } from "remix-toast";
import { get } from "lodash-es";
import { ResumesList } from "@/components/resumes/list";

export async function loader({ request }: LoaderFunctionArgs) {
  const { toast, headers } = await getToast(request);
  const resumes = await getResumes(request);
  return json({ toast, resumes }, { headers });
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
