import { NavBar } from "@/components/navbar";
import { UpgradeNowButton } from "@/components/navbar/upgrade-now";
import { UserMenu } from "@/components/navbar/user-menu";
import { ResumesList } from "@/components/resumes/list";
import { Logo } from "@/components/website/logo";
import { getResumes } from "@/lib/resumes.server";
import { type AuthValues } from "@/sessions";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const resumes = await getResumes(request);
  return json({ resumes });
}

export default function AppDashboard() {
  const { user } = useOutletContext<{ user: AuthValues }>();
  const { resumes } = useLoaderData<typeof loader>();

  return (
    <main>
      <NavBar>
        <Logo />
        <div className="flex gap-2">
          <UpgradeNowButton />
          <UserMenu user={user} />
        </div>
      </NavBar>
      <div className="h-[calc(100vh-5rem)] bg-muted">
        <div className="space-y-8 p-8">
          <h4>
            Welcome back,{" "}
            <strong>{`${user.firstName || ""} ${user.lastName || ""}`}</strong>
          </h4>
          <ResumesList resumes={resumes} />
        </div>
      </div>
    </main>
  );
}
