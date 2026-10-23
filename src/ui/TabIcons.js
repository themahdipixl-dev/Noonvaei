// Cartoon tab icons from a real icon library (no custom SVG drawings).
// Library: MaterialCommunityIcons from @expo/vector-icons (Pictogrammers "Material Design Icons", Apache-2.0).
// Each glyph gets a chunky navy outline (8 offset copies behind) so it reads as "cartoon".
import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from './theme';

// name = glyph in MaterialCommunityIcons, color = fill color (matches the reference mock-up)
const ICONS = {
  shop:      { glyph: 'shopping',      color: '#FF5A4F' }, // red shopping bag
  cards:     { glyph: 'cards',         color: '#4C7DFF' }, // blue cards
  home:      { glyph: 'home',          color: '#E8453C' }, // red house
  upgrade:   { glyph: 'arrow-up-bold', color: '#5FE05A' }, // green up arrow
  minigames: { glyph: 'dice-5',        color: '#7B5CF0' }, // purple dice
};

const OFFSETS = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]];

export function TabIcon({ name, size = 40 }) {
  const cfg = ICONS[name];
  if (!cfg) return null;
  const o = Math.max(1.5, size * 0.06); // outline thickness
  const box = size + o * 2;
  return (
    <View style={{ width: box, height: box, alignItems: 'center', justifyContent: 'center' }}>
      {OFFSETS.map(([dx, dy], i) => (
        <View key={i} style={{ position: 'absolute', transform: [{ translateX: dx * o }, { translateY: dy * o }] }}>
          <MaterialCommunityIcons name={cfg.glyph} size={size} color={COLORS.ink} />
        </View>
      ))}
      <MaterialCommunityIcons name={cfg.glyph} size={size} color={cfg.color} />
    </View>
  );
}
