import { useState } from "react";
import { Link } from "react-router";

import { fighters, recentBattles } from "./arena-data";

type ArenaSectionsProps = {
  section: string;
  onNotice: (message: string) => void;
};

export function ArenaSections({ section, onNotice }: ArenaSectionsProps) {
  if (section === "fighters") return <FightersPage />;
  if (section === "leaderboard") return <LeaderboardPage />;
  if (section === "battles") return <BattlesPage />;
  if (section === "treasury") return <TreasuryPage onNotice={onNotice} />;
  if (section === "admin") return <AdminPage onNotice={onNotice} />;

  return (
    <main className="placeholder-page">
      <div className="placeholder-kicker">
        ARENA-PROJECT <span>/</span> {section.toUpperCase()}
      </div>
      <h1>Page not found</h1>
      <Link to="/" className="back-to-arena">
        ← Return to arena
      </Link>
    </main>
  );
}

function FightersPage() {
  return (
    <main className="section-page">
      <div className="section-heading">
        <h1>FIGHTER ROSTER</h1>
        <span>05 HOUSE FIGHTERS</span>
      </div>
      <div className="fighter-grid">
        {fighters.map((fighter, index) => (
          <article
            className="fighter-card"
            key={fighter.name}
            style={{ "--fighter-color": fighter.color } as React.CSSProperties}
          >
            <div
              className={`fighter-art fighter-art-${index + 1}`}
              aria-hidden="true"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <i />
            </div>
            <div className="fighter-card-heading">
              <h2>{fighter.name}</h2>
              <span>ACTIVE</span>
            </div>
            <strong className="fighter-tagline">{fighter.tagline}</strong>
            <p>{fighter.description}</p>
            <div className="fighter-record">
              <div>
                <span>W</span>
                <strong>{fighter.wins}</strong>
              </div>
              <div>
                <span>L</span>
                <strong>{fighter.losses}</strong>
              </div>
              <div>
                <span>D</span>
                <strong>{fighter.draws}</strong>
              </div>
              <div className="win-rate">
                <span>WIN RATE</span>
                <strong>{fighter.winRate}%</strong>
              </div>
            </div>
            <div className="fighter-rate-track">
              <i style={{ width: `${fighter.winRate}%` }} />
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function LeaderboardPage() {
  const ranked = [...fighters].sort((a, b) => b.winRate - a.winRate);
  return (
    <main className="section-page">
      <div className="section-heading">
        <h1>LEADERBOARD</h1>
        <span>CAREER RECORDS</span>
      </div>
      <div className="data-panel table-panel">
        <div className="table-headline">
          <span>ALL-TIME STANDINGS</span>
          <span>UPDATED LIVE</span>
        </div>
        <div className="table-scroll">
          <table className="arena-table leaderboard-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>FIGHTER</th>
                <th>W</th>
                <th>L</th>
                <th>D</th>
                <th>WIN RATE</th>
                <th>FIGHTS</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((fighter, index) => (
                <tr key={fighter.name}>
                  <td className="rank-cell">
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td>
                    <div className="table-fighter">
                      <i style={{ backgroundColor: fighter.color }} />
                      <strong>{fighter.name}</strong>
                      <span>{fighter.tagline}</span>
                    </div>
                  </td>
                  <td>{fighter.wins}</td>
                  <td>{fighter.losses}</td>
                  <td>{fighter.draws}</td>
                  <td>
                    <div className="table-rate">
                      <span>{fighter.winRate}%</span>
                      <i>
                        <b
                          style={{
                            width: `${fighter.winRate}%`,
                            backgroundColor: fighter.color,
                          }}
                        />
                      </i>
                    </div>
                  </td>
                  <td>{fighter.wins + fighter.losses + fighter.draws}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="section-footnote">
        HOUSE ROSTER ONLY <i /> RECORDS SHOWN IN SIMULATION
      </div>
    </main>
  );
}

function BattlesPage() {
  return (
    <main className="section-page">
      <div className="section-heading">
        <h1>BATTLE HISTORY</h1>
        <span>RECENT BOUTS</span>
      </div>
      <div className="data-panel table-panel">
        <div className="table-headline">
          <span>COMPLETED BATTLES</span>
          <span>SELECT A REPLAY</span>
        </div>
        <div className="table-scroll">
          <table className="arena-table battles-table">
            <thead>
              <tr>
                <th>DATE</th>
                <th>MATCHUP</th>
                <th>STATUS</th>
                <th>TICKS</th>
                <th>WINNER</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {recentBattles.map((battle) => (
                <tr key={battle.title}>
                  <td className="date-cell">{battle.date}</td>
                  <td>
                    <div className="table-fighter">
                      <strong>{battle.title}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="finished-badge">FINISHED</span>
                    {battle.exhibition && (
                      <span className="exhibition-badge">EXHIBITION</span>
                    )}
                  </td>
                  <td>{battle.ticks.replace(" TICKS", "")}</td>
                  <td className="winner-cell">{battle.winner}</td>
                  <td>
                    <Link
                      className="table-action"
                      to={`/?replay=${encodeURIComponent(battle.title)}`}
                    >
                      WATCH REPLAY <span>→</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="section-footnote">
        REPLAYS ARE SIMULATED · BETTING IS CLOSED
      </div>
    </main>
  );
}

function TreasuryPage({ onNotice }: { onNotice: (message: string) => void }) {
  const stats = [
    {
      label: "TREASURY BALANCE",
      value: "84.62",
      unit: "SOL",
      note: "+12.4% THIS MONTH",
    },
    {
      label: "FEES COLLECTED",
      value: "127.40",
      unit: "SOL",
      note: "FROM HIRE + BETS",
    },
    {
      label: "TOKENS BURNED",
      value: "1.82M",
      unit: "$TKN",
      note: "PERMANENTLY REMOVED",
    },
    {
      label: "BUYBACK ROUNDS",
      value: "12",
      unit: "ROUNDS",
      note: "LAST ROUND · JUN 16",
    },
  ];
  const rounds = [
    { date: "JUN 16, 2025", sol: "8.40", burned: "142,805", round: "#012" },
    { date: "JUN 09, 2025", sol: "6.25", burned: "119,420", round: "#011" },
    { date: "JUN 02, 2025", sol: "9.10", burned: "168,032", round: "#010" },
    { date: "MAY 26, 2025", sol: "5.80", burned: "104,610", round: "#009" },
  ];
  return (
    <main className="section-page treasury-page">
      <div className="section-heading">
        <h1>TREASURY</h1>
        <span>PUBLIC LEDGER · SIMULATION</span>
      </div>
      <div className="treasury-stats">
        {stats.map((stat) => (
          <article className="treasury-stat" key={stat.label}>
            <span>{stat.label}</span>
            <strong>
              {stat.value}
              <small>{stat.unit}</small>
            </strong>
            <i>{stat.note}</i>
          </article>
        ))}
      </div>
      <div className="treasury-banner">
        <div className="burn-emblem">
          <span>BURN</span>
        </div>
        <div>
          <strong>BUYBACK MACHINE</strong>
          <span>Platform fees route to scheduled $TKN buybacks and burns.</span>
        </div>
        <span className="machine-state">
          <i /> ACTIVE
        </span>
      </div>
      <div className="data-panel table-panel">
        <div className="table-headline">
          <span>BURN HISTORY</span>
          <span>ON-CHAIN ACTIVITY</span>
        </div>
        <div className="table-scroll">
          <table className="arena-table treasury-table">
            <thead>
              <tr>
                <th>ROUND / DATE</th>
                <th>SOL SPENT</th>
                <th>TOKENS BURNED</th>
                <th>BUY TX</th>
                <th>BURN TX</th>
              </tr>
            </thead>
            <tbody>
              {rounds.map((round) => (
                <tr key={round.round}>
                  <td>
                    <strong className="round-id">{round.round}</strong>
                    <span className="date-cell">{round.date}</span>
                  </td>
                  <td>{round.sol} SOL</td>
                  <td className="burn-value">{round.burned} $TKN</td>
                  <td>
                    <button
                      className="tx-action"
                      onClick={() =>
                        onNotice(
                          "Explorer links are not configured in simulation.",
                        )
                      }
                    >
                      VIEW TX ↗
                    </button>
                  </td>
                  <td>
                    <button
                      className="tx-action"
                      onClick={() =>
                        onNotice(
                          "Explorer links are not configured in simulation.",
                        )
                      }
                    >
                      VIEW TX ↗
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="section-footnote">
        ALL VALUES ARE SAMPLE DATA · TOKEN USE IS NOT REQUIRED TO FIGHT OR BET
      </div>
    </main>
  );
}

function AdminPage({ onNotice }: { onNotice: (message: string) => void }) {
  const [settings, setSettings] = useState({
    hireFee: "0.50",
    houseCut: "5",
    minBet: "0.05",
    maxBet: "25",
    duration: "2400",
    interval: "6",
  });
  const [project, setProject] = useState({
    name: "ARENA-PROJECT",
    ticker: "TKN",
    mint: "",
  });
  const [fighterName, setFighterName] = useState("IRON-1");
  const [fighterLabel, setFighterLabel] = useState("IRON-1");
  const [buybacksPaused, setBuybacksPaused] = useState(false);

  const setSetting = (key: keyof typeof settings, value: string) =>
    setSettings((current) => ({ ...current, [key]: value }));
  const setProjectValue = (key: keyof typeof project, value: string) =>
    setProject((current) => ({ ...current, [key]: value }));
  return (
    <main className="section-page admin-page">
      <div className="section-heading">
        <h1>ADMIN CONTROL</h1>
        <span className="private-badge">ADMIN PREVIEW · DESKTOP</span>
      </div>
      <div className="admin-grid">
        <section className="admin-group">
          <div className="admin-group-head">
            <h2>ECONOMICS</h2>
            <span>01</span>
          </div>
          <label className="admin-field">
            <span>
              Hire fee <i>SOL</i>
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={settings.hireFee}
              onChange={(event) => setSetting("hireFee", event.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>
              House cut <i>%</i>
            </span>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.houseCut}
              onChange={(event) => setSetting("houseCut", event.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>
              Minimum bet <i>SOL</i>
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={settings.minBet}
              onChange={(event) => setSetting("minBet", event.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>
              Maximum bet <i>SOL</i>
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={settings.maxBet}
              onChange={(event) => setSetting("maxBet", event.target.value)}
            />
          </label>
        </section>
        <section className="admin-group">
          <div className="admin-group-head">
            <h2>FIGHT ENGINE</h2>
            <span>02</span>
          </div>
          <label className="admin-field">
            <span>
              Fight duration <i>TICKS</i>
            </span>
            <input
              type="number"
              min="1"
              value={settings.duration}
              onChange={(event) => setSetting("duration", event.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>
              Buyback interval <i>HOURS</i>
            </span>
            <input
              type="number"
              min="1"
              value={settings.interval}
              onChange={(event) => setSetting("interval", event.target.value)}
            />
          </label>
          <div className="admin-subhead">FIGHTER REBRANDING</div>
          <label className="admin-field">
            <span>House fighter</span>
            <select
              value={fighterName}
              onChange={(event) => {
                setFighterName(event.target.value);
                setFighterLabel(event.target.value);
              }}
            >
              {fighters.map((fighter) => (
                <option key={fighter.name}>{fighter.name}</option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>Display name</span>
            <input
              value={fighterLabel}
              onChange={(event) => setFighterLabel(event.target.value)}
            />
          </label>
        </section>
        <section className="admin-group">
          <div className="admin-group-head">
            <h2>PROJECT IDENTITY</h2>
            <span>03</span>
          </div>
          <label className="admin-field">
            <span>Project name</span>
            <input
              value={project.name}
              onChange={(event) => setProjectValue("name", event.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>Token ticker</span>
            <input
              value={project.ticker}
              onChange={(event) =>
                setProjectValue("ticker", event.target.value)
              }
            />
          </label>
          <label className="admin-field">
            <span>Token mint</span>
            <input
              value={project.mint}
              onChange={(event) => setProjectValue("mint", event.target.value)}
              placeholder="Not configured"
            />
          </label>
          <div className="admin-subhead">PRIVATE OPERATIONS</div>
          <label className="admin-pause">
            <span>
              <strong>Pause buybacks</strong>
              <small>In-house control · never public</small>
            </span>
            <input
              type="checkbox"
              checked={buybacksPaused}
              onChange={(event) => setBuybacksPaused(event.target.checked)}
            />
          </label>
        </section>
      </div>
      <div className="admin-footer">
        <span>UNSAVED PREVIEW CHANGES</span>
        <button
          className="primary-action admin-save"
          onClick={() => onNotice("Admin settings saved in this preview only.")}
        >
          Save settings <span>→</span>
        </button>
      </div>
      <div className="section-footnote">
        PREVIEW ONLY · NOT ACCESS-CONTROLLED OR PERSISTED
      </div>
    </main>
  );
}
