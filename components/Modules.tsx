import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';

// Os dados fornecidos
const categoryData = {
  saude: {
    imagem: 'https://zellosaude.app/wp-content/uploads/2021/05/zello_saudedoenca.png',
    descricao:
      'Explore recursos e informações sobre saúde, com acesso a conteúdos relevantes e atualizados para o seu bem-estar.',
  },
  cultura: {
    imagem:
      'https://arteemcurso.com/wp-content/uploads/2018/09/233552-mapa-da-cultura-conheca-a-plataforma-lancada-pelo-governo-federal-1024x683.png',
    descricao:
      'Descubra a rica cultura brasileira através de uma variedade de plataformas e iniciativas que promovem a arte e o conhecimento cultural.',
  },
  comidas: {
    imagem:
      'https://static.itdg.com.br/images/1200-630/2c4abf585e392b0ff817bd3d0cf4f329/cidades-com-comida-brasileira.jpg',
    descricao:
      'Conheça a diversidade culinária do Brasil, com pratos típicos e receitas que representam a rica tradição gastronômica do país.',
  },
  direitos: {
    imagem: 'https://sinbraf.com.br/wp-content/uploads/2023/12/Direitos-Humanos.png',
    descricao:
      'Informações e recursos sobre direitos humanos e cidadania, promovendo a igualdade e a justiça social para todos.',
  },
};

// Tipagem explícita para categoryData
type CategoryKey = keyof typeof categoryData;
type Category = {
  key: CategoryKey;
  imagem: string;
  descricao: string;
};

// Converte os dados do objeto em um array de objetos
const categories: Category[] = Object.keys(categoryData).map((key) => ({
  key: key as CategoryKey,
  ...categoryData[key as CategoryKey],
}));

const Modules = () => {
  // Função para lidar com o clique no item
  const handleItemPress = (itemKey: string) => {
    Alert.alert('Item Clicado', `Você clicou na categoria: ${itemKey}`);
  };

  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleItemPress(item.key)}>
      <Image source={{ uri: item.imagem }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.key.charAt(0).toUpperCase() + item.key.slice(1)}</Text>
        <Text style={styles.description}>{item.descricao}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={categories}
      renderItem={renderItem}
      keyExtractor={(item) => item.key}
      contentContainerStyle={styles.listContainer}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  list: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
});

export default Modules;
