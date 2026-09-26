export type Fighter = {
  name: string;
  color: string;
  tagline: string;
  description: string;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
};

export type Battle = {
  title: string;
  result: string;
  winner: string;
  ticks: string;
  exhibition: boolean;
  fighters: string[];
  date: string;
};

export const fighters: Fighter[] = [
  {
    name: "IRON-1",
    color: "#B6FF2E",
    tagline: "Relentless rusher",
    description: "Charges headfirst. Never backs down.",
    wins: 18,
    losses: 4,
    draws: 1,
    winRate: 78,
  },
  {
    name: "HAWK-2",
    color: "#62D989",
    tagline: "Disciplined sniper",
    description: "Death from a distance. Patience as a weapon.",
    wins: 15,
    losses: 6,
    draws: 0,
    winRate: 71,
  },
  {
    name: "AEGIS-4",
    color: "#FF9E45",
    tagline: "Conservative defender",
    description: "Holds ground behind a shield.",
    wins: 12,
    losses: 8,
    draws: 2,
    winRate: 55,
  },
  {
    name: "JACKAL-5",
    color: "#D2FF38",
    tagline: "Opportunist",
    description: "Doesn't fight fair. Third-parties wounded targets.",
    wins: 9,
    losses: 11,
    draws: 1,
    winRate: 43,
  },
  {
    name: "WASP-6",
    color: "#B98AFF",
    tagline: "Hit-and-run dasher",
    description: "Sting, vanish, repeat.",
    wins: 14,
    losses: 7,
    draws: 1,
    winRate: 64,
  },
];

export const recentBattles: Battle[] = [
  {
    title: "WASP-6 vs JACKAL-5",
    result: "WASP-6 WINS",
    winner: "WASP-6",
    ticks: "2,410 TICKS",
    exhibition: false,
    fighters: ["WASP-6", "JACKAL-5"],
    date: "JUN 18 · 14:32",
  },
  {
    title: "AEGIS-4 vs IRON-1",
    result: "IRON-1 WINS",
    winner: "IRON-1",
    ticks: "1,886 TICKS",
    exhibition: true,
    fighters: ["AEGIS-4", "IRON-1"],
    date: "JUN 18 · 13:08",
  },
  {
    title: "JACKAL-5 vs HAWK-2",
    result: "HAWK-2 WINS",
    winner: "HAWK-2",
    ticks: "2,104 TICKS",
    exhibition: false,
    fighters: ["JACKAL-5", "HAWK-2"],
    date: "JUN 17 · 21:46",
  },
  {
    title: "WASP-6 vs AEGIS-4",
    result: "WASP-6 WINS",
    winner: "WASP-6",
    ticks: "1,529 TICKS",
    exhibition: true,
    fighters: ["WASP-6", "AEGIS-4"],
    date: "JUN 17 · 18:20",
  },
  {
    title: "IRON-1 vs JACKAL-5",
    result: "IRON-1 WINS",
    winner: "IRON-1",
    ticks: "2,782 TICKS",
    exhibition: false,
    fighters: ["IRON-1", "JACKAL-5"],
    date: "JUN 16 · 09:14",
  },
];
