import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useAuth } from '../store/AuthContext';
import colors from '../constants/colors';

const LoginScreen = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const { login, signup } = useAuth();

  const handleSignIn = async () => {
    try {
      await login(email, password);
    } catch (err) {
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
    }
  };

  const handleSignUp = async () => {
    try {
      await signup(email, password, role);
      Alert.alert('Signup Successful!', 'Please log in with your new account.');
    } catch (err) {
      Alert.alert('Signup Failed', 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, role === 'student' && styles.activeButton]}
          onPress={() => setRole('student')}
        >
          <Text style={styles.toggleText}>I’m a Student</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, role === 'recruiter' && styles.activeButton]}
          onPress={() => setRole('recruiter')}
        >
          <Text style={styles.toggleText}>I’m a Recruiter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.welcomeContainer}>
        <Text style={styles.title}>Welcome to TalentQuest</Text>
        <Text style={styles.subtitle}>Your career starts as a game</Text>
      </View>

      <TouchableOpacity onPress={() => setShowEmailForm(!showEmailForm)}>
        <Text style={styles.continueText}>Continue with Email</Text>
      </TouchableOpacity>

      {showEmailForm && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder={role === 'recruiter' ? 'Enter your work email' : 'Enter your email'}
            placeholderTextColor={colors.gray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={colors.gray}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signInButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#374151',
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: colors.quantumPurple,
  },
  toggleText: {
    color: colors.lightText,
    fontWeight: 'bold',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.lightText,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: colors.gray,
  },
  continueText: {
    color: colors.gray,
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#374151',
    color: colors.lightText,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  signInButton: {
    backgroundColor: colors.quantumPurple,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: colors.neonBlue,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  signInButtonText: {
    color: colors.lightText,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LoginScreen;
