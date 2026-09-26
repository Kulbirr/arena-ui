import { useSearchParams } from "react-router";

import { recentBattles } from "@/components/arena/arena-data";
import { ArenaApp } from "@/components/arena/ArenaApp";

export function meta() {
  return [
    { title: "ARENA-PROJECT · Live Arena" },
    { name: "description", content: "Watch the AI fighter arena." },
  ];
}

export default function HomeRoute() {
  const [searchParams] = useSearchParams();
  const replayTitle = searchParams.get("replay");
  const initialBattle = recentBattles.find(
    (battle) => battle.title === replayTitle,
  );
  return <ArenaApp initialBattle={initialBattle} />;
}
