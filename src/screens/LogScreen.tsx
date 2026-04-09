import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Save, Droplet } from 'lucide-react-native';

import { useDiabaContext } from '../context/DiabaContext';
import { BloodSugarLog } from '../types';

export default function LogScreen() {
  const { addBloodSugarLog, bloodSugarLogs, userProfile } = useDiabaContext();

  const [reading, setReading] = useState('');
  const [insulinOptions, setInsulinOptions] = useState('');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!reading) {
      Alert.alert('Missing Reading', 'Please enter your blood sugar reading.');
      return;
    }

    const val = parseFloat(reading);
    if (isNaN(val)) {
      Alert.alert('Invalid Input', 'Please enter a valid number for reading.');
      return;
    }

    addBloodSugarLog({
      timestamp: Date.now(),
      reading: val,
      insulinUnits: insulinOptions ? parseFloat(insulinOptions) : undefined,
      notes: notes || undefined,
    });

    setReading('');
    setInsulinOptions('');
    setNotes('');
    Alert.alert('Success', 'Log saved successfully!');
  };

  const renderItem = ({ item }: { item: BloodSugarLog }) => {
    const isHigh = item.reading > (userProfile?.targetRangeMax || 180);
    const isLow = item.reading < (userProfile?.targetRangeMin || 70);
    const color = isHigh ? '#E53E3E' : isLow ? '#D69E2E' : '#38A169';

    const dateStr = new Date(item.timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });

    return (
      <View style={styles.historyItem}>
        <View style={styles.historyLeft}>
          <View style={[styles.historyIndicator, { backgroundColor: color }]} />
          <View>
            <Text style={styles.historyDate}>{dateStr}</Text>
            {item.notes ? <Text style={styles.historyNotes}>{item.notes}</Text> : null}
            {item.insulinUnits ? <Text style={styles.historyInsulin}>Insulin: {item.insulinUnits} units</Text> : null}
          </View>
        </View>
        <Text style={[styles.historyValue, { color }]}>{item.reading} dt</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.formContainer}>
          <Text style={styles.headerTitle}>Log Reading</Text>
          
          <View style={styles.inputCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Blood Sugar (mg/dL)</Text>
              <View style={styles.readingInputContainer}>
                <Droplet color="#E53E3E" size={24} style={styles.inputIcon} />
                <TextInput
                  style={styles.readingInput}
                  placeholder="e.g. 110"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="numeric"
                  value={reading}
                  onChangeText={setReading}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.label}>Insulin (Units)</Text>
                <TextInput
                  style={styles.regularInput}
                  placeholder="Optional"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="numeric"
                  value={insulinOptions}
                  onChangeText={setInsulinOptions}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={styles.regularInput}
                placeholder="How are you feeling?"
                placeholderTextColor="#A0AEC0"
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Save color="#fff" size={20} />
              <Text style={styles.saveBtnText}>Save Reading</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Recent Logs</Text>
          <FlatList
            data={bloodSugarLogs.slice(0, 5)}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No logs yet.</Text>
            }
          />
        </View>
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
  formContainer: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D3748',
    marginBottom: 20,
  },
  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  readingInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FED7D7',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  readingInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#E53E3E',
    paddingVertical: 16,
  },
  regularInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#2D3748',
  },
  saveBtn: {
    backgroundColor: '#E53E3E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  historyContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  historyItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  historyDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D3748',
  },
  historyNotes: {
    fontSize: 13,
    color: '#718096',
    marginTop: 2,
  },
  historyInsulin: {
    fontSize: 12,
    color: '#3182CE',
    marginTop: 2,
    fontWeight: '500',
  },
  historyValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  emptyText: {
    textAlign: 'center',
    color: '#A0AEC0',
    marginTop: 20,
  }
});
