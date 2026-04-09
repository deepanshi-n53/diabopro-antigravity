import React from 'react';
import { DiabaProvider } from './src/context/DiabaContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <DiabaProvider>
      <AppNavigator />
    </DiabaProvider>
  );
}
