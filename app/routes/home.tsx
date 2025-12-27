import { AnimatePresence, motion } from "motion/react";
import { redirect, useFetcher } from "react-router";
import { commitSession, getSession } from "~/sessions/lang";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "jcheese" },
    { name: "description", content: "this is jcheese's website" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  return { lang: session.get("lang") || "en" };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const session = await getSession(request.headers.get("Cookie"));
  session.set("lang", formData.get("lang") as "en" | "ja");
  return redirect(`/`, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

const projects = [
  { name: "Bridgeworld", url: "https://bw.archive.jcheese.xyz/" },
  { name: "Marketplace", url: "https://marketplace.archive.jcheese.xyz/" },
  { name: "Smolverse", url: "https://smb.archive.jcheese.xyz/" },
  { name: "Smolcoin", url: "https://coin.archive.jcheese.xyz/" },
  { name: "Agent Creator", url: "https://treasure.lol/agents" },
  { name: "AI Frens", url: "https://aifrens.lol/" },
];

const skills = [
  "TypeScript",
  "React",
  "Three.js",
  "Cloudflare",
  "Blender",
  "Web3",
];

const description = {
  en: "Full stack engineer with 8 years exp. Built web3, games, and AI-driven products at TreasureDAO. Passion for design and serverless edge.",
  ja: "8年間の経験を持つフルスタックエンジニアです。TreasureDAOでWeb3、ゲーム、AIを活用したプロダクトの開発に携わってきました。デザインとサーバーレス／エッジコンピューティングに強い情熱を持っています。",
} as const;

const archiveText = {
  en: "Archive / My Work",
  ja: "アーカイブ / 私の作品",
} as const;

export default function Home({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher();
  const optimisticLang = fetcher.formData?.get("lang") as "en" | "ja" | null;
  const lang = optimisticLang || loaderData.lang;

  return (
    <main className="relative mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12">
      <div className="absolute top-6 right-6 flex gap-1 text-xs">
        <fetcher.Form method="post">
          <input type="hidden" name="lang" value="en" />
          <button
            type="submit"
            className={`rounded px-2 py-1 transition-colors ${
              lang === "en"
                ? "bg-orange-500/20 text-orange-400"
                : "text-stone-500 hover:text-stone-300"
            }`}
          >
            EN
          </button>
        </fetcher.Form>
        <fetcher.Form method="post">
          <input type="hidden" name="lang" value="ja" />
          <button
            type="submit"
            className={`rounded px-2 py-1 transition-colors ${
              lang === "ja"
                ? "bg-orange-500/20 text-orange-400"
                : "text-stone-500 hover:text-stone-300"
            }`}
          >
            JA
          </button>
        </fetcher.Form>
      </div>
      <h1 className="font-medium text-3xl text-orange-500 tracking-tight">
        jcheese
      </h1>
      <AnimatePresence initial={false} mode="wait">
        <motion.p
          key={lang}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-3 text-stone-300 leading-relaxed"
        >
          {description[lang]}
        </motion.p>
      </AnimatePresence>

      <div className="mt-6 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded bg-orange-500/10 px-2 py-1 text-orange-400 text-xs"
          >
            {skill}
          </span>
        ))}
      </div>

      <nav className="mt-10">
        <h2 className="mb-4 text-stone-500 text-xs uppercase tracking-widest">
          {archiveText[lang]}
        </h2>
        <ul className="space-y-2">
          {projects.map((project) => (
            <li key={project.name}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-stone-400 transition-colors hover:text-orange-400"
              >
                <span className="underline-offset-2 group-hover:underline">
                  {project.name}
                </span>
                <span className="text-stone-600 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
