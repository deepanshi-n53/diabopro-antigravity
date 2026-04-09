import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, X, Plus } from 'lucide-react-native';
import { useDiabaContext } from '../context/DiabaContext';
import { TestResult } from '../types';

const TEST_TYPES = ['HbA1c', 'Kidney Profile', 'Lipid Profile', 'UACR'] as const;
type TestType = typeof TEST_TYPES[number];

export default function TestsScreen() {
  const { testResults, addTestResult } = useDiabaContext();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTest, setSelectedTest] = useState<TestType | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleOpenModal = (type: TestType) => {
    setSelectedTest(type);
    setInputValue('');
    setModalVisible(true);
  };

  const handleSave = () => {
    if (selectedTest && inputValue) {
      addTestResult({
        type: selectedTest,
        resultValue: inputValue,
        dateLogged: Date.now(),
      });
      setModalVisible(false);
    }
  };

  const getLatestResult = (type: TestType): TestResult | undefined => {
    return testResults.filter(t => t.type === type).sort((a, b) => b.dateLogged - a.dateLogged)[0];
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Lab Tests</Text>
        
        <View style={styles.grid}>
          {TEST_TYPES.map((type) => {
            const latest = getLatestResult(type);
            return (
              <TouchableOpacity
                key={type}
                style={styles.card}
                onPress={() => handleOpenModal(type)}
              >
                <View style={styles.cardHeader}>
                  <Activity color="#3182CE" size={20} />
                  <Text style={styles.cardTitle}>{type}</Text>
                </View>
                
                {latest ? (
                  <View style={styles.resultContainer}>
                    <Text style={styles.resultValue}>{latest.resultValue}</Text>
                    <Text style={styles.resultDate}>
                      {new Date(latest.dateLogged).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.noResultContainer}>
                    <Text style={styles.noResultText}>No data yet</Text>
                    <View style={styles.addBtn}>
                      <Plus color="#3182CE" size={16} />
                      <Text style={styles.addBtnText}>Add</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Log {selectedTest}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <X color="#4A5568" size={24} />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.label}>Result Value</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 5.8% or Normal"
                placeholderTextColor="#A0AEC0"
                value={inputValue}
                onChangeText={setInputValue}
                autoFocus
              />
              
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save Result</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  container: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D3748',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A5568',
    marginLeft: 8,
    flex: 1,
  },
  resultContainer: {
    marginTop: 8,
  },
  resultValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2D3748',
  },
  resultDate: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
  noResultContainer: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  noResultText: {
    fontSize: 13,
    color: '#A0AEC0',
    marginBottom: 8,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#3182CE',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2D3748',
    marginBottom: 24,
  },
  saveBtn: {
    backgroundColor: '#3182CE',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
