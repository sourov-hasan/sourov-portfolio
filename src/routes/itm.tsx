import { createFileRoute } from "@tanstack/react-router";
import { ItmPage } from "@/components/itm-page";
import departmentPhoto from "@/assets/sourov-itm-department.jpeg.asset.json";

export const Route = createFileRoute("/itm")({
  head: () => ({ meta: [
    { title: "Explore ITM at DIU — Md Sourov Hasan" },
    { name: "description", content: "Explore Information Technology & Management at Daffodil International University: FinTech, Project Management, semester courses, and career pathways." },
    { property: "og:title", content: "Explore ITM — Sourov’s Academic Journey" },
    { property: "og:description", content: "Discover DIU’s ITM department, its two majors, and an interactive semester-by-semester course explorer." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    ...(departmentPhoto.url.startsWith("https://") ? [{ property: "og:image", content: departmentPhoto.url }, { name: "twitter:image", content: departmentPhoto.url }] : []),
  ] }),
  component: ItmPage,
});