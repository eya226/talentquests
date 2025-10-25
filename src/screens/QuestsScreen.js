import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

const QuestsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Quests Screen - Coming Soon!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.lightText,
  },
});

export default QuestsScreen;
