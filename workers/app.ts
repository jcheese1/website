import { createRequestHandler } from "react-router";
import type { CloudflareEnv } from "../alchemy.run";

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
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
}