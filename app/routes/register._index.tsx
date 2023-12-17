import { Link } from "@remix-run/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { destroySession, getSession } from "@/sessions";

export const handle = {
  step: 1,
};

export async function loader({ request }: LoaderFunctionArgs) {
  return new Response(null, {
    headers: {
      "Set-Cookie": await destroySession(
        await getSession(request.headers.get("Cookie"))
      ),
    },
  });
}

export default function Templates() {
  return (
    <div className="space-y-4 mx-auto">
      <h1 className="font-semibold text-lg">Templates</h1>
      <p className="muted">-- Template carousel should go here --</p>
      <Link
        to={"/register/social-profile"}
        className={cn(buttonVariants({ variant: "default" }))}
      >
        Pick this template
      </Link>
    </div>
  );
}
