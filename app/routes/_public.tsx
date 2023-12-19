import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";
import { getSession } from "@/sessions";
import { DASHBOARD } from "@/lib/routes";

export const handle = {
  breadcrumb: () => {
    return <Link to="/auth">Auth</Link>;
  },
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (session.has("user")) {
    return redirect(DASHBOARD);
  }
  return null;
}

export default function Public() {
  return <Outlet />;
}
