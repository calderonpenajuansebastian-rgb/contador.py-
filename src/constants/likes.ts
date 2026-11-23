/**
 * LikeLab · Sistema de diseño y lógica compartida
 * Paleta, niveles, hitos y utilidades del contador.
 */

export const palette = {
  bg: "#060912",
  bgAlt: "#0a1020",
  panel: "#101827",
  panelSoft: "rgba(255, 255, 255, 0.035)",
  border: "rgba(148, 163, 184, 0.14)",
  borderSoft: "rgba(255, 255, 255, 0.06)",
  text: "#f1f5ff",
  muted: "#98a3ba",
  mutedDim: "#6f7b95",
  blue: "#4f7cff",
  blueSoft: "#7ea2ff",
  violet: "#9b6dff",
  green: "#2ee6a8",
  greenDeep: "#14b8a6",
  red: "#ff6b7d",
  amber: "#ffc857",
} as const;

export type LikeAction = "like" | "unlike";

export type LikeEntry = {
  id: string;
  type: LikeAction;
  value: number;
  at: string;
};

export type CounterState = {
  likes: number;
  maxLikes: number;
  history: LikeEntry[];
};

export const EMPTY_STATE: CounterState = {
  likes: 0,
  maxLikes: 0,
  history: [],
};

export const HISTORY_LIMIT = 60;

export type Level = {
  min: number;
  label: string;
  tone: string;
  text: string;
};

export const LEVELS: Level[] = [
  {
    min: 0,
    label: "Novato",
    tone: palette.muted,
    text: "Da tu primer like para empezar a subir de nivel.",
  },
  {
    min: 1,
    label: "Aprendiz",
    tone: palette.blueSoft,
    text: "Primer paso hecho. Llega a 10 likes para ser Popular.",
  },
  {
    min: 10,
    label: "Popular",
    tone: palette.green,
    text: "¡Ya eres popular! El siguiente reto: 25 likes.",
  },
  {
    min: 25,
    label: "Influencer",
    tone: "#c1a3ff",
    text: "25 likes superados. Apunta al modo Viral con 50.",
  },
  {
    min: 50,
    label: "Viral",
    tone: "#c1a3ff",
    text: "50 likes y subiendo. La meta final: 100.",
  },
  {
    min: 100,
    label: "Leyenda",
    tone: palette.amber,
    text: "100 likes. Nivel máximo alcanzado. ¡Increíble!",
  },
];

export function getLevel(likes: number): Level {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (likes >= level.min) current = level;
  }
  return current;
}

export function getMessage(likes: number): string {
  if (likes >= 100) return "¡Nivel leyenda! 100 likes y contando.";
  if (likes >= 50) return "¡Modo viral! Tu contador está imparable.";
  if (likes >= 25) return "¡Eres influencer! Más de 25 likes acumulados.";
  if (likes >= 10) return "¡Ya superaste los 10 likes! Sigue así.";
  if (likes >= 5) return "Vas tomando ritmo. ¡No te detengas!";
  if (likes > 0) return "¡Buen comienzo! Cada like suma.";
  return "";
}

export function getGoal(likes: number) {
  const start = Math.floor(likes / 10) * 10;
  const goal = start + 10;
  const remaining = goal - likes;
  const progress = likes === 0 ? 0 : ((likes - start) / 10) * 100;

  return {
    goal,
    remaining,
    progress,
    percent: Math.round(progress),
  };
}

export function getMilestoneMessage(likes: number): string | null {
  const messages: Record<number, string> = {
    10: "¡Primer hito! Llegaste a 10 likes.",
    25: "¡25 likes! Nivel influencer desbloqueado.",
    50: "¡50 likes! Modo viral activado.",
    100: "¡100 likes! Nivel leyenda alcanzado.",
  };

  if (messages[likes]) return messages[likes];
  if (likes > 0 && likes % 10 === 0) return `¡Hito de ${likes} likes! Sigue así.`;
  return null;
}

export function formatNumber(value: number): string {
  try {
    return new Intl.NumberFormat("es-CO").format(value);
  } catch {
    return String(value);
  }
}

export function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return "--:--";
  }
}

export function formatShortTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "--:--";
  }
}

export function formatDay(iso: string): string {
  try {
    const date = new Date(iso);
    const today = new Date();
    const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const diff = Math.round((startToday.getTime() - startDate.getTime()) / 86400000);

    if (diff === 0) return "Hoy";
    if (diff === 1) return "Ayer";
    return date.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
  } catch {
    return "";
  }
}

export function createId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}
