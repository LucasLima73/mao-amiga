import { Feather } from '@expo/vector-icons'; // Certifique-se de ter o pacote @expo/vector-icons instalado
import React from 'react';
import { View, Text, Image, TextInput, StyleSheet } from 'react-native';

const Card = () => {
  return (
    <View style={styles.container}>
      {/* Header Text and Image */}
      <View style={styles.headerContent}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Help Handing</Text>
          <Text style={styles.description}>Um aplicativo para você.</Text>
        </View>
        <Image source={require('../assets/helping_hand.png')} style={styles.image} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Pesquisar" placeholderTextColor="#999" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#53a08e', // Background color similar to your design
    padding: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 24,
    color: '#F4CE14', // Little Lemon yellow color
    fontWeight: 'bold',
  },
  location: {
    fontSize: 18,
    color: '#fff',
    marginVertical: 4,
  },
  description: {
    fontSize: 14,
    color: '#fff',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#333',
  },
});

export default Card;
