import { env } from "cloudflare:workers";
import type { Env } from "../alchemy.run";

export function getEnv() {
  return Object.fromEntries(
    Object.entries(env).filter(([key]) => key.startsWith('PUBLIC_')),
  ) as {
    [K in keyof Env as K extends `PUBLIC_${string}` ? K : never]: Env[K];
  };
}

export type PublicEnv = ReturnType<typeof getEnv>;
