import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { startGame } from './src/game/store';
import { useGame } from './src/game/useGame';
import { GameScene } from './src/scene/GameScene';
import { Hud } from './src/ui/Hud';
import { OfflineModal } from './src/ui/OfflineModal';

export default function App() {
  const ready = useGame((s) => s.ready);

  useEffect(() => {
    void startGame(); // idempotent: safe under StrictMode / fast refresh
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={styles.root}>
        <GameScene />
        {ready ? <Hud /> : <ActivityIndicator style={styles.loader} size="large" color="#8a4b14" />}
        <OfflineModal />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f4e4c1' },
  loader: { ...StyleSheet.absoluteFillObject },
});
