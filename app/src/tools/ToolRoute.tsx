import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppNavigate } from "../lib/nav";
import { Button } from "../components/Button/Button";
import { audioUrl, fetchRandomContent, type Content } from "../lib/contents";
import { TOOLS, type ToolKey } from "../profile/personalization";
import { useProfile } from "../profile/profile";
import styles from "./Tools.module.css";

const JOKES = [
  "Pourquoi la cigarette ne fait-elle jamais de sport ?\nParce qu’elle s’essouffle avant la fin.",
  "Que dit un paquet de cigarettes abandonné ?\n« Je me sens consumé par le chagrin. »",
  "Pourquoi le briquet a-t-il déprimé ?\nIl a perdu sa flamme.",
  "C’est l’histoire d’un fumeur qui arrête.\nTout le monde a retenu son souffle. Lui, enfin, plus besoin.",
  "Quel est le comble pour un cendrier ?\nPartir à la retraite faute de travail.",
];

const BUBBLE_COLORS = [
  "var(--game-progress-done)",
  "var(--game-level)",
  "var(--brand-secondary)",
  "var(--border-accent)",
];

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

const randomBubble = (id: number): Bubble => ({
  id,
  x: Math.random() * 78,
  y: Math.random() * 80,
  size: 36 + Math.random() * 44,
  color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
});

/**
 * Route plein écran d'un outil anti-envie (/outil/:toolKey), hors tab bar.
 * Chaque sortie passe par « Ça t'a aidé ? » : un tap = enregistré + retour,
 * c'est le signal qui réordonne la boîte à outils (doc 04).
 */
export const ToolRoute = () => {
  const { toolKey } = useParams();
  const [phase, setPhase] = useState<"tool" | "feedback">("tool");
  const key = (toolKey ?? "respirer") as ToolKey;
  if (!(key in TOOLS)) return <NotFound />;
  return phase === "tool" ? (
    <Tool toolKey={key} onExit={() => setPhase("feedback")} />
  ) : (
    <Feedback toolKey={key} />
  );
};

const NotFound = () => {
  const navigate = useAppNavigate();
  useEffect(() => {
    navigate("/");
  }, [navigate]);
  return null;
};

const Tool = ({ toolKey, onExit }: { toolKey: ToolKey; onExit: () => void }) => {
  switch (toolKey) {
    case "respirer":
      return <Respirer onExit={onExit} />;
    case "jeu":
      return <Jeu onExit={onExit} />;
    case "audio":
      return <Audio onExit={onExit} />;
    case "video":
      return <Video onExit={onExit} />;
    case "blague":
      return <Blague onExit={onExit} />;
    case "raisons":
      return <Raisons onExit={onExit} />;
  }
};

/** Gabarit commun : contenu centré + zone de sortie. */
const Shell = ({
  children,
  exitLabel,
  onExit,
  extra,
}: {
  children: React.ReactNode;
  exitLabel: string;
  onExit: () => void;
  extra?: React.ReactNode;
}) => (
  <div className={styles.screen}>
    <div className={styles.content}>{children}</div>
    <div className={styles.ctaZone}>
      {extra}
      <Button variant="ghost" onClick={onExit}>
        {exitLabel}
      </Button>
    </div>
  </div>
);

/* ---- Respiration guidée : auto-play, cycle 4-4-6, 3 minutes ---- */
const PHASES = [
  { label: "Inspire…", at: 0 },
  { label: "Bloque", at: 4 },
  { label: "Souffle…", at: 8 },
] as const;
const CYCLE = 14;
const BREATH_TOTAL = 180;

const Respirer = ({ onExit }: { onExit: () => void }) => {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (elapsed >= BREATH_TOTAL) onExit();
  }, [elapsed, onExit]);

  const inCycle = elapsed % CYCLE;
  const phase = [...PHASES].reverse().find((p) => inCycle >= p.at) ?? PHASES[0];
  const left = Math.max(0, BREATH_TOTAL - elapsed);
  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, "0");

  return (
    <Shell exitLabel="Arrêter, ça va mieux" onExit={onExit}>
      <p className={styles.eyebrow}>Respiration · 3 min</p>
      <div className={styles.breath} aria-hidden>
        <span className={styles.breathPhase}>{phase.label}</span>
      </div>
      <p className={styles.helper} aria-live="polite">
        {phase.label === "Inspire…"
          ? "Par le nez, doucement."
          : phase.label === "Bloque"
            ? "Garde l’air un instant."
            : "Relâche tout, longuement."}
      </p>
      <p className={styles.caption}>
        Encore {mm}:{ss} · l’envie redescend avec ton souffle
      </p>
    </Shell>
  );
};

