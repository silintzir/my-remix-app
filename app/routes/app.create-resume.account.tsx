import {
  type GuestValues,
  defaultValues,
  guestSchema,
} from "@/components/guest/schema";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Link,
  useActionData,
  useHref,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { inputFromForm, mdf } from "domain-functions";
import { useServerErrors } from "@/components/hooks/serverErrors";
import { commitSession, getSession } from "@/sessions";
import { throwOnStrapiError } from "@/lib/strapi.server";
import { get } from "lodash-es";
import { TextInput } from "@/components/shadcn/TextInput";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

export const handle = {
  step: 2,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("guest")) {
    return redirect("/app/create-resume/templates");
  }
  return { ...defaultValues, ...session.get("guest") };
}

export async function action({ request }: ActionFunctionArgs) {
  const raw = (await inputFromForm(request)) as unknown as GuestValues;
  if (raw.password === undefined) {
    raw.useMagicLink = true;
  }
  const validate = mdf(guestSchema)(async (values) => {
    if (values.useMagicLink) {
      let url = `${process.env.STRAPI_HOST}/api/passwordless/send-link`;
      await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          context: {
            firstName: values.firstName,
            lastName: values.lastName,
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return;
    } else {
      let url = `${process.env.STRAPI_HOST}/api/auth/local/register`;
      let response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const parsed = await response.json();

      throwOnStrapiError(parsed);

      const id = get(parsed, "user.id", "");
      const firstName = get(parsed, "user.firstName", "");
      const lastName = get(parsed, "user.lastName", "");
      const email = get(parsed, "user.email", "");
      const jwt = get(parsed, "jwt", "");

      return {
        user: {
          id,
          firstName,
          lastName,
          email,
          jwt,
        },
      };
    }
  });
  const result = await validate(raw);

  if (result.success) {
    if (raw.useMagicLink) {
      return redirect(`/app/auth/signin?view=success&email=${raw.email}`);
    } else {
      const session = await getSession(request.headers.get("Cookie"));
      session.unset("guest");
      session.set("user", (result.data as any).user);
      return redirect(`/app/dashboard`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  }

  return result;
}

export default function Account() {
  const submit = useSubmit();
  const defaultValues = useLoaderData<typeof loader>();
  const hrefPrev = useHref("../introduction");
  const ref = useRef<HTMLFormElement>(null);
  const result = useActionData<typeof action>();
  const form = useForm<GuestValues>({
    resolver: zodResolver(guestSchema),
    mode: "onBlur",
    defaultValues: { ...defaultValues, step: "two" },
  });
  const { state } = useNavigation();

  const {
    setError,
    watch,
    formState: { errors },
  } = form;

  useServerErrors(result, setError);

  function onSubmit() {
    submit(ref.current);
  }

  const useMagic = watch("useMagicLink");

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <h3>Supply contact information</h3>
      <p className="muted">
        It’s important to let employers know how to contact you. Enter your
        email address below.
      </p>

      <Form {...form}>
        <form
          noValidate
          method="post"
          className="max-w-sm mx-auto"
          ref={ref}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {errors.root && (
            <p className="small text-destructive mb-2">{errors.root.message}</p>
          )}
          <fieldset className="space-y-4 w-full text-left">
            <input type="hidden" name="step" value="two" />
            <input
              type="hidden"
              name="firstName"
              value={defaultValues.firstName}
            />
            <input
              type="hidden"
              name="lastName"
              value={defaultValues.lastName}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="email" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      Forget passwords. We email you a magic link every time you
                      want to login.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            {useMagic === false && (
              <>
                <TextInput
                  type="password"
                  control={form.control}
                  label="Password"
                  name="password"
                />
                <TextInput
                  type="password"
                  control={form.control}
                  label="Repeat password"
                  name="passwordRepeat"
                />
              </>
            )}
            <div className="flex justify-between items-center">
              <Link
                to={hrefPrev}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Back
              </Link>

              <Button type="submit" disabled={state === "submitting"}>
                {state === "submitting" ? (
                  <div className="flex gap-2 items-center">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Please wait</span>
                  </div>
                ) : (
                  <span>Continue</span>
                )}
              </Button>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  );
}
