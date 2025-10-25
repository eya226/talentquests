import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import colors from '../constants/colors';

const BottomNav = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={styles.tab}>
        <Text style={styles.tabText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Quests')} style={styles.tab}>
        <Text style={styles.tabText}>Quests</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Network')} style={styles.tab}>
        <Text style={styles.tabText}>Network</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.tab}>
        <Text style={styles.tabText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: colors.darkBg,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: colors.lightText,
  },
});

export default BottomNav;
