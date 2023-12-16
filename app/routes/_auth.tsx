import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { type AuthUser, getSession, commitSession } from "@/sessions";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("user")) {
    return redirect("/app/auth/signin");
  }

  return json({
    user: session.get("user") as AuthUser,

  }, {
    headers: {
      'Set-Cookie': await commitSession(session)
    }
  });
}

export default function App() {
  const session = useLoaderData<typeof loader>();

  return <Outlet context={session} />;
}
