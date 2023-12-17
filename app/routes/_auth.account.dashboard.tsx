import { useMe } from "@/components/hooks/useMe";
import { ResumesList } from "@/components/resumes/list";
import { getResumes } from "@/lib/resumes.server";
import type { StrapiShortResume } from "@/lib/types";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const resumes = await getResumes(request);
  return json({ resumes });
}

export default function AppDashboard() {
  const { resumes } = useLoaderData<typeof loader>();
  const me = useMe();

  return (
    <>
      <h4>
        Welcome back,{" "}
        <strong>{`${me.firstName || ""} ${me.lastName || ""}`}</strong>
      </h4>
      <ResumesList resumes={resumes as unknown as StrapiShortResume[]} />
    </>
  );
}
