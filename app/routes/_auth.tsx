import { type LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { type AuthUser, getSession } from "@/sessions";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.has("user")) {
    console.log("redirect to login");
    return redirect("/app/auth/signin");
  }

  return json({
    user: session.get("user") as AuthUser,
  });
}

export default function App() {
  const session = useLoaderData<typeof loader>();
  return <Outlet context={session} />;
}
