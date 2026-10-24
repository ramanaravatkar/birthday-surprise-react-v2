import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { LockKeyhole, Heart, RotateCcw, X, Sparkles, ChevronRight } from "lucide-react";
import "./styles.css";

function media(file) {
  return `/media/${file}`;
}

const CONFIG = {
  password: "Bava",
  hint: "what you will call to your ramana",
  firstPhotos: ["photo1.jpg", "photo2.jpg"].map(media),
  secondPhotos: ["photo3.jpg", "photo4.jpg", "photo5.jpg"].map(media),
  firstSong: media("song1.mp3"),
  secondSong: media("song2.mp3"),
  firstMessage: [
   "Happy birthday to the woman who makes my heart feel full." ,
"You deserve all the love, joy, and happiness in the world.",
"May your birthday be as beautiful as your soul." ,
"Another year, another reason to adore you even more.",
"You are my sweetest blessing and my greatest happiness.",
"Wishing you the happiest birthday, my love."
  ],
  secondMessage: [
   "Thank you for being my favorite person.",
"I love the life we’re building together.",
"You are my forever favorite chapter.",
"Every day with you is a gift I cherish.",
"You are my heart’s greatest treasure.",
"I’m so lucky to love you.",
    "I love you, today and always. ✨",
  ],
  backgrounds: {
    password: "lanterns",
    first: ["fireworks", "flowers"],
    second: "rockets",
  },
};

