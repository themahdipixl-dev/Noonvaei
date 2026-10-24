// PNG icons hosted in the Assets repo (themahdipixl-dev/Assets).
import React from 'react';
import { Image } from 'react-native';

const BASE =
  'https://raw.githubusercontent.com/themahdipixl-dev/Assets/main/assets/';
const f = (name) => ({ uri: BASE + name });

export const ICONS = {
  joystick: f('arcade_joystick.png'),
  cart: f('blue_shopping_cart.png'),
  diamond: f('clear_white_diamond_with_a_classic_pointed_cut.png'),
  clipboard: f('clipboard_with_blank_check_boxes.png'),
  buildings: f('color-three-buildings.png'),
  sparkle: f('four_point_sparkle.png'),
  crown: f('gold_crown_with_three_gems.png'),
  levelUp: f('green_level_up_arrow_with_sparkles.png'),
  gear: f('grey_gear_cog.png'),
  house: f('simple_blue_house_icon.png'),
  money: f('stack_of_green_banknotes.png'),
  cards: f('three-cards-with-crown-on-it.png'),
  plus: f('white_plus_sign_in_a_green_circle.png'),
  star: f('yellow-twelve-pointed-star.png'),
};

// Bottom bar tab key -> PNG icon.
const TAB_ICON_SOURCES = {
  shop: ICONS.cart,
  cards: ICONS.cards,
  home: ICONS.house,
  upgrade: ICONS.levelUp,
  minigames: ICONS.joystick,
};

export function TabIcon({ name, size = 40 }) {
  const source = TAB_ICON_SOURCES[name];
  if (!source) return null;
  return (
    <Image
      source={source}
      style={{ width: size, height: size }}
      resizeMode="contain"
      fadeDuration={0}
    />
  );
}
