import { useServerErrors } from "@/components/hooks/serverErrors";
import { NavBar } from "@/components/navbar";
import ReturnToWebsite from "@/components/navbar/return-website";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/website/logo";
import { authToSession, throwOnStrapiError } from "@/lib/strapi.server";
import successImg from "@/images/coffee_with_friends.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form as RemixForm,
  Link,
  useSearchParams,
  useNavigate,
  useSubmit,
  useNavigation,
  useActionData,
} from "@remix-run/react";
import { inputFromForm, mdf } from "domain-functions";
import { Mail, Loader2 } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { WizardFooter } from "@/components/footers/wizard";
import { requiredString } from "@/lib/validation";
import { z } from "zod";
import { GoogleButton } from "@/components/social/google";
import { FacebookButton } from "@/components/social/facebook";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { TextInput } from "@/components/shadcn/TextInput";
import {
  type AuthValues,
  commitSession,
  getSession,
  destroySession,
} from "@/sessions";

const loginSchema = z.object({
  email: requiredString().email(),
  useMagicLink: z.boolean().optional(),
  password: z.string().optional(),
});

type LoginValues = z.infer<typeof loginSchema>;

const defaultValues: LoginValues = {
  email: "",
  useMagicLink: false,
  password: "",
};

export async function loader({ request }: LoaderFunctionArgs) {
  const sp = new URL(request.url).searchParams;
  const email = sp.get("email");
  const view = sp.get("view");
  if (view === "success" && !email) {
    return redirect("");
  }
  return new Response(null, {
    headers: {
      "Set-Cookie": await destroySession(
        await getSession(request.headers.get("Cookie"))
      ),
    },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const raw = (await inputFromForm(request)) as unknown as LoginValues;
  if (raw.password === undefined) {
    raw.useMagicLink = true;
  }

  const validate = mdf(loginSchema)(async (values) => {
    if (values.useMagicLink) {
      const url = `${process.env.STRAPI_HOST}/api/passwordless/send-link`;

      await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          username: values.email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      const url = `${process.env.STRAPI_HOST}/api/auth/local`;
      console.log(values);
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          identifier: values.email,
          password: values.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const parsed = await response.json();
      throwOnStrapiError(parsed);
      return authToSession(parsed);
    }
  });

  const result = await validate(raw);

  if (result.success) {
    if (raw.useMagicLink) {
      return redirect(`?view=success&email=${raw.email}`);
    }
    const session = await getSession(request.headers.get("Cookie"));
    session.unset("guest");
    session.set("user", result.data as AuthValues);
    return redirect("/account/dashboard", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  return result;
}

export default function Signin() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();
  const submit = useSubmit();
  const { state } = useNavigation();
  const ref = useRef<HTMLFormElement>(null);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: { ...defaultValues, email },
  });

  const { t } = useTranslation();

  const result = useActionData<typeof action>();
  const {
    setError,
    watch,
    formState: { errors },
  } = form;

  const useMagic = watch("useMagicLink");

  useServerErrors(result, setError);

  function onSubmit() {
    submit(ref.current);
  }
  return (
    <main>
      <NavBar>
        <Logo />
        <ReturnToWebsite />
      </NavBar>
      <div className="text-center absolute top-20 py-8 h-[calc(100dvh-5rem)] bg-muted px-4 overflow-y-auto w-full">
        <div className="mx-auto max-w-xs w-full">
          {view === "success" && (
            <div className="flex flex-col items-center px-4">
              <img
                src={successImg}
                alt="Signin success"
                className="h-[200px]"
              />
              <h2 className="text-3xl mt-4 font-semibold">Check your inbox</h2>
              <p className="mt-4">
                We just emailed a confirmation link to <strong>{email}</strong>.
              </p>
              <p>Click the link, and you'll be signed in.</p>

              <p className="small mt-12 muted">
                Didn't receive a link?{" "}
                <Link className="link" to="/contact">
                  Contact support
                </Link>
              </p>
            </div>
          )}
          {view === "email" && (
            <div className="flex flex-col text-center items-center gap-8">
              <div className="space-y-1 px-10">
                <img
                  src="/images/join.svg"
                  alt="Enter your email"
                  className="h-[160px]"
                />
                <h1 className="font-semibold text-lg">Log In</h1>
                <p className="muted">Enter your email</p>
              </div>
              <Form {...form}>
                <form
                  method="post"
                  ref={ref}
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="max-w-xs w-full"
                >
                  {errors.root && (
                    <p className="small text-destructive mb-2">
                      {errors.root.message}
                    </p>
                  )}
                  <fieldset
                    className="space-y-4 w-full text-left"
                    disabled={state === "submitting"}
                  >
                    <FormField
                      control={form.control}
                      name="useMagicLink"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                          <div className="space-y-1 leading-none">
                            <FormLabel>Passwordless login</FormLabel>
                            <FormDescription>
                              Forget passwords. We email you a magic link every
                              time you want to login.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {useMagic === false && (
                      <TextInput
                        type="password"
                        control={form.control}
                        label="Password"
                        name="password"
                      />
                    )}
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => navigate("")}
                      >
                        Back
                      </Button>
                      <Button type="submit">
                        {state === "submitting" && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {state === "submitting" ? "Please wait" : "Continue"}
                      </Button>
                    </div>
                  </fieldset>
                </form>
              </Form>
            </div>
          )}
          {!view && (
            <div className="flex flex-col text-center items-center gap-8">
              <div className="space-y-2">
                <img
                  src="/images/social-thinking.svg"
                  alt="Enter your email"
                  className="h-[160px]"
                />
                <h1 className="font-semibold text-lg">{t("greeting")}</h1>
                <div className="muted">We are happy to see you back!</div>
              </div>
              <div className="flex gap-2 flex-col w-56">
                <FacebookButton />
                <GoogleButton />
                <RemixForm className="w-full">
                  <Button
                    name="view"
                    value="email"
                    className="min-w-[160px] relative font-bold w-full"
                  >
                    <Mail className="w-5 h-5 absolute left-[18px] top-1/2 mt-[-10px]" />
                    <span className="w-full">Email</span>
                  </Button>
                </RemixForm>
              </div>
              <span className="muted">
                I am not registered -{" "}
                <Link className="link" to="/register">
                  Signup
                </Link>
              </span>
            </div>
          )}
        </div>
      </div>
      <WizardFooter />
    </main>
  );
}
