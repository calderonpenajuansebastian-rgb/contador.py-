import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HeartBurst } from "@/components/counter/heart-burst";
import { StatCard } from "@/components/counter/stat-card";
import {
  LikeAction,
  formatDay,
  formatNumber,
  formatShortTime,
  formatTime,
  getGoal,
  getLevel,
  getMessage,
  getMilestoneMessage,
  palette,
} from "@/constants/likes";
import { useLikeCounter } from "@/hooks/use-like-counter";

type Filter = "all" | LikeAction;
type ToastState = { id: number; message: string; tone: "success" | "warning" };

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "like", label: "Likes" },
  { key: "unlike", label: "Restas" },
];

function tapFeedback(style = Haptics.ImpactFeedbackStyle.Light) {
  if (Platform.OS === "web") return;
  Haptics.impactAsync(style).catch(() => {
    // El dispositivo puede no tener motor háptico.
  });
}

export default function CounterScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const compact = width < 380;

  const { likes, maxLikes, history, hydrated, lastLikeAt, addLike, removeLike, reset } =
    useLikeCounter();

  const [filter, setFilter] = useState<Filter>("all");
  const [showAll, setShowAll] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [burstKey, setBurstKey] = useState(0);

  const counterScale = useRef(new Animated.Value(1)).current;
  const counterShake = useRef(new Animated.Value(0)).current;
  const likeScale = useRef(new Animated.Value(1)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (message: string, tone: ToastState["tone"] = "success") => {
      setToast({ id: Date.now(), message, tone });
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 3400);
    },
    []
  );

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const animateCounter = useCallback(() => {
    counterScale.stopAnimation();
    counterScale.setValue(1);
    Animated.sequence([
      Animated.spring(counterScale, {
        toValue: 1.08,
        speed: 45,
        bounciness: 10,
        useNativeDriver: true,
      }),
      Animated.spring(counterScale, {
        toValue: 1,
        speed: 26,
        bounciness: 12,
        useNativeDriver: true,
      }),
    ]).start();
  }, [counterScale]);

  const shakeCounter = useCallback(() => {
    counterShake.setValue(0);
    Animated.sequence([
      Animated.timing(counterShake, { toValue: 1, duration: 55, useNativeDriver: true }),
      Animated.timing(counterShake, { toValue: -1, duration: 55, useNativeDriver: true }),
      Animated.timing(counterShake, { toValue: 0.7, duration: 55, useNativeDriver: true }),
      Animated.timing(counterShake, { toValue: -0.5, duration: 55, useNativeDriver: true }),
      Animated.timing(counterShake, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start();
  }, [counterShake]);

  const handleLike = useCallback(() => {
    addLike();
    setBurstKey((key) => key + 1);
    animateCounter();
    tapFeedback();

    const milestone = getMilestoneMessage(likes + 1);
    if (milestone) showToast(milestone);
  }, [addLike, animateCounter, likes, showToast]);

  const handleRemove = useCallback(() => {
    if (likes <= 0) {
      showToast("El contador ya está en cero.", "warning");
      shakeCounter();
      tapFeedback(Haptics.ImpactFeedbackStyle.Heavy);
      return;
    }

    removeLike();
    animateCounter();
    tapFeedback();
  }, [animateCounter, likes, removeLike, shakeCounter, showToast]);

  const performReset = useCallback(() => {
    reset();
    setFilter("all");
    setShowAll(false);
    setBurstKey(0);
    animateCounter();
    showToast("Contador reiniciado. Nuevo comienzo.");
    tapFeedback(Haptics.ImpactFeedbackStyle.Medium);
  }, [animateCounter, reset, showToast]);

  const handleReset = useCallback(() => {
    if (likes === 0 && history.length === 0) {
      showToast("Todo está en cero. No hay nada que reiniciar.", "warning");
      return;
    }

    if (Platform.OS === "web") {
      const confirmed =
        typeof window !== "undefined" &&
        window.confirm("¿Reiniciar el contador y borrar todo el historial?");
      if (confirmed) performReset();
      return;
    }

    Alert.alert(
      "¿Reiniciar el contador?",
      "Se pondrán los likes en cero y se borrará todo el historial guardado. Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, reiniciar", style: "destructive", onPress: performReset },
      ]
    );
  }, [history.length, likes, performReset, showToast]);

  const filtered = useMemo(
    () => (filter === "all" ? history : history.filter((entry) => entry.type === filter)),
    [filter, history]
  );

  const visibleHistory = showAll ? filtered : filtered.slice(0, 6);
  const level = getLevel(likes);
  const goal = getGoal(likes);
  const message = getMessage(likes);
  const shakeX = counterShake.interpolate({ inputRange: [-1, 1], outputRange: [-8, 8] });

  const historySummary =
    history.length === 0
      ? "Todavía no hay actividad registrada."
      : filter === "all"
        ? `${history.length} ${history.length === 1 ? "registro guardado" : "registros guardados"} en este dispositivo.`
        : `Mostrando ${filtered.length} de ${history.length} registros.`;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#060912", "#0a1020", "#060912"]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.glowBlue} pointerEvents="none" />
      <View style={styles.glowViolet} pointerEvents="none" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 118 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.topbar}>
            <View style={styles.brandRow}>
              <LinearGradient
                colors={["#4f7cff", "#8b5cf6", "#b26bff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logo}>
                <Ionicons name="heart" size={21} color="#ffffff" />
              </LinearGradient>
              <View>
                <Text style={styles.brandName}>LikeLab</Text>
                <Text style={styles.brandTag}>CONTADOR DE LIKES</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.senaPill}>
                <Text style={styles.senaText}>SENA · ADSO</Text>
              </View>
              <View style={styles.savedPill}>
                <View style={styles.savedDot} />
                <Text style={styles.savedText}>{hydrated ? "Guardado" : "Cargando"}</Text>
              </View>
            </View>
          </View>

          <View style={styles.heroShadow}>
            <LinearGradient
              colors={["rgba(28, 39, 68, 0.96)", "rgba(10, 16, 32, 0.98)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hero}>
              <View style={styles.heroGlow} pointerEvents="none" />
              <View style={styles.heroGlowGreen} pointerEvents="none" />

              <View style={styles.eyebrowRow}>
                <View style={styles.eyebrowDot} />
                <Text style={styles.eyebrow}>DE LA WEB AL MÓVIL</Text>
              </View>

              <Text style={styles.title}>
                Cada like <Text style={styles.titleAccent}>cuenta.</Text>
              </Text>
              <Text style={styles.subtitle}>
                Un contador en tiempo real con historial, estadísticas y persistencia.
                Interactivo, accesible y listo para cualquier pantalla.
              </Text>

              <View style={styles.counterRow}>
                <LinearGradient
                  colors={["#4f7cff", "#8b5cf6", "#b26bff"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.heartBadge}>
                  <Ionicons name="heart" size={26} color="#ffffff" />
                </LinearGradient>

                <Animated.View
                  style={{ transform: [{ scale: counterScale }, { translateX: shakeX }] }}>
                  <Text
                    testID="counter-value"
                    style={[
                      styles.counterNumber,
                      compact && styles.counterNumberCompact,
                      likes >= 1000 && styles.counterNumberMini,
                    ]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    accessibilityLabel={`Cantidad de likes: ${likes}`}>
                    {formatNumber(likes)}
                  </Text>
                  <Text style={styles.counterCaption}>LIKES ACUMULADOS</Text>
                </Animated.View>

                {likes >= 10 ? (
                  <View style={styles.streak}>
                    <Ionicons name="flame" size={12} color="#ffb75e" />
                    <Text style={styles.streakText}>En racha</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.goalCard}>
                <View style={styles.goalHead}>
                  <View style={styles.goalLabelRow}>
                    <Ionicons name="sparkles" size={13} color={palette.amber} />
                    <Text style={styles.goalKicker}>PRÓXIMO HITO</Text>
                  </View>
                  <Text style={styles.goalTarget}>{goal.goal} likes</Text>
                </View>

                <View
                  style={styles.progressTrack}
                  accessibilityRole="progressbar"
                  accessibilityValue={{ min: 0, max: 100, now: goal.percent }}>
                  <LinearGradient
                    colors={["#4f7cff", "#9b6dff", "#2ee6a8"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressFill, { width: `${goal.progress}%` }]}
                  />
                </View>

                <View style={styles.goalMeta}>
                  <Text style={styles.goalHint}>
                    {likes === 0
                      ? "Te faltan 10 likes para el primer hito"
                      : goal.remaining === 10
                        ? "Hito superado. El siguiente reto ya está activo"
                        : `Te falta${goal.remaining === 1 ? "" : "n"} ${goal.remaining} like${
                            goal.remaining === 1 ? "" : "s"
                          } para llegar a ${goal.goal}`}
                  </Text>
                  <Text style={styles.goalPercent}>{goal.percent}%</Text>
                </View>
              </View>

              <Text style={[styles.message, !message && styles.messageHidden]}>
                {message || " "}
              </Text>

              <Pressable
                testID="like-button"
                accessibilityRole="button"
                accessibilityLabel="Dar un like"
                accessibilityHint="Incrementa el contador de likes"
                onPress={handleLike}
                onPressIn={() =>
                  Animated.spring(likeScale, {
                    toValue: 0.975,
                    speed: 50,
                    bounciness: 0,
                    useNativeDriver: true,
                  }).start()
                }
                onPressOut={() =>
                  Animated.spring(likeScale, {
                    toValue: 1,
                    speed: 24,
                    bounciness: 8,
                    useNativeDriver: true,
                  }).start()
                }>
                <Animated.View style={[styles.likeShadow, { transform: [{ scale: likeScale }] }]}>
                  <LinearGradient
                    colors={["#27e08c", "#14c9a4", "#22d3b8"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.likeButton}>
                    <View style={styles.likeIcon}>
                      <Ionicons name="heart" size={24} color="#04120d" />
                    </View>
                    <View style={styles.likeCopy}>
                      <Text style={styles.likeTitle}>Dar like</Text>
                      <Text style={styles.likeSubtitle}>Toca para sumar</Text>
                    </View>
                    <Ionicons name="add" size={22} color="rgba(4, 18, 13, 0.65)" />
                  </LinearGradient>
                </Animated.View>
              </Pressable>

              <View style={styles.secondaryRow}>
                <Pressable
                  testID="remove-button"
                  accessibilityRole="button"
                  accessibilityLabel="Quitar un like"
                  onPress={handleRemove}
                  style={({ pressed }) => [
                    styles.secondaryBtn,
                    styles.minusBtn,
                    pressed && styles.pressed,
                  ]}>
                  <Ionicons name="remove-circle-outline" size={16} color="#c9d6f5" />
                  <Text style={styles.minusText}>Quitar like</Text>
                </Pressable>

                <Pressable
                  testID="reset-button"
                  accessibilityRole="button"
                  accessibilityLabel="Reiniciar contador e historial"
                  onPress={handleReset}
                  style={({ pressed }) => [
                    styles.secondaryBtn,
                    styles.resetBtn,
                    pressed && styles.pressed,
                  ]}>
                  <Ionicons name="refresh-outline" size={16} color="#ffb4bf" />
                  <Text style={styles.resetText}>Reiniciar</Text>
                </Pressable>
              </View>

              <HeartBurst burstKey={burstKey} />
            </LinearGradient>
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.kicker}>EN VIVO</Text>
              <Text style={styles.h2}>Resumen</Text>
            </View>
            <View style={styles.liveDot} />
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              icon="pulse-outline"
              label="Clics totales"
              value={formatNumber(history.length)}
              tint={palette.blueSoft}
              tintBackground="rgba(79, 124, 255, 0.13)"
            />
            <StatCard
              icon="trending-up"
              label="Máximo alcanzado"
              value={formatNumber(maxLikes)}
              tint="#c1a3ff"
              tintBackground="rgba(155, 109, 255, 0.13)"
            />
            <StatCard
              icon="time-outline"
              label="Último like"
              value={lastLikeAt ? formatShortTime(lastLikeAt) : "—"}
              tint="#6ff0c8"
              tintBackground="rgba(46, 230, 168, 0.11)"
              compact
            />
            <StatCard
              icon="sparkles-outline"
              label="Nivel"
              value={level.label}
              tint={palette.amber}
              tintBackground="rgba(255, 200, 87, 0.11)"
              valueColor={level.tone}
              compact
            />
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons name="shield-checkmark-outline" size={17} color="#a9c0ff" />
            </View>
            <View style={styles.tipCopy}>
              <Text style={styles.tipTitle}>Tu progreso se guarda solo</Text>
              <Text style={styles.tipText}>
                Likes, historial y récord quedan almacenados en el dispositivo, incluso si
                cierras la aplicación.
              </Text>
            </View>
          </View>

          <View style={styles.historyCard}>
            <View style={styles.historyHeader}>
              <View style={styles.historyHeading}>
                <Text style={styles.kicker}>ACTIVIDAD</Text>
                <Text style={styles.h2}>Historial de clics</Text>
                <Text style={styles.historyCaption}>{historySummary}</Text>
              </View>
              <View style={styles.countPill}>
                <Text style={styles.countText}>{history.length}</Text>
              </View>
            </View>

            <View style={styles.filters}>
              {FILTERS.map((item) => {
                const active = filter === item.key;
                return (
                  <Pressable
                    key={item.key}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => {
                      setFilter(item.key);
                      setShowAll(false);
                    }}
                    style={[styles.filterBtn, active && styles.filterBtnActive]}>
                    <Text style={[styles.filterText, active && styles.filterTextActive]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {visibleHistory.length === 0 ? (
              <View style={styles.empty}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="heart-outline" size={22} color="#8fa9ff" />
                </View>
                <Text style={styles.emptyTitle}>Sin actividad todavía</Text>
                <Text style={styles.emptyText}>
                  {filter === "all"
                    ? "Pulsa «Dar like» y tu primer registro aparecerá aquí al instante."
                    : filter === "like"
                      ? "Aún no hay likes registrados. Pulsa «Dar like» para empezar."
                      : "No hay restas todavía. El historial está limpio."}
                </Text>
              </View>
            ) : (
              <View style={styles.historyList}>
                {visibleHistory.map((entry, index) => {
                  const isLike = entry.type === "like";
                  const last = index === visibleHistory.length - 1;
                  return (
                    <View
                      key={entry.id}
                      style={[styles.historyRow, last && styles.historyRowLast]}>
                      <View
                        style={[
                          styles.historyDot,
                          {
                            backgroundColor: isLike
                              ? "rgba(46, 230, 168, 0.10)"
                              : "rgba(255, 107, 125, 0.08)",
                            borderColor: isLike
                              ? "rgba(46, 230, 168, 0.16)"
                              : "rgba(255, 107, 125, 0.15)",
                          },
                        ]}>
                        <Ionicons
                          name={isLike ? "heart" : "remove"}
                          size={13}
                          color={isLike ? "#6ff0c8" : "#ffb0bb"}
                        />
                      </View>
                      <View style={styles.historyCopy}>
                        <Text style={styles.historyLabel}>
                          {isLike ? "Like registrado" : "Like retirado"}
                        </Text>
                        <Text style={styles.historyTime}>
                          {formatTime(entry.at)} · {formatDay(entry.at)}
                        </Text>
                      </View>
                      <Text style={styles.historyValue}>{formatNumber(entry.value)}</Text>
                    </View>
                  );
                })}
              </View>
            )}

            {filtered.length > 6 ? (
              <Pressable
                onPress={() => setShowAll((value) => !value)}
                style={styles.seeAllBtn}
                accessibilityRole="button">
                <Text style={styles.seeAllText}>
                  {showAll ? "Ver menos" : `Ver todo (${filtered.length})`}
                </Text>
                <Ionicons
                  name={showAll ? "chevron-up" : "chevron-down"}
                  size={13}
                  color="#a9bcff"
                />
              </Pressable>
            ) : null}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Proyecto académico <Text style={styles.footerStrong}>SENA</Text> · De la web al
              móvil
            </Text>
            <Text style={styles.footerText}>HTML, CSS y JS · React Native + Expo</Text>
          </View>
        </View>
      </ScrollView>

      {toast ? (
        <View pointerEvents="box-none" style={[styles.toastLayer, { bottom: insets.bottom + 104 }]}>
          <View
            key={toast.id}
            style={[
              styles.toast,
              toast.tone === "warning" ? styles.toastWarning : styles.toastSuccess,
            ]}
            accessibilityLiveRegion="polite">
            <View
              style={[
                styles.toastIcon,
                toast.tone === "warning" ? styles.toastIconWarning : styles.toastIconSuccess,
              ]}>
              <Ionicons
                name={toast.tone === "warning" ? "alert-circle" : "checkmark"}
                size={16}
                color={toast.tone === "warning" ? "#ffd98a" : "#6ff0c8"}
              />
            </View>
            <Text style={styles.toastText}>{toast.message}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  scrollView: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
  },
  content: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },
  glowBlue: {
    position: "absolute",
    width: 430,
    height: 430,
    borderRadius: 215,
    backgroundColor: "rgba(79, 124, 255, 0.13)",
    top: -210,
    left: -160,
  },
  glowViolet: {
    position: "absolute",
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: "rgba(155, 109, 255, 0.09)",
    top: 380,
    right: -190,
  },
  topbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 18,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: palette.blue,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  brandName: {
    color: palette.text,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  brandTag: {
    color: palette.mutedDim,
    fontSize: 8.5,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginTop: 1,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  senaPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(79, 124, 255, 0.26)",
    backgroundColor: "rgba(79, 124, 255, 0.10)",
  },
  senaText: {
    color: "#c9d6ff",
    fontSize: 8.5,
    fontWeight: "800",
    letterSpacing: 1,
  },
  savedPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  savedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.green,
  },
  savedText: {
    color: palette.muted,
    fontSize: 9.5,
    fontWeight: "600",
  },
  heroShadow: {
    borderRadius: 28,
    shadowColor: "#000000",
    shadowOpacity: 0.45,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 18 },
    elevation: 10,
  },
  hero: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: palette.border,
    padding: 20,
    overflow: "hidden",
  },
  heroGlow: {
    position: "absolute",
    width: 310,
    height: 310,
    borderRadius: 155,
    backgroundColor: "rgba(79, 124, 255, 0.16)",
    top: -140,
    right: -90,
  },
  heroGlowGreen: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "rgba(46, 230, 168, 0.07)",
    bottom: -100,
    left: -70,
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: palette.green,
  },
  eyebrow: {
    color: "#a9bcff",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.8,
  },
  title: {
    color: palette.text,
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1.5,
    lineHeight: 39,
    marginTop: 10,
  },
  titleAccent: {
    color: palette.blueSoft,
  },
  subtitle: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
    maxWidth: 420,
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    marginTop: 22,
    flexWrap: "wrap",
  },
  heartBadge: {
    width: 54,
    height: 54,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: palette.blue,
    shadowOpacity: 0.5,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  counterNumber: {
    color: "#e7eeff",
    fontSize: 70,
    fontWeight: "800",
    letterSpacing: -4,
    lineHeight: 74,
    fontVariant: ["tabular-nums"],
    textShadowColor: "rgba(110, 150, 255, 0.45)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 22,
  },
  counterNumberCompact: {
    fontSize: 60,
    lineHeight: 64,
  },
  counterNumberMini: {
    fontSize: 48,
    lineHeight: 54,
    letterSpacing: -2.5,
  },
  counterCaption: {
    color: palette.mutedDim,
    fontSize: 8.5,
    fontWeight: "700",
    letterSpacing: 1.7,
    marginTop: 1,
  },
  streak: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: "auto",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 168, 76, 0.25)",
    backgroundColor: "rgba(255, 168, 76, 0.09)",
  },
  streakText: {
    color: "#ffd6a1",
    fontSize: 9,
    fontWeight: "700",
  },
  goalCard: {
    marginTop: 22,
    backgroundColor: "rgba(255, 255, 255, 0.026)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 16,
    padding: 13,
  },
  goalHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  goalLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  goalKicker: {
    color: palette.muted,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.3,
  },
  goalTarget: {
    color: "#dbe4ff",
    fontSize: 10.5,
    fontWeight: "700",
  },
  progressTrack: {
    height: 7,
    borderRadius: 99,
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    overflow: "hidden",
    marginTop: 11,
  },
  progressFill: {
    height: "100%",
    borderRadius: 99,
  },
  goalMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 7,
  },
  goalHint: {
    color: palette.mutedDim,
    fontSize: 9,
    flex: 1,
  },
  goalPercent: {
    color: "#a9bcff",
    fontSize: 9,
    fontWeight: "600",
  },
  message: {
    color: palette.green,
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 16,
    marginTop: 10,
    minHeight: 17,
  },
  messageHidden: {
    opacity: 0,
  },
  likeShadow: {
    borderRadius: 18,
    marginTop: 10,
    shadowColor: palette.greenDeep,
    shadowOpacity: 0.42,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  likeButton: {
    minHeight: 66,
    borderRadius: 18,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  likeIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "rgba(3, 30, 22, 0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  likeCopy: {
    flex: 1,
  },
  likeTitle: {
    color: "#04120d",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  likeSubtitle: {
    color: "rgba(4, 18, 13, 0.62)",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 1,
  },
  secondaryRow: {
    flexDirection: "row",
    gap: 9,
    marginTop: 9,
  },
  secondaryBtn: {
    flex: 1,
    minHeight: 45,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  minusBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderColor: palette.border,
  },
  minusText: {
    color: "#d9e1f7",
    fontSize: 11,
    fontWeight: "700",
  },
  resetBtn: {
    backgroundColor: "rgba(255, 107, 125, 0.065)",
    borderColor: "rgba(255, 107, 125, 0.2)",
  },
  resetText: {
    color: "#ffb4bf",
    fontSize: 11,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.985 }],
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 12,
  },
  kicker: {
    color: "#8fa9ff",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.8,
  },
  h2: {
    color: palette.text,
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.6,
    marginTop: 2,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: palette.green,
    marginBottom: 6,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    marginTop: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(79, 124, 255, 0.18)",
    backgroundColor: "rgba(79, 124, 255, 0.07)",
  },
  tipIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "rgba(79, 124, 255, 0.14)",
    borderWidth: 1,
    borderColor: "rgba(79, 124, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  tipCopy: {
    flex: 1,
  },
  tipTitle: {
    color: palette.text,
    fontSize: 11.5,
    fontWeight: "700",
  },
  tipText: {
    color: palette.muted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 2,
  },
  historyCard: {
    marginTop: 14,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255, 255, 255, 0.028)",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  historyHeading: {
    flex: 1,
  },
  historyCaption: {
    color: palette.mutedDim,
    fontSize: 10,
    marginTop: 4,
    lineHeight: 14,
  },
  countPill: {
    minWidth: 30,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(79, 124, 255, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(79, 124, 255, 0.22)",
    alignItems: "center",
  },
  countText: {
    color: "#a9bcff",
    fontSize: 11,
    fontWeight: "800",
  },
  filters: {
    flexDirection: "row",
    gap: 4,
    marginTop: 14,
    padding: 3,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.028)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  filterBtn: {
    flex: 1,
    minHeight: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  filterBtnActive: {
    backgroundColor: "rgba(79, 124, 255, 0.18)",
  },
  filterText: {
    color: palette.muted,
    fontSize: 10.5,
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#eaf0ff",
  },
  historyList: {
    marginTop: 10,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.045)",
  },
  historyRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 2,
  },
  historyDot: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  historyCopy: {
    flex: 1,
    minWidth: 0,
  },
  historyLabel: {
    color: "#dae3f8",
    fontSize: 11.5,
    fontWeight: "600",
  },
  historyTime: {
    color: palette.mutedDim,
    fontSize: 9.5,
    marginTop: 2,
  },
  historyValue: {
    color: "#dfe7fb",
    fontSize: 12,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  empty: {
    alignItems: "center",
    paddingVertical: 26,
    paddingHorizontal: 14,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(79, 124, 255, 0.09)",
    borderWidth: 1,
    borderColor: "rgba(79, 124, 255, 0.16)",
    marginBottom: 8,
  },
  emptyTitle: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "700",
  },
  emptyText: {
    color: palette.mutedDim,
    fontSize: 10.5,
    lineHeight: 15,
    textAlign: "center",
    marginTop: 3,
    maxWidth: 280,
  },
  seeAllBtn: {
    marginTop: 10,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  seeAllText: {
    color: "#a9bcff",
    fontSize: 10,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: 22,
    gap: 4,
  },
  footerText: {
    color: palette.mutedDim,
    fontSize: 9,
    textAlign: "center",
  },
  footerStrong: {
    color: "#c9d6f5",
    fontWeight: "700",
  },
  toastLayer: {
    position: "absolute",
    left: 16,
    right: 16,
    alignItems: "center",
    zIndex: 30,
  },
  toast: {
    width: "100%",
    maxWidth: 500,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: "rgba(14, 23, 41, 0.97)",
    shadowColor: "#000000",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 15,
  },
  toastSuccess: {
    borderColor: "rgba(46, 230, 168, 0.3)",
  },
  toastWarning: {
    borderColor: "rgba(255, 200, 87, 0.32)",
  },
  toastIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  toastIconSuccess: {
    backgroundColor: "rgba(46, 230, 168, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(46, 230, 168, 0.2)",
  },
  toastIconWarning: {
    backgroundColor: "rgba(255, 200, 87, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(255, 200, 87, 0.2)",
  },
  toastText: {
    flex: 1,
    color: "#e8f0ff",
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 16,
  },
});
