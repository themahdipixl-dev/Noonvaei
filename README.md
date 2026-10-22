# Bakery Tycoon (Expo SDK 55)

Full project: package.json, app.json, App.tsx are all at the repo root.

## Local
```bash
npm install
npx expo install --fix   # aligns versions with your SDK if anything is off
npx expo start
```

## Expo Snack (import from GitHub)
Import the repo root. Run it on the Android tab / a real device with Expo Go
(NOT the Web preview: @react-three/fiber/native needs expo-gl).

## Layout
- src/game   pure logic + store + persistence
- src/scene  3D rendering only
- src/ui     2D overlay
