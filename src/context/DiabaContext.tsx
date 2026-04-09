import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, BloodSugarLog, TestResult, MealLog, WorkoutLog } from '../types';

interface DiabaContextType {
  isReady: boolean;
  userProfile: UserProfile | null;
  bloodSugarLogs: BloodSugarLog[];
  testResults: TestResult[];
  dietLogs: MealLog[];
  workoutLogs: WorkoutLog[];
  
  saveProfile: (profile: UserProfile) => Promise<void>;
  addBloodSugarLog: (log: Omit<BloodSugarLog, 'id'>) => Promise<void>;
  addTestResult: (result: Omit<TestResult, 'id'>) => Promise<void>;
  addDietLog: (meal: Omit<MealLog, 'id'>) => Promise<void>;
  addWorkoutLog: (workout: Omit<WorkoutLog, 'id'>) => Promise<void>;
}

const DiabaContext = createContext<DiabaContextType | undefined>(undefined);

export const useDiabaContext = () => {
  const context = useContext(DiabaContext);
  if (!context) {
    throw new Error("useDiabaContext must be used within a DiabaProvider");
  }
  return context;
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const DiabaProvider = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [bloodSugarLogs, setBloodSugarLogs] = useState<BloodSugarLog[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [dietLogs, setDietLogs] = useState<MealLog[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const keys = ['userProfile', 'bloodSugarLogs', 'testResults', 'dietLogs', 'workoutLogs'];
      const result = await AsyncStorage.multiGet(keys);
      
      const parsed = result.reduce((acc, [key, value]) => {
        acc[key] = value ? JSON.parse(value) : null;
        return acc;
      }, {} as Record<string, any>);

      if (parsed.userProfile) setUserProfile(parsed.userProfile);
      if (parsed.bloodSugarLogs) setBloodSugarLogs(parsed.bloodSugarLogs);
      if (parsed.testResults) setTestResults(parsed.testResults);
      if (parsed.dietLogs) setDietLogs(parsed.dietLogs);
      if (parsed.workoutLogs) setWorkoutLogs(parsed.workoutLogs);
      
    } catch (e) {
      console.error("Failed to load local data", e);
    } finally {
      setIsReady(true);
    }
  };

  const saveProfile = async (profile: UserProfile) => {
    setUserProfile(profile);
    await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
  };

  const addBloodSugarLog = async (log: Omit<BloodSugarLog, 'id'>) => {
    const newLog: BloodSugarLog = { ...log, id: generateId() };
    const updated = [newLog, ...bloodSugarLogs];
    setBloodSugarLogs(updated);
    await AsyncStorage.setItem('bloodSugarLogs', JSON.stringify(updated));
  };

  const addTestResult = async (result: Omit<TestResult, 'id'>) => {
    const newResult: TestResult = { ...result, id: generateId() };
    const updated = [newResult, ...testResults];
    setTestResults(updated);
    await AsyncStorage.setItem('testResults', JSON.stringify(updated));
  };

  const addDietLog = async (meal: Omit<MealLog, 'id'>) => {
    const newMeal: MealLog = { ...meal, id: generateId() };
    const updated = [newMeal, ...dietLogs];
    setDietLogs(updated);
    await AsyncStorage.setItem('dietLogs', JSON.stringify(updated));
  };

  const addWorkoutLog = async (workout: Omit<WorkoutLog, 'id'>) => {
    const newWorkout: WorkoutLog = { ...workout, id: generateId() };
    const updated = [newWorkout, ...workoutLogs];
    setWorkoutLogs(updated);
    await AsyncStorage.setItem('workoutLogs', JSON.stringify(updated));
  };

  return (
    <DiabaContext.Provider value={{
      isReady,
      userProfile,
      bloodSugarLogs,
      testResults,
      dietLogs,
      workoutLogs,
      saveProfile,
      addBloodSugarLog,
      addTestResult,
      addDietLog,
      addWorkoutLog
    }}>
      {children}
    </DiabaContext.Provider>
  );
};
