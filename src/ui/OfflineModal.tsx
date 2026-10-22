import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDuration, formatNumber } from '../game/format';
import { gameActions } from '../game/store';
import { useGame } from '../game/useGame';

export function OfflineModal() {
  const report = useGame((s) => s.offlineReport);

  return (
    <Modal transparent animationType="fade" visible={report !== null} onRequestClose={gameActions.dismissOfflineReport}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>خوش برگشتی!</Text>
          {report && (
            <Text style={styles.body}>
              در {formatDuration(report.seconds)} نبودنت، نانوایی {formatNumber(report.earned)} تومان درآمد داشت.
            </Text>
          )}
          <Pressable style={styles.btn} onPress={gameActions.dismissOfflineReport}>
            <Text style={styles.btnText}>باشه</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#fff8eb', borderRadius: 18, padding: 22, width: '100%', maxWidth: 360, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: '#5b3210', marginBottom: 10 },
  body: { fontSize: 16, color: '#5b3210', textAlign: 'center', lineHeight: 26 },
  btn: { marginTop: 18, backgroundColor: '#e07b1f', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 36 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
