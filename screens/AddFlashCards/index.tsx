// src/screens/AddFlashCardScreen.tsx
import { useRoute, RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { collection, addDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';

import { RootStackParamList } from '../../navigation/index';
import { auth, firestore } from '../../utils/firebase';

type AddFlashCardRouteProp = RouteProp<RootStackParamList, 'AddFlashCard'>;

const AddFlashCard = () => {
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const route = useRoute<AddFlashCardRouteProp>();
  const { categoryId } = route.params; // Obtém o ID da categoria passado pela navegação
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleAddFlashCard = async () => {
    if (frontText.trim() === '' || backText.trim() === '') {
      Alert.alert('Error', 'Please fill in both sides of the flashcard');
      return;
    }

    setIsLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert('Error', 'User is not authenticated');
        setIsLoading(false);
        return;
      }

      const userId = currentUser.uid;

      // Salva o flashcard na categoria específica no Firestore
      await addDoc(
        collection(firestore, 'users', userId, 'FlashCardsCategories', categoryId, 'flashcards'),
        {
          front: frontText,
          back: backText,
          createdAt: new Date(),
        }
      );

      Alert.alert('Success', 'FlashCard added successfully!');
      setFrontText('');
      setBackText('');

      // Retornar para a tela anterior
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save flashcard:', error);
      Alert.alert('Error', 'Failed to save flashcard. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Front of the flashcard"
        value={frontText}
        onChangeText={setFrontText}
      />
      <TextInput
        style={styles.input}
        placeholder="Back of the flashcard"
        value={backText}
        onChangeText={setBackText}
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#007aff" />
      ) : (
        <Button title="Add FlashCard" onPress={handleAddFlashCard} />
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

export default AddFlashCard;
