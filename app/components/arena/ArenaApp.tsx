import { signOut } from "@agent-native/core/client";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import {
  fighters,
  recentBattles,
  type Battle,
  type Fighter,
} from "./arena-data";
import { ArenaSections } from "./ArenaSections";

import "./arena.css";
import "./sections.css";

const navItems = [
  { label: "Arena", href: "/", key: "home" },
  { label: "Fighters", href: "/fighters", key: "fighters" },
  { label: "Leaderboard", href: "/leaderboard", key: "leaderboard" },
  { label: "Battles", href: "/battles", key: "battles" },
  { label: "Treasury", href: "/treasury", key: "treasury" },
  { label: "Admin", href: "/admin", key: "admin" },
];

export function ArenaApp({
  section = "home",
  initialBattle,
}: {
  section?: string;
  initialBattle?: Battle;
}) {
  const [walletPreview, setWalletPreview] = useState(false);
  const [panel, setPanel] = useState<"bet" | "hire">("bet");
  const [selectedFighter, setSelectedFighter] = useState("IRON-1");
  const [selectedBet, setSelectedBet] = useState("IRON-1");
  const [amount, setAmount] = useState("0.25");
  const [message, setMessage] = useState("");
  const [replay, setReplay] = useState(Boolean(initialBattle));
  const [replayWinner, setReplayWinner] = useState(
    initialBattle?.winner ?? "WASP-6",
  );
  const [matchup, setMatchup] = useState<Fighter[]>(
    initialBattle
      ? initialBattle.fighters.map(
          (name) => fighters.find((fighter) => fighter.name === name)!,
        )
      : fighters.slice(0, 2),
  );
  const [activeExhibition, setActiveExhibition] = useState(
    initialBattle?.exhibition ?? false,
  );
  const [newBattleOpen, setNewBattleOpen] = useState(false);
  const [chosenFighters, setChosenFighters] = useState(["IRON-1", "HAWK-2"]);
  const [exhibition, setExhibition] = useState(true);
  const [seed, setSeed] = useState("");
  const [tick, setTick] = useState(1842);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const liveView = section === "home" || !section;
  const activeKey = liveView ? "home" : section;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (newBattleOpen && !dialog.open) dialog.showModal();
    if (!newBattleOpen && dialog.open) dialog.close();
  }, [newBattleOpen]);

  useEffect(() => {
    if (replay) return;
    const interval = window.setInterval(
      () => setTick((current) => current + 1),
      900,
    );
    return () => window.clearInterval(interval);
  }, [replay]);

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(""), 3200);
    return () => window.clearTimeout(timeout);
  }, [message]);

  const submitPreview = (action: "bet" | "hire") => {
    if (action === "bet" && (replay || activeExhibition)) {
      setMessage("Betting is unavailable for replays and exhibition fights.");
      return;
    }
    if (!walletPreview) {
      setMessage(
        "Connect the preview wallet first. No transaction will be sent.",
      );
      return;
    }
    setMessage(
      action === "bet"
        ? "Bet preview only — no SOL was sent."
        : "Hire preview only — no SOL was sent.",
    );
  };

  const toggleFighter = (name: string) => {
    setChosenFighters((current) => {
      if (current.includes(name)) {
        if (current.length <= 2) return current;
        return current.filter((fighter) => fighter !== name);
      }
      if (current.length >= 5) return current;
      return [...current, name];
    });
  };

  return (
    <div className="arena-app">
      <header className="site-header">
        <Link className="brand-lockup" to="/" aria-label="ARENA-PROJECT home">
          <span className="brand-mark">A</span>
          <span className="brand-name">
            ARENA<span>-PROJECT</span>
            <small>$TKN</small>
          </span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.href}
              className={`nav-link ${activeKey === item.key ? "is-active" : ""}`}
              aria-current={activeKey === item.key ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <span className="preview-flag">SIMULATION</span>
          {section === "admin" && (
            <button className="sign-out-button" onClick={() => signOut()}>
              Sign out
            </button>
          )}
          <button
            className={`wallet-button ${walletPreview ? "wallet-connected" : ""}`}
            onClick={() => setWalletPreview((value) => !value)}
          >
            <span className="wallet-dot" />
            {walletPreview ? "DEMO · 7xP…k2Qa" : "Connect wallet"}
          </button>
        </div>
      </header>

      {liveView ? (
        <main className="arena-layout">
          <section className="arena-main" aria-label="Live arena">
            <div className="fight-heading">
              <div className="fight-status">
                <span className={`live-pill ${replay ? "replay-pill" : ""}`}>
                  <i />
                  {replay ? "REPLAY" : "LIVE"}
                </span>
                <span className="exhibition-label">
                  {activeExhibition
                    ? "EXHIBITION · BETTING OFF"
                    : "STANDARD · BETTING OPEN"}
                </span>
              </div>
              <div className="fight-versus">
                {matchup.map((fighter, index) => (
                  <span className="fight-part" key={fighter.name}>
                    {index > 0 && <span className="versus-mark">VS</span>}
                    <span style={{ color: fighter.color }}>{fighter.name}</span>
                  </span>
                ))}
              </div>
              <div className="tick-readout">
                <span>TICK</span>
                <strong>{replay ? "2,410" : tick.toLocaleString()}</strong>
              </div>
            </div>

            <div className="canvas-frame">
              <ArenaCanvas replay={replay} matchFighters={matchup} />
              <div className="canvas-corner canvas-top-left">ARENA / 01</div>
              <div className="canvas-corner canvas-top-right">
                {replay ? "FINAL FRAME" : "SPECTATOR FEED"}
              </div>
              {replay && (
                <div className="winner-stamp">
                  <span>WINNER</span>
                  <strong>{replayWinner}</strong>
                </div>
              )}
              <div className="canvas-bottom-hud">
                {[matchup[0], matchup[matchup.length - 1]].map(
                  (fighter, index) => {
                    const hp = index === 0 ? 72 : 48;
                    return (
                      <div
                        className={`hud-fighter ${index === 1 ? "hud-fighter-right" : ""}`}
                        key={`${fighter.name}-${index}`}
                      >
                        <span className="hud-name">
                          <i
                            className="fighter-dot"
                            style={{ backgroundColor: fighter.color }}
                          />
                          {fighter.name}
                        </span>
                        <div className="health-track">
                          <span
                            className="health-fill"
                            style={{
                              width: `${hp}%`,
                              backgroundColor: fighter.color,
                            }}
                          />
                        </div>
                        <span className="health-value">{hp} HP</span>
                      </div>
                    );
                  },
                )}
                <div className="canvas-center-mark">
                  {replay ? "FINAL" : "ROUND 03"}
                </div>
              </div>
            </div>

            <div className="below-canvas">
              <div className="feed-block">
                <div className="micro-heading">
                  <span>COMBAT LOG</span>
                  <span className="feed-live">● STREAMING</span>
                </div>
                <div className="feed-row">
                  <time>
                    00:{String(Math.floor(tick % 60)).padStart(2, "0")}
                  </time>
                  <span>
                    <b style={{ color: matchup[0].color }}>{matchup[0].name}</b>{" "}
                    landed a heavy strike
                  </span>
                  <strong className="damage">−18 HP</strong>
                </div>
                <div className="feed-row">
                  <time>00:31</time>
                  <span>
                    <b style={{ color: matchup[1].color }}>{matchup[1].name}</b>{" "}
                    evaded incoming attack
                  </span>
                  <strong className="evade">DODGE</strong>
                </div>
                <div className="feed-row">
                  <time>00:26</time>
                  <span>
                    <b style={{ color: matchup[0].color }}>{matchup[0].name}</b>{" "}
                    closed distance
                  </span>
                  <strong className="neutral-event">MOVE</strong>
                </div>
              </div>
              <div className="ticker-strip" aria-label="Recent results">
                <span className="ticker-label">LATEST</span>
                <span>
                  WASP-6 <b>DEFEATED</b> JACKAL-5
                </span>
                <i />
                <span>
                  IRON-1 <b>DEFEATED</b> AEGIS-4
                </span>
                <i />
                <span>
                  HAWK-2 <b>DEFEATED</b> WASP-6
                </span>
              </div>
            </div>
          </section>

          <aside className="arena-rail" aria-label="Battle controls">
            <section className="rail-section battle-section">
              <div className="rail-heading">
                <h2>BATTLES</h2>
                <button
                  className="text-action"
                  onClick={() => setNewBattleOpen(true)}
                >
                  + NEW
                </button>
              </div>
              <div className="battle-list-label">
                LIVE NOW <span>01</span>
              </div>
              <button
                className={`battle-item ${!replay ? "selected" : ""}`}
                onClick={() => setReplay(false)}
              >
                <span className="battle-item-top">
                  <i className="status-orb" />
                  LIVE {activeExhibition && <small>EXHIBITION</small>}
                </span>
                <strong>
                  {matchup.map((fighter) => fighter.name).join(" vs ")}
                </strong>
                <span className="battle-item-meta">
                  TICK {tick.toLocaleString()} <span>·</span> 02:14
                </span>
              </button>
              <div className="battle-list-label recent-label">
                RECENT <span>02</span>
              </div>
              {recentBattles.slice(0, 2).map((battle) => (
                <button
                  key={battle.title}
                  className={`battle-item recent-item ${replay && matchup.map((fighter) => fighter.name).join(" vs ") === battle.title ? "selected" : ""}`}
                  onClick={() => {
                    setReplay(true);
                    setReplayWinner(battle.winner);
                    setActiveExhibition(battle.exhibition);
                    setMatchup(
                      battle.fighters.map(
                        (name) =>
                          fighters.find((fighter) => fighter.name === name)!,
                      ),
                    );
                  }}
                >
                  <span className="battle-item-top">
                    FINISHED{battle.exhibition && <small>EXHIBITION</small>}
                  </span>
                  <strong>{battle.title}</strong>
                  <span className="battle-item-meta">
                    {battle.result} <span>·</span> {battle.ticks}
                  </span>
                </button>
              ))}
            </section>

            <section className="rail-section trade-section">
              <div
                className="panel-tabs"
                role="tablist"
                aria-label="Arena actions"
              >
                <button
                  role="tab"
                  aria-selected={panel === "bet"}
                  className={panel === "bet" ? "tab-active" : ""}
                  onClick={() => setPanel("bet")}
                >
                  BET
                </button>
                <button
                  role="tab"
                  aria-selected={panel === "hire"}
                  className={panel === "hire" ? "tab-active" : ""}
                  onClick={() => setPanel("hire")}
                >
                  HIRE
                </button>
                <span className="pool-live">POOL LIVE</span>
              </div>
              {panel === "bet" ? (
                <div className="trade-content" role="tabpanel">
                  <div className="pool-total">
                    <span>POOL TOTAL</span>
                    <strong>
                      4.82 <small>SOL</small>
                    </strong>
                  </div>
                  <div className="pool-meta">
                    <span>28 bets</span>
                    <span>5% house cut</span>
                  </div>
                  <div className="odds-grid">
                    {matchup.map((fighter) => {
                      const probability = Math.floor(100 / matchup.length);
                      return (
                        <button
                          key={fighter.name}
                          className={`odds-button ${selectedBet === fighter.name ? "odds-selected" : ""}`}
                          onClick={() => setSelectedBet(fighter.name)}
                        >
                          <span style={{ color: fighter.color }}>
                            {fighter.name}
                          </span>
                          <strong>{(100 / probability).toFixed(2)}×</strong>
                          <small>{probability}% IMPLIED</small>
                        </button>
                      );
                    })}
                  </div>
                  <label className="field-label" htmlFor="bet-amount">
                    BET AMOUNT <span>SOL</span>
                  </label>
                  <div className="amount-field">
                    <input
                      id="bet-amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                    />
                    <button onClick={() => setAmount("1.00")}>MAX</button>
                  </div>
                  {replay || activeExhibition ? (
                    <div className="market-closed">
                      <strong>
                        {replay ? "FIGHT FINISHED" : "BETTING OFF"}
                      </strong>
                      <span>
                        {replay
                          ? "No open market on replays."
                          : "Exhibition fights are not bettable."}
                      </span>
                    </div>
                  ) : (
                    <button
                      className="primary-action"
                      onClick={() => submitPreview("bet")}
                    >
                      Place bet · {selectedBet} <span>→</span>
                    </button>
                  )}
                  <div className="transaction-note">
                    Preview only · no SOL will be sent
                  </div>
                </div>
              ) : (
                <div className="trade-content" role="tabpanel">
                  <label className="field-label" htmlFor="hire-fighter">
                    SELECT FIGHTER
                  </label>
                  <select
                    id="hire-fighter"
                    className="select-field"
                    value={selectedFighter}
                    onChange={(event) => setSelectedFighter(event.target.value)}
                  >
                    {fighters.map((fighter) => (
                      <option key={fighter.name} value={fighter.name}>
                        {fighter.name} · {fighter.tagline}
                      </option>
                    ))}
                  </select>
                  <div className="hire-summary">
                    <span>HIRE FEE</span>
                    <strong>0.50 SOL</strong>
                  </div>
                  <div className="hire-summary">
                    <span>WALLET</span>
                    <strong>
                      {walletPreview ? "7xP…k2Qa" : "Not connected"}
                    </strong>
                  </div>
                  <button
                    className="primary-action"
                    onClick={() => submitPreview("hire")}
                  >
                    Hire fighter <span>→</span>
                  </button>
                  <div className="transaction-note">
                    Preview only · no SOL will be sent
                  </div>
                </div>
              )}
            </section>
          </aside>
        </main>
      ) : (
        <main className="placeholder-page">
          <ArenaSections section={section} onNotice={setMessage} />
        </main>
      )}

      <dialog
        ref={dialogRef}
        className="new-battle-dialog"
        onCancel={(event) => {
          event.preventDefault();
          setNewBattleOpen(false);
        }}
        onClose={() => setNewBattleOpen(false)}
      >
        <div className="dialog-header">
          <div>
            <span className="dialog-kicker">ARENA CONTROL</span>
            <h2>New battle</h2>
          </div>
          <button
            className="close-dialog"
            onClick={() => setNewBattleOpen(false)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setMatchup(
              chosenFighters.map(
                (name) => fighters.find((fighter) => fighter.name === name)!,
              ),
            );
            setSelectedBet(chosenFighters[0]);
            setActiveExhibition(exhibition);
            setReplay(false);
            setTick(0);
            setPanel("bet");
            setMessage(
              `Simulation started · ${chosenFighters.join(" / ")}${seed ? ` · seed ${seed}` : ""}${exhibition ? " · betting off" : ""}`,
            );
            setNewBattleOpen(false);
          }}
        >
          <fieldset className="fighter-picker">
            <legend>
              FIGHTERS <span>CHOOSE 2–5</span>
            </legend>
            {fighters.map((fighter) => (
              <label key={fighter.name} className="fighter-option">
                <input
                  type="checkbox"
                  checked={chosenFighters.includes(fighter.name)}
                  onChange={() => toggleFighter(fighter.name)}
                />
                <i style={{ backgroundColor: fighter.color }} />
                <span>{fighter.name}</span>
                <small>{fighter.tagline}</small>
              </label>
            ))}
          </fieldset>
          <label className="field-label" htmlFor="battle-seed">
            SEED <span>OPTIONAL</span>
          </label>
          <input
            id="battle-seed"
            className="seed-field"
            value={seed}
            onChange={(event) => setSeed(event.target.value)}
            placeholder="Random"
          />
          <label className="exhibition-toggle">
            <span>
              <strong>Exhibition fight</strong>
              <small>Betting disabled</small>
            </span>
            <input
              type="checkbox"
              checked={exhibition}
              onChange={(event) => setExhibition(event.target.checked)}
            />
          </label>
          <button className="primary-action" type="submit">
            Create simulation <span>→</span>
          </button>
        </form>
      </dialog>
      {message && (
        <div className="toast-message" role="status" aria-live="polite">
          {message}
        </div>
      )}
      <footer className="site-footer">
        <span>ARENA-PROJECT</span>
        <span>SIMULATION MODE — NO REAL WALLETS OR TRANSACTIONS</span>
        <span>$TKN · SOLANA</span>
      </footer>
    </div>
  );
}

