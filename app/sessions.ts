import { createCookieSessionStorage } from "@remix-run/node";
import { type GuestValues } from "./components/guest/schema";

export type AuthValues = {
  id: number;
  jwt: string;
  email: string;
};

export type SessionData = {
  guest: GuestValues;
  user: AuthValues;
};

export type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      maxAge: 60 * 60,
      path: "/",
      sameSite: "strict",
      secrets: ["s3cret1"],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };
