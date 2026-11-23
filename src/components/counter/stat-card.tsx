import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";

import { palette } from "@/constants/likes";

type StatCardProps = {
  icon: ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
  tint: string;
  tintBackground: string;
  valueColor?: string;
  compact?: boolean;
};

export function StatCard({
  icon,
  label,
  value,
  tint,
  tintBackground,
  valueColor,
  compact,
}: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: tintBackground, borderColor: `${tint}33` }]}>
        <Ionicons name={icon} size={15} color={tint} />
      </View>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text
        style={[styles.value, compact && styles.valueCompact, valueColor ? { color: valueColor } : null]}
        numberOfLines={1}
        adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: "46%",
    minHeight: 108,
    padding: 13,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.028)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    gap: 5,
  },
  iconWrap: {
    width: 29,
    height: 29,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 3,
  },
  label: {
    color: palette.mutedDim,
    fontSize: 10,
    fontWeight: "600",
  },
  value: {
    color: palette.text,
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: -0.7,
    fontVariant: ["tabular-nums"],
  },
  valueCompact: {
    fontSize: 16,
    letterSpacing: -0.4,
  },
});
