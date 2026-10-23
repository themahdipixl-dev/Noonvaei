import React, { useState } from 'react';
import { View, Text, StatusBar, StyleSheet, Platform } from 'react-native';
import { useGame } from './src/game/useGame';
import WorldMap from './src/world/WorldMap';
import Hud from './src/ui/Hud';
import UpgradePanel from './src/ui/UpgradePanel';
import OfflineCard from './src/ui/OfflineCard';
import BottomBar, { BOTTOM_BAR_HEIGHT } from './src/ui/BottomBar';
import ComingSoon from './src/ui/ComingSoon';
import { STRINGS } from './src/config/strings';

export default function App() {
  const { state, ready, income, info, level, costs, upgrade, dismissOffline } = useGame();
  const [tab, setTab] = useState('home'); // shop | cards | home | upgrade | minigames

  if (!ready) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={styles.loading}>{STRINGS.loading}</Text>
      </View>
    );
  }

  const panelBottom = BOTTOM_BAR_HEIGHT + 10;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffeec4" />
      {/* Big pannable / zoomable world (fills the screen, HUD floats above it) */}
      <WorldMap level={level} />
      <View style={styles.hud} pointerEvents="none">
        <Hud money={state.money} income={income} level={level} bottleneck={info.bottleneck} />
      </View>

      {tab === 'upgrade' && (
        <UpgradePanel
          levels={state.levels}
          costs={costs}
          money={state.money}
          bottleneck={info.bottleneck}
          onUpgrade={upgrade}
          bottom={panelBottom}
        />
      )}
      {(tab === 'shop' || tab === 'cards' || tab === 'minigames') && (
        <ComingSoon title={STRINGS.tabs[tab]} bottom={panelBottom} />
      )}

      <BottomBar active={tab} onChange={setTab} />

      {state.offlineReport && (
        <OfflineCard report={state.offlineReport} onClose={dismissOffline} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#b9d98f',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
  },
  hud: { position: 'absolute', top: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0, left: 0, right: 0 },
  center: { alignItems: 'center', justifyContent: 'center' },
  loading: { fontSize: 18, color: '#6b3f1d' },
});