/* ---- Mini-jeu : éclate les bulles, 60 secondes ---- */
const GAME_TOTAL = 60;

const Jeu = ({ onExit }: { onExit: () => void }) => {
  const [bubbles, setBubbles] = useState<Bubble[]>(() =>
    Array.from({ length: 6 }, (_, i) => randomBubble(i)),
  );
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(GAME_TOTAL);
  const nextId = useRef(6);

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (left <= 0) onExit();
  }, [left, onExit]);

  const pop = (id: number) => {
    setScore((s) => s + 1);
    setBubbles((bs) =>
      bs.map((b) => (b.id === id ? randomBubble(nextId.current++) : b)),
    );
  };

  return (
    <Shell exitLabel="Ça va mieux, merci" onExit={onExit}>
      <p className={styles.eyebrow}>Mini-jeu · 60 secondes</p>
      <h1 className={styles.title}>Éclate tout.</h1>
      <div className={styles.scoreRow}>
        <span className={styles.chip}>Score {score}</span>
        <span className={`${styles.chip} ${styles.chipMuted}`}>
          0:{String(Math.max(0, left)).padStart(2, "0")}
        </span>
      </div>
      <div className={styles.playArea}>
        {bubbles.map((b) => (
          <button
            key={b.id}
            type="button"
            className={styles.bubble}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.size,
              height: b.size,
              background: b.color,
            }}
            aria-label="Éclater une bulle"
            onClick={() => pop(b.id)}
          />
        ))}
      </div>
      <p className={styles.caption}>
        Score personnel uniquement, jamais de classement.
      </p>
    </Shell>
  );
};

/* ---- Histoire audio : vrai lecteur depuis le catalogue (table contents) ---- */
const Audio = ({ onExit }: { onExit: () => void }) => {
  const [content, setContent] = useState<Content | null | undefined>(undefined);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    void fetchRandomContent("audio").then(setContent);
  }, []);

  if (content === null) return <AudioDemo onExit={onExit} />;

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  };

  return (
    <Shell
      exitLabel="Ça va mieux, merci"
      onExit={onExit}
      extra={
        content ? (
          <Button variant="secondary" onClick={toggle}>
            {playing ? "Mettre en pause" : "Écouter"}
          </Button>
        ) : undefined
      }
    >
      <p className={styles.eyebrow}>Histoire audio</p>
      <div className={styles.media}>
        <div className={styles.artwork} aria-hidden>
          🎧
        </div>
        <h1 className={styles.title}>{content ? content.title : "Chargement…"}</h1>
        {content?.description && <p className={styles.helper}>{content.description}</p>}
        {content && (
          <audio
            ref={audioRef}
            src={audioUrl(content.ref)}
            autoPlay
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={(e) => {
              // ne sortir que sur une vraie fin de lecture (garde contre le
              // « ended » immédiat de certains environnements sans audio)
              const el = e.currentTarget;
              if (el.duration > 1 && el.currentTime >= el.duration - 1.5) onExit();
            }}
          />
        )}
      </div>
    </Shell>
  );
};

/** Repli si le catalogue n'est pas configuré (pas de back). */
const AudioDemo = ({ onExit }: { onExit: () => void }) => (
  <Shell exitLabel="Ça va mieux, merci" onExit={onExit}>
    <p className={styles.eyebrow}>Histoire audio</p>
    <div className={styles.media}>
      <div className={styles.artwork} aria-hidden>
        🎧
      </div>
      <h1 className={styles.title}>Respire, on est là.</h1>
      <p className={styles.helper}>
        Ferme les yeux si tu veux. Le catalogue d’histoires se charge dès que
        tu es connecté.
      </p>
    </div>
  </Shell>
);

/* ---- Vidéo pédagogique : embed YouTube léger depuis le catalogue ---- */
const Video = ({ onExit }: { onExit: () => void }) => {
  const [content, setContent] = useState<Content | null | undefined>(undefined);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    void fetchRandomContent("video").then(setContent);
  }, []);

  if (content === null) return <VideoDemo onExit={onExit} />;

  return (
    <Shell exitLabel="Ça va mieux, merci" onExit={onExit}>
      <p className={styles.eyebrow}>Vidéo</p>
      <div className={styles.media}>
        {content ? (
          playing ? (
            <div className={styles.videoFrame}>
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${content.ref}?autoplay=1&rel=0`}
                title={content.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
          ) : (
            <button
              type="button"
              className={styles.videoFacade}
              style={{ backgroundImage: `url(https://i.ytimg.com/vi/${content.ref}/hqdefault.jpg)` }}
              aria-label={`Lire la vidéo : ${content.title}`}
              onClick={() => setPlaying(true)}
            >
              <span className={styles.playIcon} aria-hidden>
                ▶
              </span>
            </button>
          )
        ) : (
          <div className={styles.artwork} aria-hidden>
            🎬
          </div>
        )}
        <h1 className={styles.title}>{content ? content.title : "Chargement…"}</h1>
        {content?.source && (
          <p className={styles.caption}>{content.source} · YouTube</p>
        )}
      </div>
    </Shell>
  );
};

