import { createRequestHandler } from "react-router";
import type { CloudflareEnv } from "../alchemy.run";
import { Counter } from "./do/counter";

export { Counter }

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: CloudflareEnv;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  // @ts-ignore
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/counter")) {
      const id = env.COUNTER.idFromName("A");
      const stub = env.COUNTER.get(id);
      return stub.increment();
    }
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
}