function App() {
  const [stage, setStage] = useState("landing");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [music, setMusic] = useState({ playing: false, track: null });
  const [fireworks, setFireworks] = useState(false);
  const audioRef = useRef(null);

  const flowers = useMemo(
    () =>
      Array.from({ length: 44 }, (_, i) => ({
        id: i,
        left: `${8 + Math.random() * 84}%`,
        top: `${12 + Math.random() * 31}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${4.5 + Math.random() * 4}s`,
        size: `${15 + Math.random() * 15}px`,
        drift: `${-90 + Math.random() * 180}px`,
      })),
    []
  );

  useEffect(() => setFireworks(stage === "landing" || stage === "finish"), [stage]);

  useEffect(() => {
    if (stage !== "first" && stage !== "second") return;

    const resume = () => {
      const a = audioRef.current;
      if (a && a.paused) {
        a.play()
          .then(() => setMusic((m) => ({ ...m, playing: true })))
          .catch(() => {});
      }
    };

    window.addEventListener("pointerdown", resume, { once: true });
    window.addEventListener("keydown", resume, { once: true });

    return () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
  }, [stage]);

  function enterSurprise() {
    setStage("password");
    setPassword("");
    setError("");
    setShowHint(false);
  }

  function submitPassword(e) {
    e.preventDefault();
    if (password.trim() === CONFIG.password) {
      setError("");
      setStage("first");
      window.scrollTo({ top: 0, behavior: "auto" });
      startTrack(CONFIG.firstSong);
    } else {
      setError("That password isn't quite right. Try again ❤️");
    }
  }

  function startTrack(src) {
    if (!src) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const a = new Audio(src);
    a.loop = true;
    a.volume = 0.62;
    audioRef.current = a;

    a.play()
      .then(() => setMusic({ playing: true, track: src }))
      .catch(() => setMusic({ playing: false, track: src }));
  }

  function goSecond() {
    startTrack(CONFIG.secondSong);
    setStage("second");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function finish() {
    audioRef.current?.pause();
    setMusic({ playing: false, track: null });
    setStage("finish");
    setFireworks(true);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function rewind() {
    audioRef.current?.pause();
    setMusic({ playing: false, track: null });
    setPassword("");
    setStage("password");
    setFireworks(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  return (
    <main className="app">
      <div className="ambient-glow glow-one" />
      <div className="ambient-glow glow-two" />

      {[].concat(CONFIG.backgrounds[stage] || []).map((t) => (
        <Background key={stage + t} type={t} />
      ))}

      {stage === "landing" && (
        <Landing flowers={flowers} onBlueFlower={enterSurprise} fireworks={fireworks} />
      )}

      {stage === "password" && (
        <PasswordScreen
          password={password}
          setPassword={setPassword}
          error={error}
          showHint={showHint}
          setShowHint={setShowHint}
          onSubmit={submitPassword}
        />
      )}

      {stage === "first" && (
        <MemorySection
          title="Happy Birthday, My Love ❤️"
          photos={CONFIG.firstPhotos}
          message={CONFIG.firstMessage}
          nextLabel="Next surprise"
          onNext={goSecond}
          variant="heart"
        />
      )}

      {stage === "second" && (
        <MemorySection
          title="A Few More Memories ✨"
          photos={CONFIG.secondPhotos}
          message={CONFIG.secondMessage}
          nextLabel="One last thing"
          onNext={finish}
          variant="rectangle"
        />
      )}

      {stage === "finish" && <FinishScreen fireworks={fireworks} onReplay={rewind} />}
    </main>
  );
}

function Background({ type }) {
  const items = useMemo(() => {
    const r = (a, b) => a + Math.random() * (b - a);

    if (type === "flowers") {
      return Array.from({ length: 34 }, (_, i) => ({
        id: i,
        e: ["🌸", "🌹", "🌷", "🌺", "🌼"][i % 5],
        x: `${r(0, 100)}%`,
        s: `${r(16, 34)}px`,
        d: `${r(8, 15)}s`,
        delay: `${-r(0, 15)}s`,
        drift: `${r(-120, 120)}px`,
        rot: `${r(300, 720)}deg`,
      }));
    }

    if (type === "rockets") {
      return Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: `${r(8, 92)}%`,
        rise: `${r(42, 72)}vh`,
        d: `${r(3.8, 6)}s`,
        delay: `${r(0, 5)}s`,
        c: ["#ffd36e", "#ff7a9c", "#7ec8ff", "#b99bff", "#8dffb0"][i % 5],
      }));
    }

    if (type === "lanterns") {
      return Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: `${r(3, 95)}%`,
        w: `${r(22, 44)}px`,
        d: `${r(14, 26)}s`,
        delay: `${-r(0, 24)}s`,
        drift: `${r(-80, 80)}px`,
      }));
    }

    return [];
  }, [type]);

  if (type === "fireworks") {
    return (
      <div className="bg-layer">
        <Fireworks count={30} />
      </div>
    );
  }

  return (
    <div className={`bg-layer bg-${type}`}>
      {type === "lanterns" && <div className="stars twinkle" />}
      {type === "flowers" &&
        items.map((f) => (
          <span
            key={f.id}
            className="bg-flower"
            style={{
              "--x": f.x,
              "--s": f.s,
              "--d": f.d,
              "--delay": f.delay,
              "--drift": f.drift,
              "--rot": f.rot,
            }}
          >
            {f.e}
          </span>
        ))}
      {type === "rockets" &&
        items.map((k) => (
          <React.Fragment key={k.id}>
            <span
              className="rocket"
              style={{
                "--x": k.x,
                "--rise": k.rise,
                "--d": k.d,
                "--delay": k.delay,
              }}
            >
              <span className="rocket-trail" />
              <span className="rocket-body">🚀</span>
            </span>

            <span
              className="rocket-burst"
              style={{
                "--x": k.x,
                "--rise": k.rise,
                "--d": k.d,
                "--delay": k.delay,
                "--c": k.c,
              }}
            >
              {Array.from({ length: 12 }).map((_, n) => (
                <i key={n} style={{ "--ray": n }} />
              ))}
            </span>
          </React.Fragment>
        ))}
      {type === "lanterns" &&
        items.map((l) => (
          <span
            key={l.id}
            className="lantern"
            style={{
              "--x": l.x,
              "--w": l.w,
              "--d": l.d,
              "--delay": l.delay,
              "--drift": l.drift,
            }}
          />
        ))}
    </div>
  );
}

function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function taper(p0, c, p1, w0, w1) {
  const L = [];
  const R = [];
  const n = 16;

  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const u = 1 - t;

    const x = u * u * p0[0] + 2 * u * t * c[0] + t * t * p1[0];
    const y = u * u * p0[1] + 2 * u * t * c[1] + t * t * p1[1];
    const dx = 2 * u * (c[0] - p0[0]) + 2 * t * (p1[0] - c[0]);
    const dy = 2 * u * (c[1] - p0[1]) + 2 * t * (p1[1] - c[1]);
    const len = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * t) / 2;

    L.push(`${(x - (dy / len) * w).toFixed(1)} ${(y + (dx / len) * w).toFixed(1)}`);
    R.push(`${(x + (dy / len) * w).toFixed(1)} ${(y - (dx / len) * w).toFixed(1)}`);
  }

  return "M" + L.join("L") + "L" + R.reverse().join("L") + "Z";
}

