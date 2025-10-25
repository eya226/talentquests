import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar } from 'react-native';
import colors from '../constants/colors';
import BottomNav from '../components/BottomNav';

const mockJobs = [
  { id: '1', company: 'TechCorp', title: 'Junior Backend Developer', salary: '3,800 TND/month', match: 88, skills: ['Node.js', 'PostgreSQL'] },
  { id: '2', company: 'Innovate Inc.', title: 'Frontend Developer', salary: '4,200 TND/month', match: 92, skills: ['React', 'TypeScript', 'Tailwind'] },
  { id: '3', company: 'Data Solutions', title: 'DevOps Engineer', salary: '5,500 TND/month', match: 75, skills: ['Docker', 'Kubernetes', 'AWS'] },
];

const JobCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.company}>{item.company}</Text>
      <Text style={[styles.match, item.match >= 85 && styles.highMatch]}>{item.match}% Match</Text>
    </View>
    <Text style={styles.title}>{item.title}</Text>
    <Text style={styles.salary}>{item.salary}</Text>
    <View style={styles.skillsContainer}>
      {item.skills.map(skill => (
        <View key={skill} style={styles.skillBadge}>
          <Text style={styles.skillText}>{skill}</Text>
        </View>
      ))}
    </View>
  </View>
);

const DashboardScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Jobs for You</Text>
      </View>
      <FlatList
        data={mockJobs}
        renderItem={({ item }) => <JobCard item={item} />}
        keyExtractor={item => item.id}
        style={styles.list}
      />
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTitle: {
    color: colors.lightText,
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    margin: 10,
    borderWidth: 2,
    borderColor: colors.quantumPurple,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  company: {
    fontWeight: 'bold',
    color: colors.darkText,
  },
  match: {
    fontWeight: 'bold',
    color: colors.darkText,
  },
  highMatch: {
    color: 'gold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.darkText,
  },
  salary: {
    marginBottom: 10,
    color: colors.gray,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    backgroundColor: '#eee',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  skillText: {
    color: colors.darkText,
  },
});

export default DashboardScreen;
