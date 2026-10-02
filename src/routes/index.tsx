import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/components/portfolio-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Md Sourov Hasan — Aspiring System Designer & Software Architect" },
      { name: "description", content: "Portfolio of Md Sourov Hasan, an ITM student building full-stack, database, AI/ML, and system design projects." },
      { property: "og:title", content: "Md Sourov Hasan — System Designer Portfolio" },
      { property: "og:description", content: "Explore the projects, skills, and technical journey of aspiring system designer Md Sourov Hasan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortfolioPage,
});
