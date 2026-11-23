import { DarkTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";

SplashScreen.preventAutoHideAsync();

const likelabTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#7ea2ff",
    background: "#060912",
    card: "#0a1020",
    text: "#f1f5ff",
    border: "rgba(148, 163, 184, 0.14)",
    notification: "#ff6b7d",
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={likelabTheme}>
      <StatusBar style="light" />
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}
