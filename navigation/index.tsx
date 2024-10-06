import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import AddFlashCard from 'screens/AddFlashCards';
import AddFlashCardCategories from 'screens/AddFlashCardsCategories';
import FlashCardsGame from 'screens/FlashCardsGame';
import Profile from 'screens/Profile';

import TabNavigator from './tab-navigator';
import LoginScreen from '../screens/Login';
import OnboardingScreen from '../screens/Onboarding';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  TabNavigator: undefined;
  Modal: undefined;
  Profile: undefined;
  Trails: undefined;
  FlashCardsGame: { categoryId: string };
  AddFlashCard: { categoryId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootStack() {
  // Defina initialRoute como keyof RootStackParamList ou null
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    // Função para verificar o estado de onboarding e se o nome e sobrenome estão salvos
    const checkInitialRoute = async () => {
      try {
        // Verifica se o onboarding já foi visto
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');

        // Verifica se já existem nome e sobrenome salvos
        const firstName = await AsyncStorage.getItem('userFirstName');
        const lastName = await AsyncStorage.getItem('userLastName');

        if (hasSeenOnboarding === 'true' && firstName && lastName) {
          setInitialRoute('TabNavigator'); // Pula o login e vai direto para a home
        } else if (hasSeenOnboarding === 'true') {
          setInitialRoute('Login'); // Se o onboarding foi visto mas não há nome e sobrenome, vai para o login
        } else {
          setInitialRoute('Onboarding'); // Caso contrário, mostra o onboarding
        }
      } catch (error) {
        console.error('Failed to load initial state:', error);
      }
    };

    checkInitialRoute();
  }, []);

  // Mostra um componente de carregamento enquanto verificamos o estado inicial
  if (initialRoute === null) {
    return null; // ou substitua por um componente de carregamento, como <LoadingScreen />
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen
          name="AddFlashCard"
          component={AddFlashCard}
          options={{ title: 'Add Flash Card' }}
        />
        <Stack.Screen
          name="AddFlashCardCategories"
          component={AddFlashCardCategories}
          options={{ title: 'Add Flash Card Categorie' }}
        />
        <Stack.Screen
          name="FlashCardsGame"
          component={FlashCardsGame}
          options={{ title: 'Flash Card' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
