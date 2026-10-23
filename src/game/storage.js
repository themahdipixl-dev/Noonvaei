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
    const { money, levels, totalEarned, lastSeen } = state;
    await AsyncStorage.setItem(
      BALANCE.saveKey,
      JSON.stringify({ v: BALANCE.saveVersion, money, levels, totalEarned, lastSeen })
    );
  } catch (e) {
    // ignore save errors in the first prototype
  }
}
