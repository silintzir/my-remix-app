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
  type DeleteAccountValues,
  deleteAccountSchema,
  DELETE_ACCOUNT_INTENT,
} from "@/lib/account/validation";
import { useRef } from "react";
import { useNavigation, useSubmit } from "@remix-run/react";
import { useTranslation } from "react-i18next";

export function DeleteAccountForm() {
  const { state, formData } = useNavigation();
  const methods = useForm<DeleteAccountValues>({
    mode: "onBlur",
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      _intent: DELETE_ACCOUNT_INTENT,
      confirm: "",
    },
  });
  const submit = useSubmit();
  const { control, handleSubmit } = methods;
  const ref = useRef<HTMLFormElement>(null);

  const onSubmit: SubmitHandler<DeleteAccountValues> = (_data) => {
    submit(ref.current);
  };

  const { t } = useTranslation();

  const isSubmitting =
    state === "submitting" &&
    formData &&
    formData.get("_intent") === DELETE_ACCOUNT_INTENT;

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
              <CardTitle className="text-destructive">
                {t("account.delete_account")}
              </CardTitle>
              <CardDescription>
                {t("account.delete_account_subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("account.delete_prompt")}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Delete me" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" variant="destructive">
                {isSubmitting ? t("base.please_wait") : t("base.update")}
              </Button>
            </CardFooter>
          </fieldset>
        </form>
      </Form>
    </Card>
  );
}
