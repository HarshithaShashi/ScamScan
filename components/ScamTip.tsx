import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Colors from '@/constants/Colors';

interface ScamTipProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const ScamTip: React.FC<ScamTipProps> = ({ icon, title, description }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  iconContainer: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Roboto-Bold',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    fontFamily: 'Roboto-Regular',
  },
});