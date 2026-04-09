import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDiabaContext } from '../context/DiabaContext';
import { DiabetesType } from '../types';

export default function OnboardingScreen() {
  const { saveProfile } = useDiabaContext();
  
  const [diabetesType, setDiabetesType] = useState<DiabetesType | null>(null);
  const [age, setAge] = useState('');
  const [targetMin, setTargetMin] = useState('70');
  const [targetMax, setTargetMax] = useState('180');

  const types: DiabetesType[] = ['Type 1', 'Type 2', 'Gestational'];

  const handleSave = () => {
    if (!diabetesType || !age || !targetMin || !targetMax) {
      Alert.alert('Missing Info', 'Please fill out all fields to continue.');
      return;
    }

    saveProfile({
      diabetesType,
      age: parseInt(age, 10),
      targetRangeMin: parseInt(targetMin, 10),
      targetRangeMax: parseInt(targetMax, 10),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to DiabaCare</Text>
            <Text style={styles.subtitle}>Let's set up your profile for personalized tracking.</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Diabetes Type</Text>
            <View style={styles.pillContainer}>
              {types.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.pill,
                    diabetesType === type && styles.pillActive
                  ]}
                  onPress={() => setDiabetesType(type)}
                >
                  <Text style={[
                    styles.pillText,
                    diabetesType === type && styles.pillTextActive
                  ]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g., 35"
              placeholderTextColor="#A0AEC0"
              keyboardType="number-pad"
              value={age}
              onChangeText={setAge}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Target Blood Sugar Range (mg/dL)</Text>
            <Text style={styles.helperText}>Provided by your doctor.</Text>
            <View style={styles.row}>
              <View style={styles.halfInputContainer}>
                <Text style={styles.subLabel}>Min</Text>
                <TextInput
                  style={styles.input}
                  placeholder="70"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="number-pad"
                  value={targetMin}
                  onChangeText={setTargetMin}
                />
              </View>
              <View style={styles.halfInputContainer}>
                <Text style={styles.subLabel}>Max</Text>
                <TextInput
                  style={styles.input}
                  placeholder="180"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="number-pad"
                  value={targetMax}
                  onChangeText={setTargetMax}
                />
              </View>
            </View>
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Complete Setup</Text>
          </TouchableOpacity>
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
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2D3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#718096',
    lineHeight: 24,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 12,
  },
  helperText: {
    fontSize: 13,
    color: '#A0AEC0',
    marginTop: -8,
    marginBottom: 12,
  },
  subLabel: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputContainer: {
    width: '48%',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2D3748',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  pill: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  pillActive: {
    backgroundColor: '#3182CE',
    borderColor: '#3182CE',
  },
  pillText: {
    color: '#4A5568',
    fontSize: 15,
    fontWeight: '500',
  },
  pillTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 0 : 24,
    backgroundColor: '#F7FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  button: {
    backgroundColor: '#E53E3E',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
