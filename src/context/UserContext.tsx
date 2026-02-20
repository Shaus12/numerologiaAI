import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of UserProfile
export interface UserProfile {
  name: string;
  birthdate: string; // YYYY-MM-DD
  birthTime?: string;
  language: string;
  gender?: string;
  [key: string]: any; // For flexibility
}

// Define the shape of NumerologyResults
export interface NumerologyResults {
  lifePath: number | string;
  destiny: number | string;
  soulUrge: number | string;
  personality: number | string;
  reading?: string;
  personalYear?: number | string;
  dailyNumber?: number | string;
  [key: string]: any; // For flexibility
}

interface UserContextType {
  userProfile: UserProfile | null;
  numerologyResults: NumerologyResults | null;
  isLoading: boolean;
  saveUserProfile: (profile: UserProfile) => Promise<void>;
  saveNumerologyResults: (results: NumerologyResults) => Promise<void>;
  clearUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [numerologyResults, setNumerologyResults] = useState<NumerologyResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('userProfile');
        const storedResults = await AsyncStorage.getItem('numerologyResults');

        if (storedProfile) {
          setUserProfile(JSON.parse(storedProfile));
        }

        if (storedResults) {
          setNumerologyResults(JSON.parse(storedResults));
        }
      } catch (error) {
        console.error('Failed to load user data from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const saveUserProfile = async (profile: UserProfile) => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to save user profile:', error);
      throw error;
    }
  };

  const saveNumerologyResults = async (results: NumerologyResults) => {
    try {
      await AsyncStorage.setItem('numerologyResults', JSON.stringify(results));
      setNumerologyResults(results);
    } catch (error) {
      console.error('Failed to save numerology results:', error);
      throw error;
    }
  };

  const clearUserData = async () => {
    try {
      await AsyncStorage.clear();
      setUserProfile(null);
      setNumerologyResults(null);
    } catch (error) {
      console.error('Failed to clear user data:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        userProfile,
        numerologyResults,
        isLoading,
        saveUserProfile,
        saveNumerologyResults,
        clearUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
