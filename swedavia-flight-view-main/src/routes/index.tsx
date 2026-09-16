import { createFileRoute } from "@tanstack/react-router";
import { FlightDashboard } from "@/components/FlightDashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Swedavia Flight Dashboard" },
      {
        name: "description",
        content: "Live avgångar och ankomster från Swedavia — sök, filtrera och sortera flyg.",
      },
      { property: "og:title", content: "Swedavia Flight Dashboard" },
      {
        property: "og:description",
        content: "Live avgångar och ankomster från Swedavia — sök, filtrera och sortera flyg.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return <FlightDashboard />;
}