function TreeArt() {
  const t = useMemo(() => {
    const r = rng(11);
    const CX = 450;
    const CY = 232;
    const RX = 385;
    const RY = 168;

    const pick = (arr) => arr[Math.floor(r() * arr.length)];

    const spot = (k = 1) => {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r()) * k;
      return [CX + Math.cos(a) * d * RX, CY + Math.sin(a) * d * RY];
    };

    const lit = (x, y) => (CX - x) / RX + (CY - y) / RY;

    const dark = ["#0a1a0d", "#0e2211", "#12291a"];
    const mid = ["#1b3b1f", "#234c28", "#2b582d"];
    const light = ["#3b6832", "#4a7a3a", "#5d8b43", "#6f9a4c"];

    const base = Array.from({ length: 44 }, () => {
      const [x, y] = spot(0.95);
      return { x, y, r: 62 + r() * 42, c: pick(dark) };
    });

    const midL = Array.from({ length: 58 }, () => {
      const [x, y] = spot(0.92);
      return { x, y: y - 8, r: 40 + r() * 36, c: pick(mid) };
    });

    const lightL = [];
    while (lightL.length < 62) {
      const [x, y] = spot(0.9);
      if (lit(x, y) + (r() - 0.5) * 0.7 > 0.15) {
        lightL.push({ x, y: y - 14, r: 20 + r() * 28, c: pick(light) });
      }
    }

    const leaves = Array.from({ length: 300 }, () => {
      const [x, y] = spot(1);
      const l = lit(x, y);
      return {
        x,
        y,
        rx: 6 + r() * 6,
        ry: 3 + r() * 2.2,
        rot: r() * 180,
        c: l > 0.1 ? pick(light) : pick(mid),
        o: 0.45 + r() * 0.45,
      };
    });

    const glints = Array.from({ length: 36 }, () => {
      const [x, y] = spot(0.85);
      return { x, y, r: 5 + r() * 9, ok: lit(x, y) > 0.25 };
    }).filter((g) => g.ok);

    const branches = [
      [[415, 430], [400, 335], [250, 245], 36, 8],
      [[485, 420], [500, 325], [660, 240], 36, 8],
      [[430, 340], [420, 235], [340, 125], 26, 6],
      [[470, 340], [482, 235], [572, 118], 26, 6],
      [[418, 475], [362, 425], [275, 385], 24, 6],
      [[482, 465], [548, 415], [645, 375], 24, 6],
    ].map((b) => taper(...b));

    return { base, midL, lightL, leaves, glints, branches };
  }, []);

  return (
    <svg className="tree-svg" viewBox="0 0 900 720" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <defs>
        <linearGradient id="bark" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#1a0f08" />
          <stop offset=".25" stopColor="#5e3921" />
          <stop offset=".5" stopColor="#3a2113" />
          <stop offset=".78" stopColor="#6a4227" />
          <stop offset="1" stopColor="#190e07" />
        </linearGradient>

        <radialGradient id="ground" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#000" stopOpacity=".85" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>

        <filter id="leafy" x="-10%" y="-12%" width="120%" height="125%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      <ellipse cx="450" cy="706" rx="270" ry="22" fill="url(#ground)" />

      {t.branches.map((d, i) => (
        <path key={i} d={d} fill="url(#bark)" />
      ))}

      <path
        d="M345 708 C392 692 404 640 411 580 C417 520 419 470 417 420 C415 370 405 330 397 285 L503 285 C495 330 485 370 483 420 C481 470 483 520 489 580 C496 640 508 692 555 708 Z"
        fill="url(#bark)"
      />

      <g fill="none" strokeLinecap="round">
        <path d="M432 704 C435 620 430 520 432 410" stroke="rgba(0,0,0,.4)" strokeWidth="2.4" strokeDasharray="60 16 120 22 70 30" />
        <path d="M458 704 C459 600 454 500 456 400" stroke="rgba(0,0,0,.32)" strokeWidth="2" strokeDasharray="90 18 50 26 110 20" />
        <path d="M481 704 C477 620 472 520 470 420" stroke="rgba(0,0,0,.4)" strokeWidth="2.4" strokeDasharray="70 20 100 18 60 30" />
        <path d="M422 700 C424 620 421 520 422 420" stroke="rgba(255,200,140,.2)" strokeWidth="3" strokeDasharray="80 24 60 30" />
      </g>

      <g className="canopy-sway">
        <g filter="url(#leafy)">
          {t.base.map((c, i) => (
            <circle key={"b" + i} cx={c.x} cy={c.y} r={c.r} fill={c.c} />
          ))}
          {t.midL.map((c, i) => (
            <circle key={"m" + i} cx={c.x} cy={c.y} r={c.r} fill={c.c} />
          ))}
          {t.lightL.map((c, i) => (
            <circle key={"l" + i} cx={c.x} cy={c.y} r={c.r} fill={c.c} opacity=".92" />
          ))}
        </g>

        {t.leaves.map((l, i) => (
          <ellipse
            key={"f" + i}
            cx={l.x}
            cy={l.y}
            rx={l.rx}
            ry={l.ry}
            fill={l.c}
            opacity={l.o}
            transform={`rotate(${l.rot} ${l.x} ${l.y})`}
          />
        ))}

        {t.glints.map((g, i) => (
          <circle key={"g" + i} cx={g.x} cy={g.y} r={g.r} fill="#a9c96a" opacity=".16" />
        ))}
      </g>
    </svg>
  );
}

