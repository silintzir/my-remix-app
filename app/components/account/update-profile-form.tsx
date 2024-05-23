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
import { useNavigation, useSubmit } from "@remix-run/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  type UpdateProfileValues,
  updateProfileSchema,
  UPDATE_PROFILE_INTENT,
} from "@/lib/account/validation";
import { useEffect, useRef } from "react";
import { type StrapiUser } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useChangeLanguage } from "remix-i18next/react";
import { useTranslation } from "react-i18next";

interface Props {
  user: StrapiUser;
}
export function UpdateProfileForm({ user }: Props) {
  const submit = useSubmit();
  const { state, formData } = useNavigation();
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<UpdateProfileValues>({
    mode: "onBlur",
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      _intent: UPDATE_PROFILE_INTENT,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      language: user.language || "en-US",
    },
  });
  const { t } = useTranslation();
  const { control, watch, handleSubmit } = methods;

  const onSubmit: SubmitHandler<UpdateProfileValues> = (_data) => {
    submit(ref.current);
  };

  const lang = watch("language");
  useChangeLanguage(lang as string);

  const isSubmitting =
    state === "submitting" &&
    formData &&
    formData.get("_intent") === UPDATE_PROFILE_INTENT;

  return (
    <Card className="w-full">
      <Form {...methods}>
        <form method="post" ref={ref} onSubmit={handleSubmit(onSubmit)}>
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
          <fieldset disabled={isSubmitting}>
            <CardHeader>
              <CardTitle>{t("account.profile_settings")}</CardTitle>
              <CardDescription>
                {t("account.profile_settings_subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("basics.firstName")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("basics.lastName")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("base.language")}</FormLabel>
                    <Select
                      name={field.name}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language to use" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="en-US">
                          {t("base.english")}
                        </SelectItem>
                        <SelectItem value="es-ES">
                          {t("base.spanish")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
