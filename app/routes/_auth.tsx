import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";

import { getSession, commitSession } from "@/sessions";
import { fetchMe } from "@/lib/strapi.server";
import { LOGIN } from "@/lib/routes";
import { NavBar } from "@/components/navbar";
import { Logo } from "@/components/website/logo";
import errorImg from "@/images/air_support.svg";
import { ReturnToDashboard } from "@/components/navbar/return-website";

export const handle = "auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const sp = new URL(request.url).searchParams;
  const session = await getSession(request.headers.get("Cookie"));
  const { user } = session.data;

  if (!user) {
    throw redirect(`${LOGIN}?${sp.toString()}`);
  }

  return json(
    {
      me: await fetchMe(request),
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return (
    <main>
      <NavBar>
        <Logo to="/account/dashboard" />
        <ReturnToDashboard />
      </NavBar>
      <div className="text-center absolute top-20 py-8 h-[calc(100dvh-5rem)] bg-muted px-4 overflow-y-auto w-full">
        <div className="mx-auto max-w-xs w-full">
          <div className="flex flex-col items-center px-4">
            <img src={errorImg} alt="Error" className="h-[200px]" />
            <h2 className="text-xl mt-4 font-semibold">
              An unexpected error occured.
            </h2>
            <p>
              <Link className="link" to="/account/dashboard">
                Click here
              </Link>{" "}
              to return to the dashboard
            </p>

            <p className="small mt-12 muted">
              Keep seeing this error?&nbsp;
              <Link className="link" to="mailto:info@resumerunner.ai">
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
