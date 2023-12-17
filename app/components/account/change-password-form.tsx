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

export function ChangePasswordForm() {
  const { state } = useNavigation();
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

  const onSubmit: SubmitHandler<ChangePasswordValues> = (_data) => {
    submit(ref.current);
  };

  const isSubmitting = state === "submitting";

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
              <CardTitle>Security settings</CardTitle>
              <CardDescription>Change your password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
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
                    <FormLabel>Repeat password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit">
                {isSubmitting ? "Please wait" : "Update"}
              </Button>
            </CardFooter>
          </fieldset>
        </form>
      </Form>
    </Card>
  );
}
