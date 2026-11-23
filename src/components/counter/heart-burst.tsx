import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const COLORS = ["#2ee6a8", "#7ea2ff", "#b18cff", "#46e6b0", "#ffd98a"];

type HeartBurstProps = {
  burstKey: number;
};

/**
 * Corazones flotantes al dar like.
 * Se reinicia cada vez que cambia `burstKey`.
 */
export function HeartBurst({ burstKey }: HeartBurstProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (burstKey === 0) return;

    progress.stopAnimation();
    progress.setValue(0);

    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 1100,
      useNativeDriver: true,
    });

    animation.start();

    return () => animation.stop();
  }, [burstKey, progress]);

  return (
    <View pointerEvents="none" style={styles.layer}>
      {COLORS.map((color, index) => {
        const offset = (index - 2) * 30;

        const translateX = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [offset, offset * 2.1],
        });

        const translateY = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -110 - index * 16],
        });

        const opacity = progress.interpolate({
          inputRange: [0, 0.12, 0.72, 1],
          outputRange: [0, 1, 0.85, 0],
        });

        const scale = progress.interpolate({
          inputRange: [0, 0.18, 1],
          outputRange: [0.35, 1.2, 0.3],
        });

        const rotate = progress.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", `${(index - 2) * 22}deg`],
        });

        return (
          <Animated.Text
            key={color + index}
            style={[
              styles.heart,
              {
                color,
                opacity,
                transform: [{ translateX }, { translateY }, { scale }, { rotate }],
              },
            ]}>
            ♥
          </Animated.Text>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    zIndex: 5,
  },
  heart: {
    position: "absolute",
    bottom: 118,
    left: "24%",
    fontSize: 20,
    textShadowColor: "rgba(46, 230, 168, 0.65)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
});
