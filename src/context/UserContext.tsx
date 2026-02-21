import React, { createContext, useState, useEffect, useContext, useCallback, useMemo, ReactNode } from 'react';
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

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [numerologyResults, setNumerologyResults] = useState<NumerologyResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedProfile, storedResults] = await Promise.all([
          AsyncStorage.getItem('userProfile'),
          AsyncStorage.getItem('numerologyResults')
        ]);

        if (storedProfile) {
          try {
            const parsed = JSON.parse(storedProfile);
            if (parsed && typeof parsed === 'object') {
              setUserProfile(parsed);
            }
          } catch (pe) {
            console.error('Failed to parse userProfile JSON:', pe);
          }
        }

        if (storedResults) {
          try {
            const parsed = JSON.parse(storedResults);
            if (parsed && typeof parsed === 'object') {
              setNumerologyResults(parsed);
            }
          } catch (pe) {
            console.error('Failed to parse numerologyResults JSON:', pe);
          }
        }
      } catch (error) {
        console.error('Failed to load user data from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const saveUserProfile = useCallback(async (profile: UserProfile) => {
    try {
      if (!profile) return;
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to save user profile:', error);
      throw error;
    }
  }, []);

  const saveNumerologyResults = useCallback(async (results: NumerologyResults) => {
    try {
      if (!results) return;
      await AsyncStorage.setItem('numerologyResults', JSON.stringify(results));
      setNumerologyResults(results);
    } catch (error) {
      console.error('Failed to save numerology results:', error);
      throw error;
    }
  }, []);

  const clearUserData = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove(['userProfile', 'numerologyResults', 'user_language']);
      setUserProfile(null);
      setNumerologyResults(null);
    } catch (error) {
      console.error('Failed to clear user data:', error);
      throw error;
    }
  }, []);

  const contextValue = useMemo(() => ({
    userProfile,
    numerologyResults,
    isLoading,
    saveUserProfile,
    saveNumerologyResults,
    clearUserData,
  }), [userProfile, numerologyResults, isLoading, saveUserProfile, saveNumerologyResults, clearUserData]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