function BlueRose() {
  return (
    <svg className="blue-rose-svg" viewBox="0 0 64 86" width="54" height="72" aria-hidden="true">
      <defs>
        <radialGradient id="roseBloom" cx=".4" cy=".35" r=".8">
          <stop offset="0" stopColor="#9fd2ff" />
          <stop offset=".55" stopColor="#3f8cf0" />
          <stop offset="1" stopColor="#1c4fb8" />
        </radialGradient>
      </defs>

      <path d="M32 48 C33 60 30 70 31 84" stroke="#2f7a45" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M31 66 C20 66 14 60 13 54 C22 54 29 58 31 66Z" fill="#3b9a58" />
      <path d="M32 60 C42 58 48 52 49 46 C40 46 34 50 32 60Z" fill="#2f8449" />
      <path
        d="M9 27 C6 11 21 3 32 6 C45 3 59 12 55 29 C53 43 42 52 32 52 C21 52 11 43 9 27Z"
        fill="url(#roseBloom)"
        stroke="#1b4aa8"
        strokeWidth=".8"
      />
      <path
        d="M15 25 C17 14 28 9 32 12 C39 9 49 16 49 26 C47 37 40 44 32 44 C24 44 17 36 15 25Z"
        fill="#7bbcff"
        stroke="#2a68d0"
        strokeWidth=".7"
        opacity=".9"
      />
      <path
        d="M22 25 C22 18 29 14 34 16 C41 18 43 26 39 31 C35 35 27 34 25 28"
        fill="none"
        stroke="#2a62c8"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M29 24 C30 21 34 21 36 24 C37 28 32 29 30 27"
        fill="none"
        stroke="#2a62c8"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <ellipse cx="22" cy="18" rx="7" ry="3.2" fill="#fff" opacity=".35" transform="rotate(-25 22 18)" />
    </svg>
  );
}

function Landing({ flowers, onBlueFlower, fireworks }) {
  return (
    <section className="landing page">
      <div className="stars" />
      <div className="landing-title">
        <div className="eyebrow">
          <Sparkles size={13} /> JUST FOR YOU <Sparkles size={13} />
        </div>
        <p className="landing-subtitle">A little birthday surprise</p>
      </div>

      <div className="realistic-tree">
        <TreeArt />
        {flowers.map((f) => (
          <span
            key={f.id}
            className="falling-rose"
            style={{
              "--left": f.left,
              "--top": f.top,
              "--delay": f.delay,
              "--duration": f.duration,
              "--size": f.size,
              "--drift": f.drift,
            }}
          >
            🌹
          </span>
        ))}

        <button className="blue-rose" onClick={onBlueFlower} aria-label="Tap the blue rose">
          <BlueRose />
          <span className="blue-label">TAP THE BLUE ROSE</span>
          <span className="blue-glow" />
        </button>
      </div>

      <div className="landing-bottom">
        <span>Watch the roses fall...</span>
        <span className="tiny-heart">♥</span>
      </div>

      {fireworks && <Fireworks count={34} />}
    </section>
  );
}