/** Repli si le catalogue n'est pas configuré (pas de back). */
const VideoDemo = ({ onExit }: { onExit: () => void }) => {
  const { state } = useProfile();
  const day = state.quitAt
    ? Math.max(1, Math.floor((Date.now() - new Date(state.quitAt).getTime()) / 86_400_000) + 1)
    : 1;
  return (
    <Shell exitLabel="Ça va mieux, merci" onExit={onExit}>
      <p className={styles.eyebrow}>Le savais-tu · jour {day}</p>
      <div className={styles.media}>
        <div className={styles.artwork} aria-hidden>
          🫀
        </div>
        <h1 className={styles.title}>Ton corps se répare, là, maintenant.</h1>
        <p className={styles.helper}>
          Ta tension et ton rythme cardiaque sont déjà redescendus. Ton odorat
          et ton goût reviennent. Les vidéos courtes se chargent dès que tu es
          connecté.
        </p>
      </div>
    </Shell>
  );
};

/* ---- Une blague : rupture d'état émotionnel ---- */
const Blague = ({ onExit }: { onExit: () => void }) => {
  const [i, setI] = useState(() => Math.floor(Math.random() * JOKES.length));
  return (
    <Shell
      exitLabel="Ça va mieux, merci"
      onExit={onExit}
      extra={
        <Button variant="primary" onClick={() => setI((n) => (n + 1) % JOKES.length)}>
          Une autre !
        </Button>
      }
    >
      <p className={styles.eyebrow}>Dopamine gratuite</p>
      <p className={styles.joke}>{JOKES[i]}</p>
      <p className={styles.caption}>Nulle ? Tant mieux : tu souris déjà.</p>
    </Shell>
  );
};

/* ---- Tes raisons : généré depuis le profil ---- */
const Raisons = ({ onExit }: { onExit: () => void }) => {
  const { state } = useProfile();
  return (
    <Shell exitLabel="Ça va mieux, merci" onExit={onExit}>
      <p className={styles.eyebrow}>Pourquoi tu fais ça</p>
      <h1 className={styles.title}>Tu le sais déjà.</h1>
      <div className={styles.panels}>
        <div className={styles.panel}>
          <p className={styles.panelTitle}>Ta santé</p>
          <p className={styles.panelText}>
            Ton souffle revient jour après jour. Chaque envie surmontée répare
            un peu plus.
          </p>
        </div>
        <div className={styles.panel}>
          <p className={styles.panelTitle}>Ta liberté</p>
          <p className={styles.panelText}>
            Plus personne ne décide de tes pauses. Ni le paquet, ni l’horloge.
          </p>
        </div>
        {state.answers.phrase && (
          <div className={styles.panel}>
            <p className={styles.quote}>« {state.answers.phrase} »</p>
            <p className={styles.panelText}>Toi, au jour 0.</p>
          </div>
        )}
      </div>
    </Shell>
  );
};

/* ---- « Ça t'a aidé ? » : un tap = enregistré + retour ---- */
const Feedback = ({ toolKey }: { toolKey: ToolKey }) => {
  const { recordToolFeedback } = useProfile();
  const navigate = useAppNavigate();
  const answer = (helped: "yes" | "some" | "no") => {
    recordToolFeedback(toolKey, helped);
    navigate("/");
  };
  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>Dis-nous</p>
        <h1 className={styles.title}>Ça t’a aidé ?</h1>
        <p className={styles.caption}>
          Ta réponse affine ta boîte à outils : ce qui marche pour toi remonte.
        </p>
      </div>
      <div className={styles.ctaZone}>
        <Button variant="primary" onClick={() => answer("yes")}>
          Oui, carrément
        </Button>
        <Button variant="secondary" onClick={() => answer("some")}>
          Un peu
        </Button>
        <Button variant="secondary" onClick={() => answer("no")}>
          Pas vraiment
        </Button>
        <Button variant="ghost" onClick={() => navigate("/")}>
          Passer
        </Button>
      </div>
    </div>
  );
};
