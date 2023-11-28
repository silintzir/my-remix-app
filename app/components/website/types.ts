import { type z } from "zod";
import { type validationSchema } from "./validation";
export type ContactData = z.infer<typeof validationSchema>;
