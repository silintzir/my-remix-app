import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAI } from "langchain/llms/openai";
import chalk from "chalk";
import type { Step } from "@/lib/types";
import { sample } from "./sample.server";

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

export const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.8,
});

export class NoMemory {
  private _chain: OpenAI;

  constructor(temperature = 0.7) {
    this._chain = new OpenAI({
      modelName: "gpt-4",
      openAIApiKey: process.env.OPENAI_API_KEY,
      maxTokens: 2400,
      temperature,
    });
  }

  public async send(input: string, log = true) {
    const response = await this._chain.predict(input);
    if (log) {
      humanLog(input);
      aiLog(response);
    }
    return response;
  }
}
