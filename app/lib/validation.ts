import * as z from "zod";

export const ERROR_REQUIRED = "Field is required";
export const ERROR_INVALID_EMAIL = "Invalid email";
export const ERROR_PASSWORD_MISMATCH = "Password mismatch";

export const requiredString = () => z.string().min(1, ERROR_REQUIRED);
