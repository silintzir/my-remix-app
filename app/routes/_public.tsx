import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { getSession } from "@/sessions";

export const handle = {
  breadcrumb: () => {
    return <Link to="/auth">Auth</Link>;
  },
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("user")) {
    return redirect("/account/dashboard");
  }
  return null;
}

export default function Public() {
  return <Outlet />;
}
