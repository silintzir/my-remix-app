import { getSession } from "@/sessions";
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  return await getSession(request.headers.get("Cookie"));
}
