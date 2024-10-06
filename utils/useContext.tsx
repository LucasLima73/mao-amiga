// src/context/UserContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Defina o tipo para o contexto do usuário
type User = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
} | null;

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
  clearUser: () => void;
};

// Cria o contexto do usuário
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);

  // Carrega os dados do usuário ao iniciar o aplicativo
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const firstName = await AsyncStorage.getItem('userFirstName');
        const lastName = await AsyncStorage.getItem('userLastName');
        const email = await AsyncStorage.getItem('userEmail');
        const phone = await AsyncStorage.getItem('userPhone');

        if (firstName && lastName) {
          setUser({ firstName, lastName, email: email || undefined, phone: phone || undefined });
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, []);

  // Função para limpar o estado do usuário
  const clearUser = async () => {
    try {
      await AsyncStorage.clear();
      setUser(null);
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>{children}</UserContext.Provider>
  );
};

// Custom hook para acessar o contexto do usuário
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
