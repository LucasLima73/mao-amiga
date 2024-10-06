import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { View, Text, Image, StyleSheet, Button, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';

interface OnboardingScreenProps {
  navigation: any;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const slides = [
    {
      key: '1',
      title: 'Welcome to Our App',
      text: 'Discover new features and possibilities!',
      image: require('../../assets/icon.png'),
    },
    {
      key: '2',
      title: 'Stay Connected',
      text: 'Stay updated with your interests',
      image: require('../../assets/icon.png'),
    },
    {
      key: '3',
      title: 'Get Started',
      text: 'Join us and explore!',
      image: require('../../assets/icon.png'),
    },
  ];

  // Função que será chamada quando o usuário finalizar o onboarding
  const completeOnboarding = async () => {
    try {
      // Salva a conclusão do onboarding
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      navigation.replace('Login');
    } catch (error) {
      console.error('Failed to save onboarding state:', error);
    }
  };

  return (
    <Swiper loop={false} activeDotColor="#007aff">
      {slides.map((slide) => (
        <View style={styles.slide} key={slide.key}>
          <Image source={slide.image} style={styles.image} />
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.text}>{slide.text}</Text>
          {slide.key === '3' && <Button title="Get Started" onPress={completeOnboarding} />}
        </View>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  image: {
    width: Dimensions.get('window').width * 0.7,
    height: Dimensions.get('window').width * 0.7,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default OnboardingScreen;
