import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const flashcards = [
  {
    question: 'How to say thank you in Portuguese?',
    answer:
      'React Native é uma estrutura de desenvolvimento de aplicativos móveis baseada em JavaScript e React.',
  },
  {
    question: 'O que é um componente?',
    answer: 'Um componente é uma parte independente e reutilizável da interface do usuário.',
  },
  {
    question: 'O que é um hook em React?',
    answer:
      'Hooks são funções especiais que permitem usar estado e outros recursos do React sem escrever uma classe.',
  },
];

const TabTwoScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
    }
  };

  const toggleCard = () => {
    setShowAnswer(!showAnswer);
  };

  const currentCard = flashcards[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardText}>
          {showAnswer ? currentCard.answer : currentCard.question}
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={toggleCard}>
        <Text style={styles.buttonText}>
          {showAnswer ? 'Mostrar Pergunta' : 'Mostrar Resposta'}
        </Text>
      </TouchableOpacity>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.disabledButton]}
          onPress={handlePrev}
          disabled={currentIndex === 0}>
          <Text style={styles.buttonText}>Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === flashcards.length - 1 && styles.disabledButton,
          ]}
          onPress={handleNext}
          disabled={currentIndex === flashcards.length - 1}>
          <Text style={styles.buttonText}>Próximo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    height: 250,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  navButton: {
    flex: 1,
    backgroundColor: '#007aff',
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default TabTwoScreen;
