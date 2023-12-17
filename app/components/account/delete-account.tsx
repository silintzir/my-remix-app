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
              <CardTitle className="text-destructive">Delete account</CardTitle>
              <CardDescription>
                Delete forever any data you have provided to us.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter "Delete me"</FormLabel>
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
                {isSubmitting ? "Please wait" : "Delete"}
              </Button>
            </CardFooter>
          </fieldset>
        </form>
      </Form>
    </Card>
  );
}
