import { requiredString } from "@/lib/validation";
import { z } from "zod";

export const validationSchema = z.object({
  firstName: requiredString(),
  lastName: requiredString(),
  email: requiredString().email(),
  company: z.string(),
  message: requiredString(),
});
