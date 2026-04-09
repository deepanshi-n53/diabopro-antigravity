import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlusCircle, AlertTriangle, Flame, Calendar, Activity } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

import { useDiabaContext } from '../context/DiabaContext';
import { TabParamList } from '../navigation/TabNavigator';

type DashboardNavigationProp = BottomTabNavigationProp<TabParamList, 'Dashboard'>;

export default function DashboardScreen() {
  const { userProfile, bloodSugarLogs } = useDiabaContext();
  const navigation = useNavigation<DashboardNavigationProp>();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const latestLog = bloodSugarLogs.length > 0 ? bloodSugarLogs[0] : null;

  // Streak logic (basic implementation)
  const getStreak = () => {
    if (bloodSugarLogs.length === 0) return 0;
    // Real implementation would look at continuous days
    // For now, simpler mock or just count logs
    return bloodSugarLogs.length > 0 ? 1 : 0;
  };

  const isWarning = latestLog && (latestLog.reading > 200 || latestLog.reading < 70);
  
  let indicatorColor = '#A0AEC0';
  let statusText = 'No Recent Data';

  if (latestLog && userProfile) {
    if (latestLog.reading >= userProfile.targetRangeMin && latestLog.reading <= userProfile.targetRangeMax) {
      indicatorColor = '#38A169'; // Green
      statusText = 'In Target Range';
    } else if (latestLog.reading > 200 || latestLog.reading < 70) {
      indicatorColor = '#E53E3E'; // Red
      statusText = 'Critical Action Needed';
    } else {
      indicatorColor = '#D69E2E'; // Yellow
      statusText = 'Out of Target Range';
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello!</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Flame color="#DD6B20" size={16} />
            <Text style={styles.streakText}>{getStreak()} Day Streak</Text>
          </View>
        </View>

        {isWarning && (
          <View style={styles.warningBanner}>
            <AlertTriangle color="#fff" size={24} />
            <View style={styles.warningTextContainer}>
              <Text style={styles.warningTitle}>Warning!</Text>
              <Text style={styles.warningSub}>
                Your last reading was {latestLog?.reading} mg/dL. Please follow your doctor's protocol or seek medical help if needed.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Latest Reading</Text>
          {latestLog ? (
            <View style={styles.readingRow}>
              <View style={styles.readingValueContainer}>
                <Text style={[styles.readingValue, { color: indicatorColor }]}>{latestLog.reading}</Text>
                <Text style={styles.readingUnit}>mg/dL</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: indicatorColor + '20' }]}>
                <Text style={[styles.statusText, { color: indicatorColor }]}>{statusText}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Activity color="#A0AEC0" size={48} />
              <Text style={styles.emptyStateText}>No readings yet today.</Text>
            </View>
          )}

          <TouchableOpacity 
            style={styles.quickLogBtn}
            onPress={() => navigation.navigate('Log')}
          >
            <PlusCircle color="#fff" size={20} />
            <Text style={styles.quickLogText}>Quick Log</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.upcomingCard}>
          <View style={styles.upcomingHeader}>
            <Calendar color="#4A5568" size={20} />
            <Text style={styles.upcomingTitle}>Upcoming Reminders</Text>
          </View>
          <View style={styles.reminderItem}>
            <View style={styles.reminderDot} />
            <Text style={styles.reminderText}>Log After-Lunch Blood Sugar</Text>
            <Text style={styles.reminderTime}>2:00 PM</Text>
          </View>
          <View style={styles.reminderItem}>
            <View style={styles.reminderDotBlue} />
            <Text style={styles.reminderText}>Evening Walk (30 mins)</Text>
            <Text style={styles.reminderTime}>6:30 PM</Text>
          </View>
        </View>

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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D3748',
  },
  date: {
    fontSize: 15,
    color: '#718096',
    marginTop: 4,
    fontWeight: '500',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEEBC8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    color: '#DD6B20',
    fontWeight: '700',
    marginLeft: 6,
    fontSize: 13,
  },
  warningBanner: {
    flexDirection: 'row',
    backgroundColor: '#E53E3E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  warningTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  warningTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 4,
  },
  warningSub: {
    color: '#FED7D7',
    fontSize: 13,
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A5568',
    marginBottom: 16,
  },
  readingRow: {
    marginBottom: 24,
  },
  readingValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  readingValue: {
    fontSize: 48,
    fontWeight: '800',
  },
  readingUnit: {
    fontSize: 16,
    color: '#718096',
    marginLeft: 8,
    fontWeight: '600',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: '#A0AEC0',
    marginTop: 12,
    fontSize: 16,
  },
  quickLogBtn: {
    backgroundColor: '#3182CE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  quickLogText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  upcomingCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  upcomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A5568',
    marginLeft: 8,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  reminderDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E53E3E',
    marginRight: 12,
  },
  reminderDotBlue: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3182CE',
    marginRight: 12,
  },
  reminderText: {
    flex: 1,
    fontSize: 15,
    color: '#2D3748',
    fontWeight: '500',
  },
  reminderTime: {
    fontSize: 13,
    color: '#718096',
    fontWeight: '600',
  },
});
