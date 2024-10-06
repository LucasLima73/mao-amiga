import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

const steps = [
  {
    step: 1,
    title: 'Obter o Cartão do SUS',
    description: 'Para acessar o sistema de saúde, primeiro obtenha seu cartão do SUS.',
    icon: require('../../assets/icon.png'), // Substitua pelo caminho correto do ícone
  },
  {
    step: 2,
    title: 'Ir a um Posto de Saúde',
    description: 'Visite o posto de saúde mais próximo para consultas e orientações.',
    icon: require('../../assets/icon.png'), // Substitua pelo caminho correto do ícone
  },
  {
    step: 3,
    title: 'Consulta Médica',
    description: 'Agende uma consulta com um médico para obter atendimento.',
    icon: require('../../assets/icon.png'), // Substitua pelo caminho correto do ícone
  },
];

const Trails = () => {
  const navigation = useNavigation();

  const renderStep = (
    stepItem: { step: number; title: string; description: string; icon: any },
    index: number // Corrigido para 'number'
  ) => (
    <View key={index} style={styles.stepContainer}>
      <View style={styles.stepNumberContainer}>
        <Text style={styles.stepNumber}>{stepItem.step}</Text>
      </View>
      <View style={styles.stepContent}>
        <Image source={stepItem.icon} style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.stepTitle}>{stepItem.title}</Text>
          <Text style={styles.stepDescription}>{stepItem.description}</Text>
        </View>
      </View>
      {index < steps.length - 1 && <View style={styles.connector} />}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Como acessar a Saúde no Brasil</Text>
      {steps.map((stepItem, index) => renderStep(stepItem, index))}
      <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('NextScreen')}>
        <Text style={styles.nextButtonText}>Próximo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  stepContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  stepNumberContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    elevation: 2,
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
  },
  connector: {
    width: 2,
    height: 30,
    backgroundColor: '#4CAF50',
    marginVertical: 5,
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Trails;
