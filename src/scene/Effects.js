import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View, StyleSheet } from 'react-native';
import { FONTS } from '../ui/Fonts';

function useRise(initialDelay, duration) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.sequence([
      Animated.delay(initialDelay),
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, { toValue: 1, duration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      ),
    ]);
    loop.start();
    return () => loop.stop();
  }, [v, initialDelay, duration]);
  return v;
}

function Puff({ x, y, delay, sway }) {
  const v = useRise(delay, 2200);
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.puff,
        {
          left: x,
          top: y,
          opacity: v.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 0.7, 0] }),
          transform: [
            { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -60] }) },
            { translateX: v.interpolate({ inputRange: [0, 1], outputRange: [0, sway] }) },
            { scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.8] }) },
          ],
        },
      ]}
    />
  );
}

export function Steam({ x, y }) {
  return (
    <>
      <Puff x={x - 7} y={y} delay={0} sway={10} />
      <Puff x={x - 7} y={y} delay={700} sway={-12} />
      <Puff x={x - 7} y={y} delay={1400} sway={6} />
    </>
  );
}

function Pop({ x, y, delay, text }) {
  const v = useRise(delay, 1800);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute', left: x - 40, top: y, width: 80, alignItems: 'center',
        opacity: v.interpolate({ inputRange: [0, 0.15, 0.7, 1], outputRange: [0, 1, 1, 0] }),
        transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -50] }) }],
      }}
    >
      <Text style={styles.pop}>{text}</Text>
    </Animated.View>
  );
}

export function FloatCoins({ x, y, text }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Pop x={x} y={y} delay={300} text={text} />
      <Pop x={x + 18} y={y} delay={1200} text={text} />
    </View>
  );
}

const styles = StyleSheet.create({
  puff: { position: 'absolute', width: 14, height: 14, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.75)' },
  pop: {
    fontFamily: FONTS.bold, fontSize: 17, color: '#fff6c8',
    textShadowColor: '#9c5614', textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 2,
  },
});
