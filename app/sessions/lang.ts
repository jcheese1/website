import { createCookieSessionStorage } from "react-router";


type SessionData = {
  lang: "en" | "ja";
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      sameSite: "lax",
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      secrets: process.env.SESSION_SECRET?.split(","),
      secure: process.env.NODE_ENV === "production",
    },
  });

export { getSession, commitSession, destroySession };
