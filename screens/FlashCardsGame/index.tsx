// src/screens/FlashCardsGame.tsx
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';
import { collection, query, getDocs } from 'firebase/firestore';
import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

import { RootStackParamList } from '../../navigation/index';
import { auth, firestore } from '../../utils/firebase';

type FlashCard = {
  id: string;
  front: string;
  back: string;
};

type FlashCardCategoryRouteProp = RouteProp<RootStackParamList, 'FlashCardsGame'>;

const FlashCardsGame = () => {
  const [flashCards, setFlashCards] = useState<FlashCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  const route = useRoute<FlashCardCategoryRouteProp>();
  const { categoryId } = route.params; // Recebe o ID da categoria
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const loadFlashCardsFromFirestore = async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('User not authenticated');
        return;
      }

      const userId = currentUser.uid;
      const flashCardsRef = collection(
        firestore,
        'users',
        userId,
        'FlashCardsCategories',
        categoryId,
        'flashcards'
      );
      const q = query(flashCardsRef);

      const querySnapshot = await getDocs(q);
      const flashCardsFromFirestore: FlashCard[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        front: doc.data().front,
        back: doc.data().back,
      }));

      setFlashCards([...flashCardsFromFirestore]);
    } catch (error) {
      console.error('Failed to load flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar FlashCards da categoria toda vez que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadFlashCardsFromFirestore();
    }, [])
  );

  const handleCardPress = () => {
    setShowBack(!showBack);
  };

  const handleNextCard = () => {
    setShowBack(false);
    if (currentCardIndex < flashCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0); // Retornar ao primeiro card
    }
  };

  const handlePreviousCard = () => {
    setShowBack(false);
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    } else {
      setCurrentCardIndex(flashCards.length - 1); // Vai para o último card
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007aff" />
      ) : flashCards.length === 0 ? (
        <Text style={styles.noCardsText}>Nenhum FlashCard encontrado. Adicione alguns!</Text>
      ) : (
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card} onPress={handleCardPress}>
            <Text style={styles.cardText}>
              {showBack ? flashCards[currentCardIndex].back : flashCards[currentCardIndex].front}
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.controlButton} onPress={handlePreviousCard}>
              <Text style={styles.controlButtonText}>Anterior</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={handleCardPress}>
              <Text style={styles.controlButtonText}>
                {showBack ? 'Mostrar Pergunta' : 'Mostrar Resposta'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={handleNextCard}>
              <Text style={styles.controlButtonText}>Próximo</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddFlashCard', { categoryId })}>
        <Text style={styles.addButtonText}>Adicionar mais FlashCards</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noCardsText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 300,
    height: 250,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    padding: 20,
    marginBottom: 20,
  },
  cardText: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  controlButton: {
    backgroundColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007aff',
    padding: 15,
    borderRadius: 30,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FlashCardsGame;
