import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Lang } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEnv(key: string) {
  if (typeof window === "undefined") {
    return process.env[key];
  }
  return window.ENV[key];
}

export const getLanguage = (code: Lang) =>
  code === "en" ? "English" : "Spanish";
