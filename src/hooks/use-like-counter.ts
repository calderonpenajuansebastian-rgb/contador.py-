import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  CounterState,
  EMPTY_STATE,
  HISTORY_LIMIT,
  LikeAction,
  LikeEntry,
  createId,
} from "@/constants/likes";

const STORAGE_KEY = "likelab:mobile:v2";

type PersistedState = CounterState & { updatedAt?: string };

function sanitizeState(raw: string | null): CounterState | null {
  if (!raw) return null;

  try {
    const data = JSON.parse(raw) as PersistedState;
    if (!data || typeof data !== "object") return null;

    const likes = Number.isFinite(Number(data.likes))
      ? Math.min(999999, Math.max(0, Math.trunc(Number(data.likes))))
      : 0;

    const maxLikes = Number.isFinite(Number(data.maxLikes))
      ? Math.min(999999, Math.max(likes, Math.trunc(Number(data.maxLikes))))
      : likes;

    const history = Array.isArray(data.history)
      ? data.history
          .filter((entry): entry is LikeEntry => {
            if (!entry || typeof entry !== "object") return false;
            if (entry.type !== "like" && entry.type !== "unlike") return false;
            if (!Number.isFinite(Number(entry.value))) return false;
            return Boolean(entry.at) && !Number.isNaN(new Date(entry.at).getTime());
          })
          .map((entry) => ({
            id: String(entry.id ?? createId()),
            type: entry.type,
            value: Math.min(999999, Math.max(0, Math.trunc(Number(entry.value)))),
            at: new Date(entry.at).toISOString(),
          }))
          .slice(0, HISTORY_LIMIT)
      : [];

    return { likes, maxLikes, history };
  } catch {
    return null;
  }
}

export type UseLikeCounter = {
  likes: number;
  maxLikes: number;
  history: LikeEntry[];
  hydrated: boolean;
  lastLikeAt: string | null;
  addLike: () => void;
  removeLike: () => void;
  reset: () => void;
};

export function useLikeCounter(): UseLikeCounter {
  const [state, setState] = useState<CounterState>(EMPTY_STATE);
  const [hydrated, setHydrated] = useState(false);
  const interacted = useRef(false);

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (!active || interacted.current) return;
        const saved = sanitizeState(raw);
        if (saved) setState(saved);
      })
      .catch(() => {
        // Si el almacenamiento no está disponible, la app sigue funcionando en memoria.
      })
      .finally(() => {
        if (active) setHydrated(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...state, updatedAt: new Date().toISOString() })
    ).catch(() => {
      // Sin persistencia disponible: no interrumpimos la experiencia.
    });
  }, [state, hydrated]);

  const register = useCallback((type: LikeAction) => {
    interacted.current = true;

    setState((prev) => {
      const next = Math.max(0, prev.likes + (type === "like" ? 1 : -1));

      const entry: LikeEntry = {
        id: createId(),
        type,
        value: next,
        at: new Date().toISOString(),
      };

      return {
        likes: next,
        maxLikes: type === "like" ? Math.max(prev.maxLikes, next) : prev.maxLikes,
        history: [entry, ...prev.history].slice(0, HISTORY_LIMIT),
      };
    });
  }, []);

  const addLike = useCallback(() => {
    register("like");
  }, [register]);

  const removeLike = useCallback(() => {
    register("unlike");
  }, [register]);

  const reset = useCallback(() => {
    interacted.current = true;
    setState(EMPTY_STATE);
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {
      // Ignorado intencionalmente.
    });
  }, []);

  const lastLike = state.history.find((entry) => entry.type === "like");

  return {
    likes: state.likes,
    maxLikes: state.maxLikes,
    history: state.history,
    hydrated,
    lastLikeAt: lastLike ? lastLike.at : null,
    addLike,
    removeLike,
    reset,
  };
}
