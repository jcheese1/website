import { ScrollArea } from "@base-ui/react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
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
import { useId, useState } from "react";
import { redirect, useFetcher } from "react-router";
import agentCreatorMovie from "~/assets/agent-creator.webm";
import aifrensMovie from "~/assets/aifrens.webm";
import bwMovie from "~/assets/bw.webm";
import me from "~/assets/me.png";
import mpMovie from "~/assets/mp.webm";
import smbMovie from "~/assets/smb.webm";
import smolcoinMovie from "~/assets/smolcoin.webm";
import { FlickeringGrid } from "~/components/flickering-grid";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import type { LocalizedWorkExperience } from "~/resume";
import { getLocalizedWorkExperiences, workExperiences } from "~/resume";
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
  const url = new URL(request.url);
  const showAll = url.searchParams.get("showAll") === "true";
  const lang = session.get("lang") || "en";

  const filteredWorkExperiences = showAll
    ? workExperiences
    : workExperiences.filter((experience) => !experience.defaultHidden);

  const localizedWorkExperiences = getLocalizedWorkExperiences(
    filteredWorkExperiences,
    lang,
  );

  return {
    lang,
    filteredWorkExperiences: localizedWorkExperiences,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const session = await getSession(request.headers.get("Cookie"));
  session.set("lang", formData.get("lang") as "en" | "ja");
  const url = new URL(request.url);
  return redirect(`${url.pathname}${url.search}`, {
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

const workExperienceDialog = BaseDialog.createHandle<LocalizedWorkExperience>();

export default function Home({ loaderData }: Route.ComponentProps) {
  const { filteredWorkExperiences } = loaderData;
  const fetcher = useFetcher();
  const optimisticLang = fetcher.formData?.get("lang") as "en" | "ja" | null;
  const lang = optimisticLang || loaderData.lang;

  return (
    <div className="grid">
      <div className="relative [grid-area:1/1]">
        <Timeline />
        {filteredWorkExperiences.map((experience, index) => {
          const previousDate =
            filteredWorkExperiences[index - 1]?.startDate ??
            new Date().getFullYear();

          return (
            <article
              style={
                {
                  "--previous-date": previousDate,
                  "--current-date": experience.startDate,
                } as React.CSSProperties
              }
              key={experience.company}
              className="pt-24 pb-[calc((var(--previous-date)-var(--current-date))*58px)]"
            >
              <header className="relative">
                <div className="absolute top-0 left-[max(-0.5rem,calc(40%-18.125rem))] z-50 flex h-4 items-center justify-end gap-x-2">
                  <div className="h-0.25 w-3.5 bg-stone-400 lg:-mr-3.5 xl:mr-0 xl:bg-stone-300" />
                  <div className="inline-flex">
                    <time className="font-medium text-white/40 text-xs">
                      {experience.startDate}
                    </time>
                  </div>
                  <SheetTrigger
                    payload={experience}
                    handle={workExperienceDialog}
                    render={
                      <button className="absolute inset-0 size-full">
                        <span className="sr-only">Select this experience</span>
                      </button>
                    }
                  />
                </div>
              </header>
            </article>
          );
        })}
      </div>
      <main className="relative mx-auto flex min-h-screen max-w-lg flex-col justify-center px-16 py-12 [grid-area:1/1] sm:px-6">
        <Sheet<LocalizedWorkExperience> handle={workExperienceDialog}>
          {({ payload }) => {
            if (!payload) return null;

            return (
              <SheetContent
                withOverlay={false}
                className="border-stone-800 bg-stone-900/80 backdrop-blur-sm"
              >
                <SheetHeader>
                  <SheetTitle className="font-bold text-orange-500 text-xl sm:text-2xl">
                    {payload.company}
                  </SheetTitle>
                  <SheetDescription className="mt-3 text-sm text-stone-300 sm:text-lg">
                    {payload.title}
                  </SheetDescription>
                  <div className="mt-1 flex items-center gap-2 text-stone-400 text-xs">
                    <span>{payload.location}</span>
                    <span>•</span>
                    <span>{payload.startDate}</span>
                  </div>
                </SheetHeader>
                <ScrollArea.Root className="relative flex min-h-0 flex-1 overflow-hidden before:absolute before:top-0 before:h-px before:w-full before:bg-stone-800 before:content-['']">
                  <ScrollArea.Viewport className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-6 pr-6 pl-1 focus-visible:outline focus-visible:outline-blue-500 focus-visible:-outline-offset-1">
                    <ScrollArea.Content className="flex flex-col gap-6">
                      <div className="prose prose-invert prose-stone">
                        <ul>
                          {payload.responsibilities.map((responsibility) => {
                            return (
                              <li
                                key={responsibility}
                                className="relative pl-2 text-stone-300 leading-relaxed"
                              >
                                {responsibility}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </ScrollArea.Content>
                  </ScrollArea.Viewport>
                  <ScrollArea.Scrollbar className="pointer-events-none absolute m-1 flex w-[0.25rem] justify-center rounded-[1rem] opacity-0 transition-opacity duration-[250ms] data-[hovering]:pointer-events-auto data-[scrolling]:pointer-events-auto data-[hovering]:opacity-100 data-[scrolling]:opacity-100 data-[hovering]:duration-[75ms] data-[scrolling]:duration-[75ms] md:w-[0.325rem]">
                    <ScrollArea.Thumb className="w-full rounded-[inherit] bg-[var(--color-gray-500)] before:absolute before:top-1/2 before:left-1/2 before:h-[calc(100%+1rem)] before:w-[calc(100%+1rem)] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
                  </ScrollArea.Scrollbar>
                </ScrollArea.Root>
              </SheetContent>
            );
          }}
        </Sheet>
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
        <div className="mt-16 flex items-end justify-between sm:mt-0">
          <h1 className="font-medium text-2xl text-orange-500 tracking-tight sm:text-3xl">
            jcheese
          </h1>
          <FlickeringGrid
            imageSrc={me}
            squareSize={2}
            gridGap={2}
            className="size-16 sm:size-24"
            flickerChance={0.1}
          />
        </div>
        <AnimatePresence initial={false} mode="wait">
          <motion.p
            key={lang}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-3 text-sm text-stone-300 leading-relaxed sm:text-base"
          >
            {description[lang]}
          </motion.p>
        </AnimatePresence>

        <div className="mt-6 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded bg-orange-500/10 px-2 py-1 text-orange-400 text-xs sm:text-sm"
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
                  className="group flex items-center gap-2 text-sm text-stone-400 transition-colors hover:text-orange-400 sm:text-base"
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
    </div>
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

function Timeline() {
  const id = useId();

  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="absolute top-0 left-[max(0px,calc(40%-18.125rem))] h-full w-1.5"
        aria-hidden="true"
      >
        <defs>
          <pattern id={id} width="6" height="8" patternUnits="userSpaceOnUse">
            <path
              d="M0 0H6M0 8H6"
              className="stroke-sky-900/10 xl:stroke-white/10 dark:stroke-white/10"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
