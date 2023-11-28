import { createCookieSessionStorage } from "@remix-run/node";
import { type GuestValues } from "./components/guest/schema";

export type AuthUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  jwt: string;
};

export type SessionData = {
  guest: GuestValues;
  user: AuthUser;
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
