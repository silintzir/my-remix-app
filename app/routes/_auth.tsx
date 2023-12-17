import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { getSession, commitSession } from "@/sessions";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  const { user } = session.data;

  if (!user) {
    return redirect("/login");
  }

  return json(
    {
      user,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export default function App() {
  const session = useLoaderData<typeof loader>();
  return <Outlet context={session} />;
}
