// Fonts hosted in the Assets repo (themahdipixl-dev/Assets).
// TEMPORARY: for the final build, swap each { uri } for require('../../assets/fonts/...').
import { useFonts } from 'expo-font';

const BASE =
  'https://raw.githubusercontent.com/themahdipixl-dev/Assets/main/assets/';
const f = (name) => ({ uri: BASE + name });

// Family names used in styles. Each weight is its own family,
// so don't combine these with fontWeight (it breaks on Android).
export const FONTS = {
  thin: 'Vazir-Thin',
  light: 'Vazir-Light',
  regular: 'Vazir',
  medium: 'Vazir-Medium',
  bold: 'Vazir-Bold',
  title: 'Lalezar',
};

const FONT_SOURCES = {
  [FONTS.thin]: f('Vazir-Thin-FD-WOL.ttf'),
  [FONTS.light]: f('Vazir-Light-FD-WOL.ttf'),
  [FONTS.regular]: f('Vazir-FD-WOL.ttf'),
  [FONTS.medium]: f('Vazir-Medium-FD-WOL.ttf'),
  [FONTS.bold]: f('Vazir-Bold-FD-WOL.ttf'),
  [FONTS.title]: f('Lalezar-Regular.ttf'),
};

export function useAppFonts() {
  const [loaded, error] = useFonts(FONT_SOURCES);
  return loaded || !!error; // if the download fails, the app still opens with the system font
}