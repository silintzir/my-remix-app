import { type AuthValues, getSession } from "@/sessions";
import { InputErrors } from "domain-functions";
import { get, map } from "lodash-es";
import type { StrapiUser } from "./types";

export interface StrapiRestResponse {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data: any;
  error: {
    status: number; // HTTP Status Code
    name: "ValidationError" | "ApplicationError";
    message: string; // a human readable error message
    details: {
      errors?: Array<{
        path: string[];
        message: string;
        name: "ValidationError";
      }>;
    };
  };
}

export interface StrapiAuthResponse {
  jwt: string;
  user: StrapiUser;
}

export function authToSession(apiResponse: StrapiAuthResponse): AuthValues {
  const id = get(apiResponse, "user.id", 0);
  const email = get(apiResponse, "user.email", "");
  const jwt = get(apiResponse, "jwt", "");
  return {
    id,
    email,
    jwt,
  };
}

export function throwOnStrapiError(error: StrapiRestResponse) {
  const { name, message, details } = error.error || {};
  if (name === "ApplicationError") {
    throw new Error(message);
  }

  if (name === "ValidationError") {
    if (!details.errors) {
      // not a specific field error
      throw new Error(message);
    }
    const errors = map(details.errors, (err) => ({
      message: err.message,
      path: err.path[0],
    }));
    throw new InputErrors(errors);
  }
}

export async function authenticatedFetch(
  request: Request,
  endpoint: string,
  config: RequestInit
) {
  const session = await getSession(request.headers.get("Cookie"));
  const jwt = get(session.get("user"), "jwt", "");
  const response = await fetch(`${process.env.STRAPI_HOST}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    ...config,
  });
  return await response.json();
}

export async function fetchMe(request: Request): Promise<StrapiUser> {
  console.log("fetching me");
  return await authenticatedFetch(request, "/api/users/me", { method: "GET" });
}
