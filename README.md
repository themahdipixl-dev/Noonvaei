# Bakery Tycoon – starter overlay

This zip is an OVERLAY for a fresh Expo project (it intentionally has no package.json,
so that `npx expo install` picks versions that match your Expo SDK / Expo Go).

```bash
npx create-expo-app@latest bakery-tycoon --template blank-typescript
cd bakery-tycoon
# copy the contents of this zip into the project root (overwrite App.tsx / index.ts)
npx expo install expo-gl expo-asset expo-file-system expo-status-bar \
  react-native-safe-area-context @react-native-async-storage/async-storage
npx expo install three @react-three/fiber
npm i -D @types/three
npx expo start
```
In app.json set `"orientation": "portrait"` and `"platforms": ["android"]`.

Layout:
- src/game   pure logic + store + persistence (no React Native UI, no three)
- src/scene  3D rendering only (reads state through useGame)
- src/ui     2D overlay (HUD, buttons, offline popup)
