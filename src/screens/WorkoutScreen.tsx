import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, Clock, Plus } from 'lucide-react-native';
import { useDiabaContext } from '../context/DiabaContext';
import { WorkoutLog } from '../types';

export default function WorkoutScreen() {
  const { workoutLogs, addWorkoutLog } = useDiabaContext();
  
  const [activityType, setActivityType] = useState('');
  const [duration, setDuration] = useState('');

  const handleSave = () => {
    if (!activityType || !duration) {
      Alert.alert('Missing Info', 'Please enter activity type and duration.');
      return;
    }

    const durationVal = parseInt(duration, 10);
    if (isNaN(durationVal) || durationVal <= 0) {
      Alert.alert('Invalid Input', 'Duration must be a positive number.');
      return;
    }

    addWorkoutLog({
      timestamp: Date.now(),
      activityType,
      durationMinutes: durationVal
    });

    setActivityType('');
    setDuration('');
  };

  const currentWeekLogs = workoutLogs.filter(log => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return log.timestamp >= oneWeekAgo;
  });

  const weeklyDuration = currentWeekLogs.reduce((total, log) => total + log.durationMinutes, 0);

  const renderItem = ({ item }: { item: WorkoutLog }) => {
    const dateStr = new Date(item.timestamp).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });

    return (
      <View style={styles.logCard}>
        <View style={styles.logIconContainer}>
          <Activity color="#DD6B20" size={24} />
        </View>
        <View style={styles.logBody}>
          <Text style={styles.activityType}>{item.activityType}</Text>
          <Text style={styles.logDate}>{dateStr}</Text>
        </View>
        <View style={styles.durationBadge}>
          <Clock color="#DD6B20" size={14} />
          <Text style={styles.durationText}>{item.durationMinutes} min</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={workoutLogs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.formContainer}>
              <Text style={styles.headerTitle}>Workouts</Text>
              
              <View style={styles.statsCard}>
                <Text style={styles.statsTitle}>Weekly Total</Text>
                <View style={styles.statsRow}>
                  <Text style={styles.statsValue}>{weeklyDuration}</Text>
                  <Text style={styles.statsUnit}>minutes</Text>
                </View>
                <Text style={styles.statsSubtitle}>Keep it up! 150 mins is recommended.</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.label}>Activity Type</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Walking, Yoga"
                  placeholderTextColor="#A0AEC0"
                  value={activityType}
                  onChangeText={setActivityType}
                />
                
                <Text style={styles.label}>Duration (minutes)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 30"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="numeric"
                  value={duration}
                  onChangeText={setDuration}
                />

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Plus color="#fff" size={20} />
                  <Text style={styles.saveBtnText}>Log Workout</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.historyTitle}>Workout History</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Activity color="#A0AEC0" size={48} />
              <Text style={styles.emptyText}>No workouts logged yet.</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formContainer: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D3748',
    marginBottom: 20,
  },
  statsCard: {
    backgroundColor: '#DD6B20',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#DD6B20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  statsTitle: {
    color: '#FEEBC8',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statsValue: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '800',
  },
  statsUnit: {
    color: '#FEEBC8',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsSubtitle: {
    color: '#FEEBC8',
    fontSize: 13,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#2D3748',
    marginBottom: 16,
  },
  saveBtn: {
    backgroundColor: '#3182CE',
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 12,
  },
  logCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  logIconContainer: {
    backgroundColor: '#FEEBC8',
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  logBody: {
    flex: 1,
  },
  activityType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3748',
  },
  logDate: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFaf0',
    borderWidth: 1,
    borderColor: '#FEEBC8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  durationText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#DD6B20',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#A0AEC0',
    marginTop: 12,
    fontSize: 16,
  }
});
