/// <reference types="@types/bun" />

import alchemy, { Scope } from "alchemy";
import { ReactRouter } from "alchemy/cloudflare";
import { CloudflareStateStore, FileSystemStateStore } from "alchemy/state";
import { GitHubComment } from "alchemy/github";

const stage = process.env.STAGE ?? "dev";

const fileStateStore = (scope: Scope) => new FileSystemStateStore(scope);

const cloudflareStateStore = (scope: Scope) => new CloudflareStateStore(scope, {
  stateToken: alchemy.secret(process.env.ALCHEMY_STATE_TOKEN),
  scriptName: `jcheese-website-state-service-${stage === "prod" ? "prod" : "dev"}`
});

const app = await alchemy("jcheese-website", {
  stage,
  password: process.env.ALCHEMY_PASSWORD,
  stateStore: stage === "dev" ? fileStateStore : cloudflareStateStore,
});


export const worker = await ReactRouter("website", {
  adopt: true,
});


if (process.env.PULL_REQUEST) {
  // if this is a PR, add a comment to the PR with the preview URL
  // it will auto-update with each push
  await GitHubComment("preview-comment", {
    owner: process.env.GITHUB_REPOSITORY_OWNER || "your-username",
    repository: process.env.GITHUB_REPOSITORY_NAME || "your-repo",
    issueNumber: Number(process.env.PULL_REQUEST),
    body: `
     ## 🚀 Preview Deployed

     Your changes have been deployed to a preview environment:

     **🌐 Website:** ${worker.url}

     Built from commit ${process.env.GITHUB_SHA?.slice(0, 7)}

     ---
     <sub>🤖 This comment updates automatically with each push.</sub>`,
  });
}

// types
export type CloudflareEnv = typeof worker.Env;

export type Env = {
  [K in keyof CloudflareEnv as CloudflareEnv[K] extends string
    ? K
    : never]: CloudflareEnv[K];
};

console.log({
  url: worker.url,
  name: app.name
});

await app.finalize();


