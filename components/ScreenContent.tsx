import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({ title, path, children }: ScreenContentProps) => {
  const [userFullName, setUserFullName] = useState<string | null>(null);

  useEffect(() => {
    // Função para carregar o nome e sobrenome do AsyncStorage
    const loadUserData = async () => {
      try {
        const firstName = await AsyncStorage.getItem('userFirstName');
        const lastName = await AsyncStorage.getItem('userLastName');

        if (firstName && lastName) {
          setUserFullName(`${firstName} ${lastName}`);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {userFullName && <Text style={styles.userName}>Hello, {userFullName}!</Text>}
      <View style={styles.separator} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  separator: {
    backgroundColor: '#d1d5db',
    height: 1,
    marginVertical: 30,
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    marginVertical: 10,
    fontStyle: 'italic',
  },
});
