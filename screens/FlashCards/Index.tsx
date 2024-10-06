// src/screens/FlashCardsScreen.tsx
import { useNavigation, NavigationProp, useFocusEffect } from '@react-navigation/native';
import { collection, query, getDocs } from 'firebase/firestore';
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import { RootStackParamList } from '../../navigation/index';
import { auth, firestore } from '../../utils/firebase';

type FlashCardCategory = {
  id: string;
  categorie: string;
};

const FlashCardsScreen = () => {
  const [flashCardCategories, setFlashCardCategories] = useState<FlashCardCategory[]>([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const loadCategoriesFromFirestore = async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('User not authenticated');
        return;
      }

      const userId = currentUser.uid;
      const categoriesRef = collection(firestore, 'users', userId, 'FlashCardsCategories');
      const q = query(categoriesRef);

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        console.log('Fetched document:', doc.id, doc.data());
      });

      const categoriesFromFirestore: FlashCardCategory[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        categorie: doc.data().categorie,
      }));

      setFlashCardCategories([...categoriesFromFirestore]);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCategoriesFromFirestore();
    }, [])
  );

  const renderItem = ({ item }: { item: FlashCardCategory }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('FlashCardsGame', { categoryId: item.id })}>
      <Text style={styles.cardTitle}>{item.categorie || 'Sem título'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007aff" />
      ) : (
        <FlatList
          data={flashCardCategories}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddFlashCardCategories')}>
        <Text style={styles.addButtonText}>Adicione uma nova categoria</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
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

export default FlashCardsScreen;
