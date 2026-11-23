import { Ionicons } from "@expo/vector-icons";
import {
  TabList,
  TabListProps,
  TabSlot,
  TabTrigger,
  TabTriggerSlotProps,
  Tabs,
} from "expo-router/ui";
import { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { palette } from "@/constants/likes";

type IconName = ComponentProps<typeof Ionicons>["name"];

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: "100%" }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton icon="heart">Contador</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton icon="information-circle">Acerca</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({
  children,
  isFocused,
  icon,
  ...props
}: TabTriggerSlotProps & { icon: IconName }) {
  const pressableProps = props as unknown as ComponentProps<typeof Pressable>;

  return (
    <Pressable
      {...pressableProps}
      style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}>
      <View style={[styles.tab, isFocused && styles.tabActive]}>
        <Ionicons
          name={icon}
          size={14}
          color={isFocused ? "#ffffff" : palette.muted}
          style={styles.tabIcon}
        />
        <Text style={[styles.tabText, isFocused && styles.tabTextActive]}>{children}</Text>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  return (
    <View {...props} style={styles.tabListContainer}>
      <View style={styles.inner}>
        <View style={styles.brand}>
          <Ionicons name="heart" size={12} color="#7ea2ff" />
          <Text style={styles.brandText}>LikeLab</Text>
        </View>
        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  inner: {
    width: "100%",
    maxWidth: 430,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    padding: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.18)",
    backgroundColor: "rgba(9, 14, 27, 0.94)",
    shadowColor: "#000000",
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 16,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingLeft: 8,
    paddingRight: 2,
  },
  brandText: {
    color: "#dbe4ff",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  pressable: {
    flex: 1,
  },
  pressed: {
    opacity: 0.75,
  },
  tab: {
    minHeight: 33,
    paddingHorizontal: 10,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  tabActive: {
    backgroundColor: "rgba(79, 124, 255, 0.2)",
  },
  tabIcon: {
    marginTop: -1,
  },
  tabText: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#ffffff",
  },
});
