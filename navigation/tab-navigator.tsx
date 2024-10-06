import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { TabBarIcon } from 'components/TabBarIcon';
import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import FlashCards from 'screens/FlashCards/Index';
import Trails from 'screens/Trails';

import { RootStackParamList } from '.';
import Home from '../screens/Home';

const Tab = createBottomTabNavigator();

type Props = StackScreenProps<RootStackParamList, 'TabNavigator'>;

export default function TabLayout({ navigation }: Props) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Função para carregar as iniciais do usuário
  useEffect(() => {
    const loadUserAvatar = async () => {
      try {
        const firstName = await AsyncStorage.getItem('userFirstName');
        const lastName = await AsyncStorage.getItem('userLastName');

        if (firstName && lastName) {
          // Constrói a URL da imagem do avatar com as iniciais
          const avatarUrl = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`;
          setAvatarUrl(avatarUrl);
        }
      } catch (error) {
        console.error('Failed to load user initials:', error);
      }
    };

    loadUserAvatar();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: '#999', // Cor para ícones inativos
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={focused ? 'black' : '#999'} /> // Use a cor baseada no estado 'focused'
          ),
          headerRight: () =>
            avatarUrl ? (
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Image
                  source={{ uri: avatarUrl }}
                  style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                />
              </TouchableOpacity>
            ) : null,
        }}
      />
      <Tab.Screen
        name="FlashCards"
        component={FlashCards}
        options={{
          title: 'Flash Cards',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name="cards"
              size={24}
              color={focused ? 'black' : '#999'} // Cor do ícone muda ao focar
            />
          ),
        }}
      />
      <Tab.Screen
        name="Trails"
        component={Trails}
        options={{
          title: 'Trilhas',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="trail-sign"
              size={24}
              color={focused ? 'black' : '#999'} // Cor do ícone muda ao focar
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
