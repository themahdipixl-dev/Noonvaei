// Glue between pure game logic, storage and the app lifecycle.
import { useEffect, useReducer, useRef, useState, useCallback, useMemo } from 'react';
import { AppState } from 'react-native';
import { BALANCE, SECTION_KEYS } from '../config/balance';
import { reducer, createInitialState } from './state';
import { analyze, upgradeCost, overallLevel } from './economy';
import { loadGame, saveGame } from './storage';

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, () => createInitialState(Date.now()));
  const [ready, setReady] = useState(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Load save (applies offline income)
  useEffect(() => {
    let alive = true;
    loadGame().then((saved) => {
      if (!alive) return;
      dispatch({ type: 'LOAD', saved, now: Date.now() });
      setReady(true);
    });
    return () => { alive = false; };
  }, []);

  // Game loop, autosave, lifecycle
  useEffect(() => {
    if (!ready) return undefined;
    const tick = setInterval(() => dispatch({ type: 'TICK', now: Date.now() }), BALANCE.tickMs);
    const save = setInterval(() => saveGame(stateRef.current), BALANCE.saveEveryMs);
    const sub = AppState.addEventListener('change', (next) => {
      if (next === 'active') {
        dispatch({ type: 'TICK', now: Date.now() }); // pays offline gap
      } else {
        saveGame({ ...stateRef.current, lastSeen: Date.now() });
      }
    });
    return () => {
      clearInterval(tick);
      clearInterval(save);
      sub.remove();
    };
  }, [ready]);

  const upgrade = useCallback((section) => {
    dispatch({ type: 'UPGRADE', section });
    // save right after purchase
    setTimeout(() => saveGame(stateRef.current), 0);
  }, []);
  const dismissOffline = useCallback(() => dispatch({ type: 'DISMISS_OFFLINE' }), []);

  const info = useMemo(() => analyze(state.levels), [state.levels]);
  const costs = useMemo(() => {
    const c = {};
    SECTION_KEYS.forEach((k) => { c[k] = upgradeCost(k, state.levels[k]); });
    return c;
  }, [state.levels]);

  return {
    state,
    ready,
    income: info.income,
    info,                       // { flows, bottleneck, throughput, price, income }
    level: overallLevel(state.levels),
    costs,
    upgrade,                    // upgrade(sectionKey)
    dismissOffline,
  };
}
