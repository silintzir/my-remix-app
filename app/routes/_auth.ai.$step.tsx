import { NoMemory, extractJson, randomResponse } from "@/lib/ai/bot.server";
import { createPrompt } from "@/lib/ai/prompts.server";
import type { Lang, Step } from "@/lib/types";
import { json, type ActionFunctionArgs } from "@remix-run/node";
import { get } from "lodash-es";
import chalk from "chalk";

export async function action({ request, params }: ActionFunctionArgs) {
  const posted = Object.fromEntries(await request.formData()) as {
    context: string;
    original?: string;
  };
  const step = params.step as Step;
  try {
    const context = JSON.parse(get(posted, "context", "{}"));
    const original = get(posted, "original");
    const lang = get(posted, "lang", "en") as Lang;
    const bot = new NoMemory();
    const input = createPrompt(step, context, original, lang);
    const response = await bot.send(input);
    const extracted = JSON.parse(extractJson(response));
    return json(extracted);
  } catch (e) {
    console.error(
      chalk.red(`Failed to get AI suggestions/enhancements for ${step}`)
    );
    return json({
      results: randomResponse(step, "multi"),
    });
  }
}
