import {
  AnimatePresence,
  clamp,
  type MotionValue,
  motion,
  type Transition,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { Cursor, usePointerPosition } from "motion-plus/react";
import { useState } from "react";
import { redirect, useFetcher } from "react-router";
import agentCreatorMovie from "~/assets/agent-creator.webm";
import aifrensMovie from "~/assets/aifrens.webm";
import bwMovie from "~/assets/bw.webm";
import mpMovie from "~/assets/mp.webm";
import smbMovie from "~/assets/smb.webm";
import smolcoinMovie from "~/assets/smolcoin.webm";

import { commitSession, getSession } from "~/sessions/lang";
import type { Route } from "./+types/home";

const allVideos = [
  bwMovie,
  mpMovie,
  smbMovie,
  smolcoinMovie,
  agentCreatorMovie,
  aifrensMovie,
];

export const links: Route.LinksFunction = () =>
  allVideos.map((video) => ({
    rel: "preload",
    href: video,
    as: "video",
    type: "video/webm",
  }));

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
  {
    name: "Bridgeworld",
    url: "https://bw.archive.jcheese.xyz/",
    video: bwMovie,
  },
  {
    name: "Marketplace",
    url: "https://marketplace.archive.jcheese.xyz/",
    video: mpMovie,
  },
  {
    name: "Smolverse",
    url: "https://smb.archive.jcheese.xyz/",
    video: smbMovie,
  },
  {
    name: "Smolcoin",
    url: "https://coin.archive.jcheese.xyz/",
    video: smolcoinMovie,
  },
  {
    name: "Agent Creator",
    url: "https://treasure.lol/agents",
    video: agentCreatorMovie,
  },
  { name: "AI Frens", url: "https://aifrens.lol/", video: aifrensMovie },
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
    <>
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
              <Item key={project.name} video={project.video}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-stone-400 transition-colors hover:text-orange-400"
                >
                  <span className="underItemne-offset-2 group-hover:underline">
                    {project.name}
                  </span>
                  <span className="text-stone-600 transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
              </Item>
            ))}
          </ul>
        </nav>
        {/* <div className="filter-[url(#ambilight)] aspect-video w-96 overflow-clip">
          <video
            className="h-full w-full rounded-sm object-cover"
            src={bwMovie}
            autoPlay
            onLoadedMetadata={(e) => {
              e.currentTarget.playbackRate = 2;
            }}
            loop
            muted
            playsInline
            disablePictureInPicture
            disableRemotePlayback
          />
        </div> */}
      </main>
      <svg width="0" height="0" aria-hidden="true">
        <filter
          id="ambilight"
          width="200%"
          height="200%"
          x="-0.75"
          y="-0.75"
          colorInterpolationFilters="sRGB"
        >
          <feOffset in="SourceGraphic" result="source-copy" />
          <feColorMatrix
            in="source-copy"
            type="saturate"
            values="3"
            result="saturated-copy"
          />
          <feColorMatrix
            in="saturated-copy"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    33 33 33 101 -100"
            result="bright-colors"
          />
          <feMorphology
            in="bright-colors"
            operator="dilate"
            radius="0"
            result="spread"
          />
          <feGaussianBlur
            in="spread"
            stdDeviation="20"
            result="ambilight-light"
          />
          <feOffset in="SourceGraphic" result="source" />
          <feComposite in="source" in2="ambilight-light" operator="over" />
        </filter>
      </svg>
    </>
  );
}

function usePointerToSkew(axisMotionValue: MotionValue<number>) {
  const velocity = useVelocity(axisMotionValue);
  const maxVelocity = useTransform(() => clamp(-1000, 1000, velocity.get()));
  const smoothVelocity = useSpring(maxVelocity, {
    damping: 10,
    stiffness: 200,
  });
  return useTransform(smoothVelocity, [0, 100], [0, -1], {
    clamp: false,
  });
}

const enterTransition: Transition = {
  duration: 0.5,
  ease: [0, 0.54, 0.37, 0.97],
};

const exitTransition: Transition = {
  duration: 0.2,
  ease: "easeIn",
};

function Item({
  children,
  video,
}: {
  children: React.ReactNode;
  video: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const position = usePointerPosition();
  const skewX = usePointerToSkew(position.x);
  const skewY = usePointerToSkew(position.y);

  return (
    <motion.li
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <Cursor
            follow
            offset={{ x: 10, y: 10 }}
            variants={{
              default: {
                clipPath: "inset(-50% -50% -50% -50%)",
                transition: enterTransition,
              },
              exit: {
                clipPath: "inset(50% 50% 50% 50%)",
                transition: exitTransition,
              },
            }}
            style={{ skewX, skewY, originX: 0, originY: 0 }}
            key="cursor"
          >
            <motion.div
              variants={{
                default: {
                  scale: 1,
                  transition: enterTransition,
                },
                exit: {
                  scale: 1.5,
                  transition: exitTransition,
                },
              }}
              className="filter-[url(#ambilight)] aspect-video w-96"
            >
              <video
                className="h-full w-full rounded-sm object-cover"
                src={video}
                autoPlay
                onLoadedMetadata={(e) => {
                  e.currentTarget.playbackRate = 2;
                }}
                loop
                muted
                playsInline
                disablePictureInPicture
                disableRemotePlayback
              />
            </motion.div>
          </Cursor>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
