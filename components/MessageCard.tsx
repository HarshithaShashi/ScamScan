import { StyleSheet, View, Text } from 'react-native';
import React from 'react';
import Colors from '@/constants/Colors';

interface MessageCardProps {
  message: string;
  highlightedTerms: string[];
}

const MessageCard: React.FC<MessageCardProps> = ({ message, highlightedTerms }) => {
  const highlightText = (text: string) => {
    if (!highlightedTerms || highlightedTerms.length === 0) {
      return <Text style={styles.messageText}>{text}</Text>;
    }

    // Create a regex pattern from all highlighted terms
    const pattern = new RegExp(`(${highlightedTerms.join('|')})`, 'gi');
    const parts = text.split(pattern);

    return (
      <Text style={styles.messageText}>
        {parts.map((part, index) => {
          const isMatch = highlightedTerms.some(term => 
            part.toLowerCase() === term.toLowerCase()
          );
          
          return isMatch ? (
            <Text key={index} style={styles.highlightedText}>
              {part}
            </Text>
          ) : (
            <Text key={index}>{part}</Text>
          );
        })}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      {highlightText(message)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  messageText: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: 'Roboto-Regular',
  },
  highlightedText: {
    backgroundColor: 'rgba(255, 167, 38, 0.3)',
    borderRadius: 2,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Roboto-Bold',
  },
});

export default MessageCard;