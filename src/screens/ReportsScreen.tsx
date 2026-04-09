import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivitySquare, AlertCircle } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import { useDiabaContext } from '../context/DiabaContext';
import { BloodSugarLog } from '../types';

const screenWidth = Dimensions.get('window').width;

const getDaysArray = (days: number) => {
  const arr = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    arr.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  return arr;
};

export default function ReportsScreen() {
  const { bloodSugarLogs, userProfile } = useDiabaContext();
  const [timeframe, setTimeframe] = useState<'7Days' | '30Days'>('7Days');

  const chartData = useMemo(() => {
    const days = timeframe === '7Days' ? 7 : 30;
    const labels = getDaysArray(days);
    const dataPoints: number[] = new Array(days).fill(0);
    const countPoints: number[] = new Array(days).fill(0);

    const now = new Date();
    const nowTime = now.getTime();

    // Group logic by day offset
    bloodSugarLogs.forEach(log => {
      const diffTime = Math.abs(nowTime - log.timestamp);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < days) {
        const index = (days - 1) - diffDays;
        if (index >= 0 && index < days) {
          dataPoints[index] += log.reading;
          countPoints[index] += 1;
        }
      }
    });

    // Average out
    for (let i = 0; i < days; i++) {
        if (countPoints[i] > 0) {
            dataPoints[i] = dataPoints[i] / countPoints[i];
        } else {
            // No data for this day, we'll try to carry over the last known value for a continuous line,
            // or just use 0 if there's no data at all yet.
            if (i > 0 && dataPoints[i-1] > 0) {
                // If you want continuous carry-over (optional)
                // dataPoints[i] = dataPoints[i-1];
                dataPoints[i] = 0; 
            } else {
                dataPoints[i] = 0;
            }
        }
    }

    // Filter out 0s conditionally or just leave them. 
    // chart-kit requires a numerical array.
    const cleanDataPoints = dataPoints.map(v => v === 0 ? (userProfile?.targetRangeMin || 80) : v); // fallback to target min so chart doesn't crash to 0 if there are gaps

    // Simplify labels for 30 days so they don't overlap
    const finalLabels = timeframe === '30Days' 
      ? labels.map((l, i) => i % 5 === 0 ? l : '')
      : labels;

    return {
      labels: finalLabels,
      datasets: [
        {
          data: cleanDataPoints.length > 0 ? cleanDataPoints : [0], // fallback
          color: (opacity = 1) => `rgba(229, 62, 62, ${opacity})`,
          strokeWidth: 3
        }
      ]
    };
  }, [bloodSugarLogs, timeframe, userProfile]);


  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(49, 130, 206, ${opacity})`, // Blue axis
    labelColor: (opacity = 1) => `rgba(113, 128, 150, ${opacity})`, // Gray labels
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#E53E3E'
    }
  };

  const hasData = bloodSugarLogs.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <ActivitySquare color="#3182CE" size={28} />
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, timeframe === '7Days' && styles.activeTab]}
            onPress={() => setTimeframe('7Days')}
          >
            <Text style={[styles.tabText, timeframe === '7Days' && styles.activeTabText]}>Last 7 Days</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, timeframe === '30Days' && styles.activeTab]}
            onPress={() => setTimeframe('30Days')}
          >
            <Text style={[styles.tabText, timeframe === '30Days' && styles.activeTabText]}>Last 30 Days</Text>
          </TouchableOpacity>
        </View>

        {hasData ? (
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Blood Sugar Trends</Text>
            <Text style={styles.chartSubtitle}>Averages per day (mg/dL)</Text>
            
            <View style={styles.chartWrapper}>
              <LineChart
                data={chartData}
                width={screenWidth - 80}
                height={260}
                chartConfig={chartConfig}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
                yAxisSuffix=""
                yAxisInterval={1}
                segments={4}
              />
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <AlertCircle color="#A0AEC0" size={48} />
            <Text style={styles.emptyText}>Not enough data to generate charts.</Text>
            <Text style={styles.emptySubText}>Log your blood sugar to see trends.</Text>
          </View>
        )}

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
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2D3748',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#EDF2F7',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
  },
  activeTabText: {
    color: '#2D3748',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
  },
  chartSubtitle: {
    fontSize: 13,
    color: '#A0AEC0',
    marginTop: 4,
    marginBottom: 16,
  },
  chartWrapper: {
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#A0AEC0',
    marginTop: 8,
  }
});
