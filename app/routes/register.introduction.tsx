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
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Link,
  useActionData,
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
import { REGISTER } from "@/lib/routes";

export const handle = {
  step: 2,
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const { guest } = session.data;

  if (guest) {
    return guest;
  }
  return defaultValues;
}

export async function action({ request }: ActionFunctionArgs) {
  const raw = await inputFromForm(request);
  const validate = mdf(guestSchema)(async (values) => values);
  const result = await validate(raw);

  if (result.success) {
    const session = await getSession(request.headers.get("Cookie"));
    session.set("guest", { ...(session.get("guest") || {}), ...result.data });

    return redirect(`${REGISTER}/account`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  return result;
}

export default function Introduction() {
  const submit = useSubmit();
  const { state } = useNavigation();
  const defaultValues = useLoaderData<typeof loader>();
  const ref = useRef<HTMLFormElement>(null);
  const result = useActionData<typeof action>();
  const form = useForm<GuestValues>({
    resolver: zodResolver(guestSchema),
    mode: "onSubmit",
    defaultValues,
  });

  useServerErrors(result, form.setError);

  function onSubmit() {
    submit(ref.current);
  }

  const isSubmitting = state === "submitting";

  return (
    <div className="space-y-4 max-w-xs mx-auto">
      <h1 className="font-semibold text-lg">Add your name</h1>
      <p className="muted">
        You made a great template selection! Now let’s add your name to it.
      </p>

      <Form {...form}>
        <form
          method="post"
          className="max-w-xs mx-auto"
          ref={ref}
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <fieldset
            className="space-y-4 w-full text-left"
            disabled={isSubmitting}
          >
            <input type="hidden" name="step" value="one" />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center">
              <Link
                to={`${REGISTER}/social-profile`}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Back
              </Link>

              <Button type="submit">Continue</Button>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  );
}
