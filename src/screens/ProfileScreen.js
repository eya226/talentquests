import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { useAuth } from '../store/AuthContext';
import colors from '../constants/colors';
import BottomNav from '../components/BottomNav';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <ActivityIndicator size="large" color={colors.neonBlue} />;
  }

  const { level = 1, xp = 0, skills = [], achievements = [], traits = [], vision = {} } = user;
  const xpToNextLevel = 1000;
  const title = 'Bug Hunter'; // Placeholder

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{title} • Level {level}</Text>
          <Text style={styles.subtitle}>{xp} Total XP • {xp}/{xpToNextLevel} to next level</Text>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${(xp / xpToNextLevel) * 100}%` }]} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Skills</Text>
          <View style={styles.badgeContainer}>
            {skills.map(skill => (
              <View key={skill} style={styles.badge}>
                <Text>💡 {skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {achievements.map(ach => (
              <View key={ach.name} style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>{ach.icon}</Text>
                <Text>{ach.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Traits</Text>
          <View style={styles.badgeContainer}>
            {traits.map(trait => (
              <View key={trait} style={styles.badge}>
                <Text>🧬 {trait}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Vision</Text>
          <View style={styles.visionCard}>
            <Text>Dream Companies: {vision.companies?.join(', ')}</Text>
            <Text>Salary Goal: {vision.salaryGoal} TND/month</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNav />
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
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.lightText,
    },
    subtitle: {
        color: colors.gray,
    },
    xpBar: {
        width: '100%',
        height: 10,
        backgroundColor: '#374151',
        borderRadius: 5,
        marginTop: 10,
    },
    xpFill: {
        height: 10,
        backgroundColor: colors.neonBlue,
        borderRadius: 5,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.lightText,
        marginBottom: 10,
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    badge: {
        backgroundColor: '#374151',
        padding: 10,
        borderRadius: 20,
        margin: 5,
    },
    achievementCard: {
        backgroundColor: '#374151',
        padding: 20,
        borderRadius: 10,
        marginRight: 10,
        alignItems: 'center',
    },
    achievementIcon: {
        fontSize: 40,
    },
    visionCard: {
        backgroundColor: '#374151',
        padding: 20,
        borderRadius: 10,
    },
    logoutButton: {
        backgroundColor: colors.neonBlue,
        padding: 15,
        borderRadius: 10,
        margin: 20,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: colors.lightText,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
