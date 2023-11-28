import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEnv(key: string) {
  if (typeof window === "undefined") {
    return process.env[key];
  }
  return window.ENV[key];
}
