/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import StackNavigator from './src/navigation/StackNavigator';
import DismissKeyboardView from './src/components/common/DismissKeyboardView';

export default function App() {
  return (
    <SafeAreaProvider>
      <DismissKeyboardView>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </DismissKeyboardView>
    </SafeAreaProvider>
  );
}
