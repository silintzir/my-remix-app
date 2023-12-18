import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { getSession, commitSession } from "@/sessions";
import { fetchMe } from "@/lib/strapi.server";

export const handle = "auth";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const { user } = session.data;

  if (!user) {
    return redirect("/login");
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
