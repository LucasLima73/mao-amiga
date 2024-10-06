import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { signInAnonymously } from 'firebase/auth'; // Importa o método para autenticação anônima
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; // Importa métodos do Firestore
import { RootStackParamList } from 'navigation';
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator, // Importa o ActivityIndicator
} from 'react-native';
import PagerView from 'react-native-pager-view';

import { auth, firestore } from '../../utils/firebase';

const LoginScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Adiciona o estado de carregamento
  const viewPagerRef = useRef<PagerView>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const isFirstNameValid = firstName.trim().length > 0;
  const isLastNameValid = lastName.trim().length > 0;

  const handleNextPress = (pageIndex: number) => {
    if (pageIndex === 1 && !isFirstNameValid) {
      setErrorMessage('Please enter your first name.');
      return;
    }
    setErrorMessage('');
    viewPagerRef.current?.setPage(pageIndex);
  };

  const handleSubmit = async () => {
    if (!isLastNameValid) {
      setErrorMessage('Please enter your last name.');
      return;
    }
    setErrorMessage('');
    setIsLoading(true); // Inicia o carregamento

    try {
      // Salva o nome e sobrenome no AsyncStorage
      await AsyncStorage.setItem('userFirstName', firstName);
      await AsyncStorage.setItem('userLastName', lastName);

      // Cria o usuário anonimamente no Firebase usando o SDK web
      const userCredential = await signInAnonymously(auth);
      const uid = userCredential.user.uid;
      console.log('User created with Firebase:', userCredential);

      // Salva os dados do usuário no Firestore
      await setDoc(doc(firestore, 'users', uid), {
        firstName,
        lastName,
        createdAt: serverTimestamp(), // Armazena o timestamp do servidor
      });

      console.log('User data saved to Firestore');

      // Redefine a navegação e navega para a tela TabNavigator
      navigation.reset({
        index: 0,
        routes: [{ name: 'TabNavigator' }],
      });
    } catch (error) {
      console.error('Failed to create user in Firebase:', error);
      setErrorMessage('Failed to create user. Please try again.');
    } finally {
      setIsLoading(false); // Termina o carregamento
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          source={require('../../assets/icon.png')}
          accessible
          accessibilityLabel="Helping Hand Logo"
        />
      </View>
      <Text style={styles.welcomeText}>Let us get to know you</Text>
      <PagerView style={styles.viewPager} scrollEnabled={false} initialPage={0} ref={viewPagerRef}>
        {/* Primeiro Nome */}
        <View style={styles.page} key="1">
          <View style={styles.pageContainer}>
            <Text style={styles.text}>First Name</Text>
            <TextInput
              style={styles.inputBox}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
            />
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
          </View>
          <View style={styles.pageIndicator}>
            <View style={[styles.pageDot, styles.pageDotActive]} />
            <View style={styles.pageDot} />
          </View>
          <Pressable
            style={[styles.btn, isFirstNameValid ? null : styles.btnDisabled]}
            onPress={() => handleNextPress(1)}>
            <Text style={styles.btntext}>Next</Text>
          </Pressable>
        </View>

        {/* Sobrenome */}
        <View style={styles.page} key="2">
          <View style={styles.pageContainer}>
            <Text style={styles.text}>Last Name</Text>
            <TextInput
              style={styles.inputBox}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
            />
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
          </View>
          <View style={styles.pageIndicator}>
            <View style={styles.pageDot} />
            <View style={[styles.pageDot, styles.pageDotActive]} />
          </View>
          <View style={styles.buttons}>
            <Pressable style={styles.halfBtn} onPress={() => viewPagerRef.current?.setPage(0)}>
              <Text style={styles.btntext}>Back</Text>
            </Pressable>

            {/* Exibe o indicador de carregamento ou o botão de submit */}
            {isLoading ? (
              <View style={[styles.halfBtn, { justifyContent: 'center' }]}>
                <ActivityIndicator color="#fff" />
              </View>
            ) : (
              <Pressable
                style={[styles.halfBtn, isLastNameValid ? null : styles.btnDisabled]}
                onPress={handleSubmit}>
                <Text style={styles.btntext}>Submit</Text>
              </Pressable>
            )}
          </View>
        </View>
      </PagerView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  welcomeText: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
  viewPager: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageContainer: {
    width: '80%',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  btn: {
    marginTop: 20,
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 5,
  },
  btnDisabled: {
    backgroundColor: '#ccc',
  },
  btntext: {
    color: '#fff',
    textAlign: 'center',
  },
  pageIndicator: {
    flexDirection: 'row',
    marginTop: 20,
  },
  pageDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    margin: 5,
  },
  pageDotActive: {
    backgroundColor: '#007aff',
  },
  halfBtn: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    backgroundColor: '#007aff',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
  },
});

export default LoginScreen;
