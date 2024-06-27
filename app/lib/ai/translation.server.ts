import { v2 } from "@google-cloud/translate";
import { getEnv } from "@/lib/utils";

const client = new v2.Translate({ key: getEnv("GOOGLE_TRANSLATE_API_KEY") });

export const translate = async (
  text: string[],
  { from, to }: v2.TranslateRequest
) => client.translate(text, { from, to });
