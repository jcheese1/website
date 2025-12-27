import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "jcheese" },
    { name: "description", content: "this is jcheese's website" },
  ];
}

const projects = [
  { name: "Bridgeworld", url: "https://bw.archive.jcheese.xyz/" },
  { name: "Marketplace", url: "https://marketplace.archive.jcheese.xyz/" },
  { name: "Smolverse", url: "https://smb.archive.jcheese.xyz/" },
  { name: "Smolcoin", url: "https://coin.archive.jcheese.xyz/" },
  { name: "Agent Creator", url: "https://treasure.lol/agents" },
  { name: "AI Frens", url: "https://aifrens.lol/" }
];

const skills = [
  "TypeScript",
  "React",
  "Three.js",
  "Cloudflare",
  "Blender",
  "Web3",
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center px-6 py-12 max-w-lg mx-auto">
      <h1 className="text-3xl font-medium tracking-tight text-stone-900">
        jcheese
      </h1>
      <p className="mt-3 text-stone-500 leading-relaxed">
        Full stack engineer with 8 years exp. Built web3, games, and AI-driven
        products at TreasureDAO. Passion for design and serverless edge.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="text-xs px-2 py-1 rounded bg-stone-200 text-stone-600"
          >
            {skill}
          </span>
        ))}
      </div>

      <nav className="mt-10">
        <h2 className="text-xs uppercase tracking-widest text-stone-400 mb-4">
          Archive / My Work
        </h2>
        <ul className="space-y-2">
          {projects.map((project) => (
            <li key={project.name}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
              >
                <span className="group-hover:underline underline-offset-2">
                  {project.name}
                </span>
                <span className="text-stone-300 group-hover:translate-x-0.5 transition-transform">
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
