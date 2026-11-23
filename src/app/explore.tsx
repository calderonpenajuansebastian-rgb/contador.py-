import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ComponentProps } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { palette } from "@/constants/likes";

type Feature = {
  icon: ComponentProps<typeof Ionicons>["name"];
  title: string;
  description: string;
  tint: string;
  background: string;
};

const FEATURES: Feature[] = [
  {
    icon: "pulse-outline",
    title: "Contador en tiempo real",
    description: "Suma, resta y reinicia los likes con microanimaciones y respuesta inmediata.",
    tint: palette.blueSoft,
    background: "rgba(79, 124, 255, 0.12)",
  },
  {
    icon: "time-outline",
    title: "Historial de clics",
    description: "Cada acción queda registrada con su hora exacta y el valor del contador.",
    tint: "#6ff0c8",
    background: "rgba(46, 230, 168, 0.10)",
  },
  {
    icon: "trending-up",
    title: "Estadísticas y niveles",
    description: "Descubre tu récord, tus clics totales y el nivel que has desbloqueado.",
    tint: "#c1a3ff",
    background: "rgba(155, 109, 255, 0.12)",
  },
  {
    icon: "shield-checkmark-outline",
    title: "Persistencia local",
    description: "Tu progreso se guarda automáticamente y sobrevive al cierre de la app.",
    tint: palette.amber,
    background: "rgba(255, 200, 87, 0.10)",
  },
  {
    icon: "color-palette-outline",
    title: "Diseño responsive",
    description: "Interfaz oscura, elegante y adaptable a celulares, tablets y escritorio.",
    tint: "#ffb4bf",
    background: "rgba(255, 107, 125, 0.09)",
  },
];

const TECHNOLOGIES = ["HTML5", "CSS3", "JavaScript", "React Native", "Expo", "TypeScript"];

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

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
          { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 118 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
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

          <View style={styles.hero}>
            <View style={styles.heroGlow} pointerEvents="none" />
            <Text style={styles.kicker}>SOBRE EL PROYECTO</Text>
            <Text style={styles.title}>
              De la web <Text style={styles.titleAccent}>al móvil.</Text>
            </Text>
            <Text style={styles.subtitle}>
              LikeLab es una aplicación académica que demuestra cómo una misma idea puede
              construirse con tecnologías web y trasladarse al ecosistema móvil con React
              Native y Expo, conservando su esencia y mejorando la experiencia.
            </Text>

            <View style={styles.platformRow}>
              <View style={styles.platformChip}>
                <Ionicons name="globe-outline" size={14} color="#8fb0ff" />
                <Text style={styles.platformText}>Web</Text>
              </View>
              <View style={styles.platformChip}>
                <Ionicons name="phone-portrait-outline" size={14} color="#6ff0c8" />
                <Text style={styles.platformText}>Móvil</Text>
              </View>
              <View style={styles.platformChip}>
                <Ionicons name="layers-outline" size={14} color="#c1a3ff" />
                <Text style={styles.platformText}>Misma lógica</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.kicker, styles.sectionKicker]}>FUNCIONALIDADES</Text>
          <Text style={styles.sectionTitle}>Todo lo que incluye</Text>

          <View style={styles.featureList}>
            {FEATURES.map((feature) => (
              <View key={feature.title} style={styles.featureCard}>
                <View
                  style={[
                    styles.featureIcon,
                    { backgroundColor: feature.background, borderColor: `${feature.tint}33` },
                  ]}>
                  <Ionicons name={feature.icon} size={17} color={feature.tint} />
                </View>
                <View style={styles.featureCopy}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureText}>{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.techCard}>
            <Text style={styles.techTitle}>Tecnologías utilizadas</Text>
            <View style={styles.techRow}>
              {TECHNOLOGIES.map((tech) => (
                <View key={tech} style={styles.techChip}>
                  <Text style={styles.techText}>{tech}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.noteCard}>
            <Ionicons name="school-outline" size={20} color="#a9bcff" />
            <Text style={styles.noteText}>
              Proyecto académico <Text style={styles.noteStrong}>SENA</Text> · Programa ADSO.
              Ejercicio de interactividad con el DOM y desarrollo móvil.
            </Text>
          </View>

          <Text style={styles.footer}>LikeLab · 2026 · Hecho para aprender creando</Text>
        </View>
      </ScrollView>
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
    width: 420,
    height: 420,
    borderRadius: 210,
    backgroundColor: "rgba(79, 124, 255, 0.11)",
    top: -190,
    right: -150,
  },
  glowViolet: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "rgba(155, 109, 255, 0.08)",
    bottom: -120,
    left: -150,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 18,
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
  hero: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 20,
    overflow: "hidden",
  },
  heroGlow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(79, 124, 255, 0.14)",
    top: -120,
    right: -100,
  },
  kicker: {
    color: "#8fa9ff",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.8,
  },
  title: {
    color: palette.text,
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1.3,
    lineHeight: 39,
    marginTop: 9,
  },
  titleAccent: {
    color: palette.blueSoft,
  },
  subtitle: {
    color: palette.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },
  platformRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 16,
  },
  platformChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  platformText: {
    color: "#dbe4ff",
    fontSize: 9.5,
    fontWeight: "600",
  },
  sectionKicker: {
    marginTop: 24,
  },
  sectionTitle: {
    color: palette.text,
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.6,
    marginTop: 2,
    marginBottom: 12,
  },
  featureList: {
    gap: 9,
  },
  featureCard: {
    flexDirection: "row",
    gap: 11,
    padding: 14,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    backgroundColor: "rgba(255, 255, 255, 0.026)",
  },
  featureIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  featureCopy: {
    flex: 1,
  },
  featureTitle: {
    color: palette.text,
    fontSize: 12,
    fontWeight: "700",
  },
  featureText: {
    color: palette.muted,
    fontSize: 10.5,
    lineHeight: 16,
    marginTop: 2,
  },
  techCard: {
    marginTop: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255, 255, 255, 0.026)",
  },
  techTitle: {
    color: palette.text,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
  },
  techRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  techChip: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "rgba(79, 124, 255, 0.18)",
    backgroundColor: "rgba(79, 124, 255, 0.08)",
  },
  techText: {
    color: "#a9bcff",
    fontSize: 9.5,
    fontWeight: "600",
  },
  noteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 14,
    padding: 15,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "rgba(79, 124, 255, 0.18)",
    backgroundColor: "rgba(79, 124, 255, 0.07)",
  },
  noteText: {
    flex: 1,
    color: palette.muted,
    fontSize: 10.5,
    lineHeight: 16,
  },
  noteStrong: {
    color: "#dbe4ff",
    fontWeight: "700",
  },
  footer: {
    color: palette.mutedDim,
    fontSize: 9,
    textAlign: "center",
    marginTop: 22,
  },
});
