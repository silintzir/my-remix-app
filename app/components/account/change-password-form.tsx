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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "@/lib/account/validation";

export function ChangePasswordForm() {
  const methods = useForm<ChangePasswordValues>({
    mode: "onBlur",
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      passwordRepeat: "",
    },
  });
  const { control } = methods;

  return (
    <Card className="flex-grow">
      <Form {...methods}>
        <fieldset>
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
            <Button type="submit">Update</Button>
          </CardFooter>
        </fieldset>
      </Form>
    </Card>
  );
}
