import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, StyleSheet, Platform, AppState } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useGame } from './src/game/useGame';
import WorldMap from './src/world/WorldMap';
import Hud from './src/ui/Hud';
import TopGradient from './src/ui/TopGradient';
import UpgradePanel from './src/ui/UpgradePanel';
import OfflineCard from './src/ui/OfflineCard';
import BottomBar, { useBottomBarHeight } from './src/ui/BottomBar';
import ComingSoon from './src/ui/ComingSoon';
import { STRINGS } from './src/config/strings';

// Hide the phone's own navigation buttons / gesture line while the game is open.
const hideSystemNav = () => {
  if (Platform.OS !== 'android') return;
  NavigationBar.setVisibilityAsync('hidden').catch(() => {});
};

function Game() {
  const { state, ready, income, info, level, costs, upgrade, dismissOffline } = useGame();
  const [tab, setTab] = useState('home'); // shop | cards | home | upgrade | minigames
  const barHeight = useBottomBarHeight(); // bottom bar height incl. bottom safe area

  useEffect(() => {
    hideSystemNav();
    // Re-hide when coming back to the app (e.g. after the recents screen).
    const appSub = AppState.addEventListener('change', (s) => {
      if (s === 'active') hideSystemNav();
    });
    // If the user swipes the bar into view, hide it again shortly after.
    let timer;
    let visSub;
    try {
      visSub = NavigationBar.addVisibilityListener(({ visibility }) => {
        if (visibility === 'visible') {
          clearTimeout(timer);
          timer = setTimeout(hideSystemNav, 2000);
        }
      });
    } catch {
      // Visibility listener isn't available on this platform/device: safe to ignore.
    }
    return () => {
      clearTimeout(timer);
      appSub.remove();
      if (visSub) visSub.remove();
    };
  }, []);

  if (!ready) {
    return (
      <View style={[styles.root, styles.center]}>
        <StatusBar hidden />
        <Text style={styles.loading}>{STRINGS.loading}</Text>
      </View>
    );
  }

  const panelBottom = barHeight + 10;

  return (
    <View style={styles.root}>
      {/* Phone's top status bar is hidden; a short black -> transparent gradient replaces it. */}
      <StatusBar hidden />
      {/* Big pannable world (fills the screen, HUD floats above it) */}
      <WorldMap level={level} />
      <TopGradient />
      {/* box-none: HUD buttons are tappable, empty areas still pass touches to the map */}
      <View style={styles.hud} pointerEvents="box-none">
        <Hud money={state.money} income={income} level={level} />
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

export default function App() {
  return (
    <SafeAreaProvider>
      <Game />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  // No top padding any more: the status bar is hidden, so the game uses the full screen height.
  root: {
    flex: 1,
    backgroundColor: '#b9d98f',
  },
  hud: { position: 'absolute', top: 0, left: 0, right: 0 },
  center: { alignItems: 'center', justifyContent: 'center' },
  loading: { fontSize: 18, color: '#6b3f1d' },
});
