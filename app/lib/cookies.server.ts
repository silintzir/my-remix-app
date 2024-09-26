import { createCookie } from "@remix-run/node"; // or cloudflare/deno

export const sourceCookie = createCookie("rr_source", {
  maxAge: 60 * 60 * 24 * 1000,
});
