import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScamHistoryItem } from '@/types/scamTypes';

const HISTORY_STORAGE_KEY = 'scam_history';

export function useScamHistory() {
  const [history, setHistory] = useState<ScamHistoryItem[]>([]);
  
  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);
  
  // Load history from storage
  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load history', error);
    }
  };
  
  // Save history to storage
  const saveHistory = async (newHistory: ScamHistoryItem[]) => {
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save history', error);
    }
  };
  
  // Add item to history
  const addToHistory = (item: ScamHistoryItem) => {
    const updatedHistory = [item, ...history];
    setHistory(updatedHistory);
    saveHistory(updatedHistory);
  };
  
  // Remove item from history
  const removeHistoryItem = (id: string) => {
    const updatedHistory = history.filter(item => item.id !== id);
    setHistory(updatedHistory);
    saveHistory(updatedHistory);
  };
  
  // Clear all history
  const clearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };
  
  return {
    history,
    addToHistory,
    removeHistoryItem,
    clearHistory,
  };
}