import { z } from "zod";

export const UPDATE_PROFILE_INTENT = "updateProfile";
export const CHANGE_PASSWORD_INTENT = "changePassword";
export type Intent =
  | typeof UPDATE_PROFILE_INTENT
  | typeof CHANGE_PASSWORD_INTENT;

export const updateProfileSchema = z.object({
  _intent: z.enum([UPDATE_PROFILE_INTENT]),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  _intent: z.enum([CHANGE_PASSWORD_INTENT]),
  password: z.string(),
  passwordRepeat: z.string(),
});

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
