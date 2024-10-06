// src/screens/AddFlashCardScreen.tsx
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore'; // Importa métodos do Firestore
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';

import { RootStackParamList } from '../../navigation/index';
import { auth, firestore } from '../../utils/firebase'; // Importa a configuração do Firebase

const AddFlashCardCategories = () => {
  const [categorie, setCategorie] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para verificar o carregamento
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleAddFlashCard = async () => {
    if (categorie.trim() === '') {
      Alert.alert('Error', 'Please fill in both sides of the flashcard');
      return;
    }

    setIsLoading(true); // Inicia o carregamento

    try {
      // Obtenha o usuário autenticado
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'User is not authenticated');
        setIsLoading(false);
        return;
      }

      const userId = currentUser.uid;

      // Salva o flashcard no Firestore dentro da coleção do usuário
      await addDoc(collection(firestore, 'users', userId, 'FlashCardsCategories'), {
        categorie,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'FlashCard added successfully!');
      setCategorie('');
    } catch (error) {
      console.error('Failed to save flashcard:', error);
      Alert.alert('Error', 'Failed to save flashcard. Please try again.');
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Adicione uma nova categoria"
        value={categorie}
        onChangeText={setCategorie}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#007aff" />
      ) : (
        <Button title="Adicionar" onPress={handleAddFlashCard} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
});

export default AddFlashCardCategories;
