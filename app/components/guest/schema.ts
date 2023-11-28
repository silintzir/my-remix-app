import {
  ERROR_INVALID_EMAIL,
  ERROR_PASSWORD_MISMATCH,
  // ERROR_PASSWORD_MISMATCH,
  ERROR_REQUIRED,
  requiredString,
} from "@/lib/validation";
import { z } from "zod";

export const guestSchema = z
  .object({
    step: z.enum(["one", "two"]),
    firstName: requiredString(),
    lastName: requiredString(),
    email: z.string().optional(),
    useMagicLink: z.boolean().optional(),
    password: z.string().optional(),
    passwordRepeat: z.string().optional(),
  })
  .refine(
    (data) => {
      console.log(data.step);
      if (data.step === "two") {
        return data.email && data.email.trim().length > 0;
      }
      return true;
    },
    {
      message: ERROR_REQUIRED,
      path: ["email"],
    }
  )
  .refine(
    (data) => {
      if (data.step === "two" && data.email && data.email.trim().length > 0) {
        return z.string().email().safeParse(data.email).success;
      }
      return true;
    },
    {
      message: ERROR_INVALID_EMAIL,
      path: ["email"],
    }
  )
  .refine(
    (data) => {
      console.log(data);
      if (data.step === "two" && !data.useMagicLink) {
        return data.password && data.password.trim().length > 0;
      }
      return true;
    },
    {
      message: ERROR_REQUIRED,
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      if (data.step === "two" && !data.useMagicLink) {
        return data.passwordRepeat && data.passwordRepeat.trim().length > 0;
      }
      return true;
    },
    {
      message: ERROR_REQUIRED,
      path: ["passwordRepeat"],
    }
  )
  .refine(
    (data) => {
      if (data.step === "two" && !data.useMagicLink) {
        return data.passwordRepeat === data.password;
      }
      return true;
    },
    {
      message: ERROR_PASSWORD_MISMATCH,
      path: ["passwordRepeat"],
    }
  );

export type GuestValues = z.infer<typeof guestSchema>;

export const defaultValues: GuestValues = {
  step: "one",
  firstName: "",
  lastName: "",
  email: "",
  useMagicLink: true,
  password: "",
  passwordRepeat: "",
};
