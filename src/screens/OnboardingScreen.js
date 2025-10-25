import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, FlatList, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
import { useAuth } from '../store/AuthContext';
import apiClient from '../lib/apiClient';
import colors from '../constants/colors';

const studentQuestions = [
  "Tell me about a project you’re proud of.",
  "When code breaks, what’s your first move?",
  "Do you prefer working alone or with others?",
  "What kind of company would you love to join?",
];

const recruiterQuestions = [
  "What makes your best engineer different?",
  "Is speed or quality more important?",
  "How do you handle failure in your team?",
  "Do you value formal degrees or proven skills more?",
];

const OnboardingScreen = () => {
  const [conversation, setConversation] = useState([]);
  const [userResponse, setUserResponse] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, loadUser } = useAuth();

  const userRole = user?.role || 'student';
  const questions = userRole === 'student' ? studentQuestions : recruiterQuestions;

  const handleStartTalking = () => {
    setConversation([{ type: 'aria', text: questions[0] }]);
  };

  const handleResponseSubmit = async () => {
    if (!userResponse) return;
    const newConversation = [...conversation, { type: 'user', text: userResponse }];
    const responseText = userResponse;
    setUserResponse('');

    if (currentQuestionIndex < questions.length - 1) {
      newConversation.push({ type: 'aria', text: questions[currentQuestionIndex + 1] });
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setLoading(true);
      newConversation.push({ type: 'aria', text: 'Building your Digital Identity...' });

      // Save onboarding data
      try {
        await apiClient.put('/profile', {
          onboarding_complete: true,
          // TODO: Add AI processing for skills, traits, and vision
          skills: [responseText], // Placeholder
        });
        await loadUser(); // Refresh user data
      } catch (err) {
        console.error('Failed to save onboarding data', err);
        setLoading(false);
      }
    }
    setConversation(newConversation);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <LottieView
          source={require('../../assets/aria-animation.json')} // Placeholder
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>

      {conversation.length === 0 ? (
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Hi, I’m Aria. Let’s build your future — in 10 minutes. No forms. Just conversation.</Text>
          <TouchableOpacity style={styles.startButton} onPress={handleStartTalking}>
            <Text style={styles.startButtonText}>Start Talking</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={conversation}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.type === 'user' ? styles.userBubble : styles.ariaBubble]}>
              <Text style={styles.bubbleText}>{item.text}</Text>
            </View>
          )}
          style={styles.chatContainer}
        />
      )}

      {loading && <ActivityIndicator size="large" color={colors.neonBlue} />}

      {conversation.length > 0 && !loading && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={userResponse}
            onChangeText={setUserResponse}
            placeholder="Say something..."
            placeholderTextColor={colors.gray}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleResponseSubmit}>
            <Text style={styles.sendButtonText}>➤</Text>
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
    },
    header: {
        alignItems: 'center',
        padding: 10,
    },
    lottie: {
        width: 100,
        height: 100,
    },
    welcomeContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    welcomeText: {
        color: colors.lightText,
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 30,
    },
    startButton: {
        backgroundColor: colors.quantumPurple,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
    },
    startButtonText: {
        color: colors.lightText,
        fontSize: 18,
        fontWeight: 'bold',
    },
    chatContainer: {
        flex: 1,
        padding: 10,
    },
    bubble: {
        padding: 15,
        borderRadius: 20,
        marginBottom: 10,
        maxWidth: '80%',
    },
    userBubble: {
        backgroundColor: colors.neonBlue,
        alignSelf: 'flex-end',
    },
    ariaBubble: {
        backgroundColor: '#374151',
        alignSelf: 'flex-start',
    },
    bubbleText: {
        color: colors.lightText,
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#374151',
        color: colors.lightText,
        padding: 15,
        borderRadius: 20,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: colors.quantumPurple,
        padding: 15,
        borderRadius: 50,
    },
    sendButtonText: {
        color: colors.lightText,
        fontSize: 18,
    },
});

export default OnboardingScreen;