function ArenaCanvas({
  replay,
  matchFighters,
}: {
  replay: boolean;
  matchFighters: Fighter[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    let animation = 0;

    const render = (time: number) => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      const width = 1000;
      const height = 560;
      if (
        canvas.width !== Math.round(bounds.width * ratio) ||
        canvas.height !== Math.round(bounds.height * ratio)
      ) {
        canvas.width = Math.round(bounds.width * ratio);
        canvas.height = Math.round(bounds.height * ratio);
      }
      context.setTransform(
        canvas.width / width,
        0,
        0,
        canvas.height / height,
        0,
        0,
      );
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#090C09";
      context.fillRect(0, 0, width, height);

      const gradient = context.createRadialGradient(
        500,
        285,
        20,
        500,
        285,
        480,
      );
      gradient.addColorStop(0, "#121C12");
      gradient.addColorStop(1, "#090C09");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      context.strokeStyle = "rgba(182,255,46,0.075)";
      context.lineWidth = 1;
      for (let x = 40; x < width; x += 48) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = 30; y < height; y += 48) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }
      context.strokeStyle = "rgba(182,255,46,0.16)";
      context.setLineDash([5, 10]);
      context.beginPath();
      context.ellipse(500, 270, 350, 205, 0, 0, Math.PI * 2);
      context.stroke();
      context.setLineDash([]);
      context.strokeStyle = "rgba(182,255,46,0.12)";
      context.beginPath();
      context.arc(500, 270, 112, 0, Math.PI * 2);
      context.stroke();

      const drift = replay ? 0 : Math.sin(time / 580) * 7;
      const fightersOnCanvas = matchFighters.map((fighter, index) => {
        const angle =
          (Math.PI * 2 * index) / matchFighters.length - Math.PI / 2;
        return {
          x: 500 + Math.cos(angle) * 210 + (replay ? 0 : drift),
          y: 270 + Math.sin(angle) * 112 + Math.sin(time / 740 + index) * 5,
          color: fighter.color,
          label: String(index + 1).padStart(2, "0"),
          name: fighter.name,
        };
      });

      if (!replay) {
        const shotProgress = (time % 1800) / 1800;
        const shotX = 362 + shotProgress * 255;
        const shotY = 264 + Math.sin(shotProgress * Math.PI) * -42;
        const trail = context.createLinearGradient(
          shotX - 52,
          shotY,
          shotX + 2,
          shotY,
        );
        trail.addColorStop(0, "rgba(182,255,46,0)");
        trail.addColorStop(1, "rgba(182,255,46,0.75)");
        context.strokeStyle = trail;
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(shotX - 52, shotY);
        context.lineTo(shotX, shotY);
        context.stroke();
        context.fillStyle = "#D8FF8A";
        context.shadowColor = "#B6FF2E";
        context.shadowBlur = 18;
        context.beginPath();
        context.arc(shotX, shotY, 4, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
      }

      for (const fighter of fightersOnCanvas) {
        const pulse = replay ? 1 : 1 + Math.sin(time / 260) * 0.035;
        const radius = 36 * pulse;
        const halo = context.createRadialGradient(
          fighter.x,
          fighter.y,
          2,
          fighter.x,
          fighter.y,
          82,
        );
        halo.addColorStop(0, `${fighter.color}44`);
        halo.addColorStop(1, `${fighter.color}00`);
        context.fillStyle = halo;
        context.beginPath();
        context.arc(fighter.x, fighter.y, 82, 0, Math.PI * 2);
        context.fill();
        context.shadowColor = fighter.color;
        context.shadowBlur = 23;
        context.fillStyle = "#11170F";
        context.strokeStyle = fighter.color;
        context.lineWidth = 2.5;
        context.beginPath();
        context.arc(fighter.x, fighter.y, radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.shadowBlur = 0;
        context.fillStyle = fighter.color;
        context.font = "600 15px 'JetBrains Mono', monospace";
        context.textAlign = "center";
        context.fillText(fighter.label, fighter.x, fighter.y + 5);
        context.fillStyle = "rgba(242,245,240,0.85)";
        context.font = "600 11px 'JetBrains Mono', monospace";
        context.fillText(fighter.name, fighter.x, fighter.y + 63);
      }

      context.fillStyle = "rgba(182,255,46,0.5)";
      context.fillRect(64, 62, 28, 1);
      context.fillRect(64, 62, 1, 28);
      context.fillRect(908, 62, 28, 1);
      context.fillRect(935, 62, 1, 28);
      context.fillRect(64, 495, 28, 1);
      context.fillRect(64, 468, 1, 28);
      context.fillRect(908, 495, 28, 1);
      context.fillRect(935, 468, 1, 28);
      if (!replay) animation = window.requestAnimationFrame(render);
    };

    animation = window.requestAnimationFrame(render);
    const observer = new ResizeObserver(() => {
      if (!replay) {
        window.cancelAnimationFrame(animation);
        animation = window.requestAnimationFrame(render);
      }
    });
    observer.observe(canvas);
    return () => {
      window.cancelAnimationFrame(animation);
      observer.disconnect();
    };
  }, [replay]);

  return (
    <canvas
      ref={canvasRef}
      className="arena-canvas"
      role="img"
      aria-label={`${replay ? "Replay" : "Live simulated fight"}: ${matchFighters.map((fighter) => fighter.name).join(" versus ")}`}
    />
  );
}
