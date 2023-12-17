import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { authToSession } from "@/lib/strapi.server";
import { commitSession, getSession } from "@/sessions";
import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useParams, useSearchParams, useSubmit } from "@remix-run/react";
import { get } from "lodash-es";
import { AlertTriangle } from "lucide-react";
import { useEffect, useRef } from "react";

export async function action({ request }: ActionFunctionArgs) {
  const values = Object.fromEntries(await request.formData());

  const { accessToken, provider } = values;

  const url = `${process.env.STRAPI_HOST}/api/auth/${provider}/callback?access_token=${accessToken}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const parsed = await response.json();

  const error = get(parsed, "error.message");
  if (error) {
    if (error === "Email is already taken.") {
      return redirect("?status=duplicate");
    }
  }

  const session = await getSession(request.headers.get("Cookie"));
  const authData = authToSession(parsed);
  session.set("user", authData);

  return redirect("/account/dashboard", {
    status: 303,
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function SocialLogin() {
  const params = useParams<{ provider: string }>();

  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const accessToken = searchParams.get("access_token") as string;
  const submit = useSubmit();
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (accessToken?.length && ref) {
      submit(ref.current);
    }
  }, [accessToken, submit]);

  return status === "duplicate" ? (
    <Alert variant="destructive" className="max-w-lg mx-auto">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        You have already registered with this email.
      </AlertDescription>
    </Alert>
  ) : (
    <div className="text-center">
      <h4>Authenticating with social login...</h4>
      <Form method="post" action="/connect/google" ref={ref}>
        <input type="hidden" name="accessToken" value={accessToken} />
        <input type="hidden" name="provider" value={params.provider} />
      </Form>
    </div>
  );
}
