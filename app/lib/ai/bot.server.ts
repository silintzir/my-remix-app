import { OpenAI } from "langchain/llms/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import chalk from "chalk";
import type { Step } from "@/lib/types";
import { sample } from "./sample.server";

const engine = process.env.AI_ENGINE;

export function humanLog(msg: string) {
  console.log(`${chalk.blue.yellow("HUMAN")}:  ${msg}`);
}

export function aiLog(msg: string) {
  console.log(`${chalk.blue.green("AIBOT")}:  ${msg}`);
}

export function extractJson(text: string) {
  const attempts = [text, `{${text}}`, `{"results":${text}}`];

  for (let i = 0; i < attempts.length; i++) {
    let text = attempts[i];
    const firstBracePosition = text.indexOf("{");
    const excluded = [0, text.length - 1];
    if (excluded.indexOf(firstBracePosition) === -1) {
      text = text.substring(firstBracePosition);
    }
    const lastBracePosition = text.lastIndexOf("}");
    if (excluded.indexOf(lastBracePosition) === -1) {
      text = text.substring(0, lastBracePosition + 1);
    }
    return text;
  }
  return "{results: []}";
}

export function randomResponse(type: Step, mode: "one" | "multi" = "one") {
  if (mode === "one") {
    const suggestions = sample[type];
    const index = Math.floor(Math.random() * suggestions.length);
    return suggestions[index];
  }
  const result = [];
  const tempArray = [...sample[type]]; // Create a copy of the hobbies array

  for (let i = 0; i < 5; i++) {
    if (tempArray.length === 0) {
      break;
    }
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    result.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1); // Remove the selected hobby from tempArray
  }

  return result;
}

export class NoMemory {
  private _chain: any;

  constructor(temperature = 0.7) {
    const openaiConf = {
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: process.env.OPENAI_MODEL,
      maxTokens: +(process.env.OPENAI_MAX_TOKENS as string),
      temperature,
    };
    const geminiConf = {
      apiKey: process.env.GOOGLE_API_KEY,
      modelName: process.env.GOOGLE_AI_MODEL,
      maxOutputTokens: +(process.env.GOOGLE_MAX_TOKENS as string),
      temperature,
    };

    this._chain =
      engine === "openai"
        ? new OpenAI(openaiConf)
        : new ChatGoogleGenerativeAI(geminiConf);
  }

  public async send(input: string, log = true) {
    const response =
      engine === "openai"
        ? await this._chain.invoke(input)
        : await this._chain.invoke(input).lc_kwargs.content;
    if (log) {
      humanLog(input);
      aiLog(response);
    }
    return response;
  }
}
