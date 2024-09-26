import { type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { sourceCookie } from "@/lib/cookies.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const sp = new URL(request.url).searchParams;
  const source = sp.get("source");

  return redirect("/account/dashboard", {
    headers: {
      ...(source?.startsWith("hc")
        ? {
            "Set-Cookie": await sourceCookie.serialize(source),
          }
        : {}),
    },
  });
};