function PasswordScreen({ password, setPassword, error, showHint, setShowHint, onSubmit }) {
  return (
    <section className="page centered">
      <div className="password-card glass">
        <div className="lock-orb">
          <LockKeyhole size={27} />
        </div>

        <p className="eyebrow">A secret just for you</p>

        <h2>
          Please enter the password
          <br />
          to open 💌
        </h2>

        <form onSubmit={onSubmit}>
          <input
            autoFocus
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <button className="gold-button" type="submit">
            Open my surprise <Heart size={17} fill="currentColor" />
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        <button className="hint-button" onClick={() => setShowHint((v) => !v)}>
          {showHint ? "Hide hint" : "Need a hint?"}
        </button>

        {showHint && <div className="hint">“{CONFIG.hint}”</div>}
      </div>
    </section>
  );
}

function MemorySection({ title, photos, message, nextLabel, onNext, variant }) {
  return (
    <section className="page memory-page">
      <button className="top-next" onClick={onNext}>
        {nextLabel}
        <ChevronRight size={16} />
      </button>

      <div className="memory-header">
        <p className="eyebrow">
          <Heart size={12} fill="currentColor" /> Made with love
        </p>
        <h2>{title}</h2>
      </div>

      <div className={`memory-layout ${variant}`}>
        {variant === "heart" ? (
          <div className="heart-frame">
            <div className="heart-backdrop" />
            <div className="heart-photos">
              <img src={photos[0]} alt="Memory 1" onError={fallbackImage} />
              <img src={photos[1]} alt="Memory 2" onError={fallbackImage} />
            </div>
            <div className="floating-heart h1">♥</div>
            <div className="floating-heart h2">♥</div>
          </div>
        ) : (
          <div className="photo-grid">
            {photos.map((p, i) => (
              <img key={p} src={p} alt={`Memory ${i + 1}`} onError={fallbackImage} />
            ))}
          </div>
        )}

        <div className="message-card glass">
          <div className="mini-heart">♥</div>
          <div className="message-lines">
            {Array.isArray(message) ? (
              message.map((line, i) => <p key={i}>{line}</p>)
            ) : (
              <p>{message}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinishScreen({ fireworks, onReplay }) {
  return (
    <section className="page centered finish">
      {fireworks && <Fireworks count={44} />}
      <div className="finish-card">
        <div className="big-heart">♥</div>
        <p className="eyebrow">Until the next time ✨</p>
        <h2>
          Thanks for watching
          <br />
          <em>my little surprise.</em>
        </h2>
        <p className="finish-text">I hope this little corner of the internet made you smile. ❤️</p>

        <button className="gold-button" onClick={onReplay}>
          <RotateCcw size={17} /> Re-watch
        </button>

        <p className="close-note">
          <X size={14} /> Close whenever you're ready.
        </p>
      </div>
    </section>
  );
}

function Fireworks({ count = 34 }) {
  const bursts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${8 + Math.random() * 84}%`,
        top: `${8 + Math.random() * 70}%`,
        delay: `${Math.random() * 2.8}s`,
        scale: `${0.55 + Math.random() * 0.9}`,
      })),
    [count]
  );

  return (
    <div className="fireworks">
      {bursts.map((b) => (
        <span
          key={b.id}
          className="firework"
          style={{
            "--x": b.left,
            "--y": b.top,
            "--delay": b.delay,
            "--scale": b.scale,
          }}
        >
          {Array.from({ length: 14 }).map((_, r) => (
            <i key={r} style={{ "--ray": r }} />
          ))}
        </span>
      ))}
    </div>
  );
}

function fallbackImage(e) {
  e.currentTarget.src =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="100%" height="100%" fill="#111"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#d7b66a" font-family="Georgia" font-size="34">${e.currentTarget.alt || "Your photo"}</text></svg>`
    );
}

createRoot(document.getElementById("root")).render(<App />);