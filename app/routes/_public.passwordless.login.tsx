import { NavBar } from "@/components/navbar";
import ReturnToWebsite from "@/components/navbar/return-website";
import { Logo } from "@/components/website/logo";
import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useLoaderData, useSearchParams, useSubmit } from "@remix-run/react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { get } from "lodash-es";
import { commitSession, getSession } from "@/sessions";
import { authToSession } from "@/lib/strapi.server";
import { cn } from "@/lib/utils";
import { DASHBOARD } from "@/lib/routes";

export async function loader({ request }: LoaderFunctionArgs) {
  const loginToken = new URL(request.url).searchParams.get("loginToken");
  if (!loginToken) {
    return redirect("?status=failed&loginToken=error");
  }
  return loginToken;
}

export async function action({ request }: ActionFunctionArgs) {
  const fd = await request.formData();

  const loginToken = fd.get("loginToken");

  const url = `${process.env.STRAPI_HOST}/api/passwordless/login?loginToken=${loginToken}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const parsed = await response.json();

  const error = get(parsed, "error.message");
  if (error) {
    return redirect("?status=failed");
  }

  const session = await getSession(request.headers.get("Cookie"));
  const firstName = get(parsed, "context.firstName", ""); // includes firstName and lastName
  const lastName = get(parsed, "context.lastName", ""); // includes firstName and lastName

  const authData = { ...authToSession(parsed), firstName, lastName };
  session.set("user", authData);

  // update the user
  if (firstName || lastName) {
    const updateUrl = `${process.env.STRAPI_HOST}/api/users/${authData.id}`;
    const updateConfig = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authData.jwt}`,
      },
      body: JSON.stringify({
        firstName,
        lastName,
      }),
    };
    await fetch(updateUrl, updateConfig);
  }

  return redirect(DASHBOARD, {
    status: 303,
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function PasswordlessLogin() {
  const loginToken = useLoaderData<string>();
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  useEffect(() => {
    const fd = new FormData();
    fd.append("loginToken", loginToken);
    submit(fd, { method: "post", action: "/passwordless/login" });
  }, [loginToken, submit]);

  return (
    <main className="bg-muted">
      <NavBar>
        <Logo />
        <ReturnToWebsite />
      </NavBar>
      <div className="text-center pt-8 h-[calc(100vh-5rem)]">
        <h1
          className={cn(
            "text-lg font-semibold justify-center flex gap-2 items-center",
            { "text-destructive": status === "failed" }
          )}
        >
          {status === "failed" ? (
            <>
              <AlertTriangle className="w-6 h-6" />
              <span>The URL seems to have expired or was invalid.</span>
            </>
          ) : (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Verifying magic link...</span>
            </>
          )}
        </h1>
      </div>
    </main>
  );
}
