import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Coffee, Plus } from 'lucide-react-native';
import { useDiabaContext } from '../context/DiabaContext';
import { MealLog } from '../types';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const;
type MealType = typeof MEAL_TYPES[number];

export default function DietScreen() {
  const { dietLogs, addDietLog } = useDiabaContext();
  
  const [selectedMeal, setSelectedMeal] = useState<MealType>('Breakfast');
  const [foodName, setFoodName] = useState('');
  const [carbs, setCarbs] = useState('');

  const handleSave = () => {
    if (!foodName || !carbs) {
      Alert.alert('Missing Info', 'Please enter food name and estimated carbs.');
      return;
    }

    const carbsVal = parseFloat(carbs);
    if (isNaN(carbsVal)) {
      Alert.alert('Invalid Input', 'Carbs must be a number.');
      return;
    }

    addDietLog({
      timestamp: Date.now(),
      mealType: selectedMeal,
      foodName,
      estimatedCarbs: carbsVal
    });

    setFoodName('');
    setCarbs('');
  };

  const renderItem = ({ item }: { item: MealLog }) => {
    const dateStr = new Date(item.timestamp).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });

    return (
      <View style={styles.logCard}>
        <View style={styles.logHeader}>
          <Text style={styles.mealTypeBadge}>{item.mealType}</Text>
          <Text style={styles.logDate}>{dateStr}</Text>
        </View>
        <View style={styles.logBody}>
          <Text style={styles.foodName}>{item.foodName}</Text>
          <View style={styles.carbsPill}>
            <Text style={styles.carbsValue}>{item.estimatedCarbs}g</Text>
            <Text style={styles.carbsLabel}>Carbs</Text>
          </View>
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
          data={dietLogs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.formContainer}>
              <Text style={styles.headerTitle}>Diet Log</Text>
              
              <View style={styles.card}>
                <Text style={styles.label}>Meal Type</Text>
                <View style={styles.pillContainer}>
                  {MEAL_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[styles.pill, selectedMeal === type && styles.pillActive]}
                      onPress={() => setSelectedMeal(type)}
                    >
                      <Text style={[styles.pillText, selectedMeal === type && styles.pillTextActive]}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Food Details</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 2 slices toast, 1 egg"
                  placeholderTextColor="#A0AEC0"
                  value={foodName}
                  onChangeText={setFoodName}
                />
                
                <Text style={styles.label}>Estimated Carbs (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 30"
                  placeholderTextColor="#A0AEC0"
                  keyboardType="numeric"
                  value={carbs}
                  onChangeText={setCarbs}
                />

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Plus color="#fff" size={20} />
                  <Text style={styles.saveBtnText}>Add Meal</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.historyTitle}>Recent Meals</Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Coffee color="#A0AEC0" size={48} />
              <Text style={styles.emptyText}>No meals logged yet.</Text>
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
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#EDF2F7',
  },
  pillActive: {
    backgroundColor: '#3182CE',
  },
  pillText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  pillTextActive: {
    color: '#fff',
    fontWeight: '600',
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
    backgroundColor: '#38A169',
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
    marginBottom: 8,
  },
  logCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealTypeBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3182CE',
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  logDate: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  logBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
    paddingRight: 16,
  },
  carbsPill: {
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  carbsValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#E53E3E',
  },
  carbsLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#E53E3E',
    marginTop: 2,
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
