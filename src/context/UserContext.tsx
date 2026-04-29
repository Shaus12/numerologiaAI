import React, { createContext, useState, useEffect, useContext, useCallback, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  clearOnboardingResume,
  loadOnboardingResumeFromStorage,
  ONBOARDING_RESUME_FLAG_KEY,
  ONBOARDING_RESUME_PAYLOAD_KEY,
  type OnboardingResumePayload,
} from '../utils/onboardingResumeStorage';
import { useOnboardingStore } from '../../store/onboardingStore';

// Define the shape of UserProfile
export interface UserProfile {
  name: string;
  birthdate: string; // YYYY-MM-DD
  language: string;
  identity?: string;   // e.g. male, female, non-binary, private
  focus?: string;      // e.g. career, love, spiritual, health
  challenge?: string;  // e.g. purpose, relationships, career, confidence, balance
  profileImageUri?: string;
  [key: string]: any;
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
  /** When true, user quit before subscribing after onboarding analysis — open Paywall on cold start. */
  onboardingResume: { active: boolean; payload: OnboardingResumePayload | null };
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
  const [onboardingResume, setOnboardingResume] = useState<{
    active: boolean;
    payload: OnboardingResumePayload | null;
  }>({ active: false, payload: null });
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

        const hasFullPersisted = !!(storedProfile && storedResults);
        if (hasFullPersisted) {
          await clearOnboardingResume();
          setOnboardingResume({ active: false, payload: null });
        } else {
          const resumed = await loadOnboardingResumeFromStorage();
          if (resumed.active && resumed.payload) {
            useOnboardingStore.setState(resumed.payload);
          }
          setOnboardingResume(
            resumed.active && resumed.payload
              ? { active: true, payload: resumed.payload }
              : { active: false, payload: null },
          );
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
      await AsyncStorage.multiRemove([
        'userProfile',
        'numerologyResults',
        'user_language',
        ONBOARDING_RESUME_FLAG_KEY,
        ONBOARDING_RESUME_PAYLOAD_KEY,
      ]);
      setUserProfile(null);
      setNumerologyResults(null);
      setOnboardingResume({ active: false, payload: null });
    } catch (error) {
      console.error('Failed to clear user data:', error);
      throw error;
    }
  }, []);

  const contextValue = useMemo(() => ({
    userProfile,
    numerologyResults,
    onboardingResume,
    isLoading,
    saveUserProfile,
    saveNumerologyResults,
    clearUserData,
  }), [userProfile, numerologyResults, onboardingResume, isLoading, saveUserProfile, saveNumerologyResults, clearUserData]);

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};
