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
import { useRef } from "react";
import { type StrapiUser } from "@/lib/types";

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
    },
  });
  const { control, handleSubmit } = methods;

  const onSubmit: SubmitHandler<UpdateProfileValues> = (_data) => {
    submit(ref.current);
  };

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
              <CardTitle>Profile settings</CardTitle>
              <CardDescription>Update your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
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
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
