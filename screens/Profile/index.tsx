import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, TouchableOpacity, Text, Image } from 'react-native';

export default function Profile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedFirstName = await AsyncStorage.getItem('userFirstName');
        const storedLastName = await AsyncStorage.getItem('userLastName');
        const storedEmail = await AsyncStorage.getItem('userEmail');
        const storedPhone = await AsyncStorage.getItem('userPhone');

        if (storedFirstName) setFirstName(storedFirstName);
        if (storedLastName) setLastName(storedLastName);
        if (storedEmail) setEmail(storedEmail);
        if (storedPhone) setPhone(storedPhone);
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('userFirstName', firstName);
      await AsyncStorage.setItem('userLastName', lastName);
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userPhone', phone);

      Alert.alert('Sucesso', 'Seu perfil foi atualizado!');
    } catch (error) {
      console.error('Falha ao salvar os dados do usuário:', error);
      Alert.alert('Erro', 'Falha ao salvar seu perfil. Por favor, tente novamente.');
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Login com Google', 'Você clicou em login com Google!');
  };

  const handleFacebookLogin = () => {
    Alert.alert('Login com Facebook', 'Você clicou em login com Facebook!');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // Limpa todos os dados armazenados
      Alert.alert('Sucesso', 'Você saiu com sucesso!');

      // Redefine a navegação para a tela de Login
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Falha ao sair:', error);
      Alert.alert('Erro', 'Falha ao sair. Por favor, tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          value={phone}
          keyboardType="phone-pad"
          onChangeText={setPhone}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.socialLoginContainer}>
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <Image
            source={require('../../assets/icon.png')} // Use o caminho correto para o ícone do Google
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Login com Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.facebookButton} onPress={handleFacebookLogin}>
          <Image
            source={require('../../assets/icon.png')} // Use o caminho correto para o ícone do Facebook
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>Login com Facebook</Text>
        </TouchableOpacity>
      </View>

      {/* Botão de logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  form: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
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
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialLoginContainer: {
    marginTop: 30,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DB4437',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  facebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b5998',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#ff4444',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
