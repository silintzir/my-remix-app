import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  changePasswordSchema,
  type ChangePasswordValues,
  CHANGE_PASSWORD_INTENT,
} from "@/lib/account/validation";
import { useRef } from "react";
import { useNavigation, useSubmit } from "@remix-run/react";
import { useMe } from "../hooks/useMe";
import { capitalize } from "lodash-es";
import { useTranslation } from "react-i18next";

export function ChangePasswordForm() {
  const { state, formData } = useNavigation();
  const methods = useForm<ChangePasswordValues>({
    mode: "onBlur",
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      _intent: CHANGE_PASSWORD_INTENT,
      password: "",
      passwordRepeat: "",
    },
  });
  const submit = useSubmit();
  const { control, handleSubmit } = methods;
  const ref = useRef<HTMLFormElement>(null);
  const me = useMe();
  const { t } = useTranslation();

  const onSubmit: SubmitHandler<ChangePasswordValues> = (_data) => {
    submit(ref.current);
  };

  const isSubmitting =
    state === "submitting" &&
    formData &&
    formData.get("_intent") === CHANGE_PASSWORD_INTENT;

  return (
    <Card className="w-full">
      <Form {...methods}>
        <form method="post" ref={ref} onSubmit={handleSubmit(onSubmit)}>
          <fieldset disabled={isSubmitting}>
            <FormField
              control={control}
              name="_intent"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <CardHeader>
              <CardTitle>{t("account.password_settings")}</CardTitle>
              <CardDescription>
                <span>{t("account.password_settings_subtitle")}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {me.provider !== "local" && (
                <p className="bg-orange-300 py-2 px-4 rounded-md mb-4">
                  {!me.provider && (
                    <>
                      <strong>Passwordless login</strong> is currently
                      configured for your account. If you want to access your
                      account with a password, use the form below to setup one.
                    </>
                  )}
                  {(me.provider === "google" || me.provider === "facebook") && (
                    <>
                      <strong>{capitalize(me.provider)} login</strong> is
                      currently configured for your account. If you proceed and
                      set a password, your {capitalize(me.provider)} login will
                      be disabled in favor of your password login.
                    </>
                  )}
                </p>
              )}
              <input
                type="text"
                name="username"
                autoComplete="username email"
                defaultValue={me.email}
                className="sr-only"
              />
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("account.password")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="passwordRepeat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("account.repeat_password")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit">
                {isSubmitting ? t("base.please_wait") : t("base.update")}
              </Button>
            </CardFooter>
          </fieldset>
        </form>
      </Form>
    </Card>
  );
}
