import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "jcheese" },
    { name: "description", content: "this is jcheese's website" },
  ];
}

export default function Home() {
  return <Welcome message="jcheese" secret="jcheese" />;  
}
