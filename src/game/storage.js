import AsyncStorage from '@react-native-async-storage/async-storage';
import { BALANCE } from '../config/balance';

export async function loadGame() {
  try {
    const raw = await AsyncStorage.getItem(BALANCE.saveKey);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export async function saveGame(state) {
  try {
    const { money, level, totalEarned, lastSeen } = state;
    await AsyncStorage.setItem(
      BALANCE.saveKey,
      JSON.stringify({ v: 1, money, level, totalEarned, lastSeen })
    );
  } catch (e) {
    // ignore save errors in the first prototype
  }
}
