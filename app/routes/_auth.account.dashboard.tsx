import { useMe } from "@/components/hooks/useMe";
import { useMyToast } from "@/components/hooks/useMyToast";
import { ResumesList } from "@/components/resumes/list";
import { getResumes } from "@/lib/resumes.server";
import type { StrapiShortResume } from "@/lib/types";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Smile } from "lucide-react";
import { getToast } from "remix-toast";

export async function loader({ request }: LoaderFunctionArgs) {
  const { toast, headers } = await getToast(request);
  const resumes = await getResumes(request);
  return json({ toast, resumes }, { headers });
}

export default function AppDashboard() {
  const { resumes, toast } = useLoaderData<typeof loader>();
  const me = useMe();
  useMyToast({ toast } as any);

  return (
    <>
      <h4 className="text-lg">
        <span className="flex items-center gap-2">
          <span>Happy to see you back, </span>
          <strong>{`${me.firstName || ""} ${me.lastName || ""}`}</strong>{" "}
          <Smile className="h-4 w-4" />
        </span>
      </h4>
      <ResumesList resumes={resumes as unknown as StrapiShortResume[]} />
    </>
  );
}
