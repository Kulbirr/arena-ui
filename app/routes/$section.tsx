import { ArenaApp } from "@/components/arena/ArenaApp";

const sections = new Set([
  "fighters",
  "leaderboard",
  "battles",
  "treasury",
  "admin",
]);

export function meta({ params }: { params: { section?: string } }) {
  const section = sections.has(params.section ?? "") ? params.section : "Arena";
  const title = section ? section[0].toUpperCase() + section.slice(1) : "Arena";
  return [{ title: `${title} · ARENA-PROJECT` }];
}

export default function SectionRoute({
  params,
}: {
  params: { section?: string };
}) {
  return <ArenaApp section={params.section} />;
}
