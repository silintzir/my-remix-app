import { z } from "zod";
import { ERROR_PASSWORD_MISMATCH, ERROR_REQUIRED } from "../validation";

export const UPDATE_PROFILE_INTENT = "updateProfile";
export const CHANGE_PASSWORD_INTENT = "changePassword";
export const DELETE_ACCOUNT_INTENT = "deleteAccount";
export type Intent =
  | typeof UPDATE_PROFILE_INTENT
  | typeof DELETE_ACCOUNT_INTENT
  | typeof CHANGE_PASSWORD_INTENT;

export const updateProfileSchema = z.object({
  _intent: z.enum([UPDATE_PROFILE_INTENT]),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  language: z.string().optional(),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z
  .object({
    _intent: z.enum([CHANGE_PASSWORD_INTENT]),
    password: z.string(),
    passwordRepeat: z.string().min(8),
  })
  .refine(
    (data) => {
      return data.password && data.password.trim().length > 0;
    },
    {
      message: ERROR_REQUIRED,
      path: ["password"],
    }
  )
  .refine(
    (data) => {
      return data.passwordRepeat && data.passwordRepeat.trim().length > 0;
    },
    {
      message: ERROR_REQUIRED,
      path: ["passwordRepeat"],
    }
  )
  .refine(
    (data) => {
      return data.passwordRepeat === data.password;
    },
    {
      message: ERROR_PASSWORD_MISMATCH,
      path: ["passwordRepeat"],
    }
  );

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export const deleteAccountSchema = z.object({
  _intent: z.enum([DELETE_ACCOUNT_INTENT]),
  confirm: z.string().regex(/^Delete me$/, "Repeat the phrase exactly"),
});

export type DeleteAccountValues = z.infer<typeof deleteAccountSchema>;
