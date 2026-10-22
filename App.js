import React from 'react';
import { View, Text, StatusBar, StyleSheet, Platform } from 'react-native';
import { useGame } from './src/game/useGame';
import Scene from './src/scene/Scene';
import Hud from './src/ui/Hud';
import UpgradeButton from './src/ui/UpgradeButton';
import OfflineCard from './src/ui/OfflineCard';
import { STRINGS } from './src/config/strings';

export default function App() {
  const { state, ready, income, cost, canAfford, upgrade, dismissOffline } = useGame();

  if (!ready) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={styles.loading}>{STRINGS.loading}</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4e4c1" />
      <Hud money={state.money} income={income} level={state.level} />
      <Scene level={state.level}>
        <UpgradeButton level={state.level} cost={cost} canAfford={canAfford} onPress={upgrade} />
      </Scene>
      {state.offlineReport && (
        <OfflineCard report={state.offlineReport} onClose={dismissOffline} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f4e4c1',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  loading: { fontSize: 18, color: '#6b3f1d' },
});
