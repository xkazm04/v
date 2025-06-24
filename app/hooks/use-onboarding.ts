'use client';

import { useState, useEffect } from 'react';

interface UserPreferences {
  countries: string[];
  categories: string[];
  theme: 'light' | 'dark';
}

const ONBOARDING_KEY = 'has_completed_onboarding';
const PREFERENCES_KEY = 'user_preferences';

export function useOnboarding() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      // Check if user has completed onboarding
      const completed = localStorage.getItem(ONBOARDING_KEY);
      const preferences = localStorage.getItem(PREFERENCES_KEY);

      setHasCompletedOnboarding(completed === 'true');
      
      // ✅ FIXED: Proper null/undefined checking and error handling
      if (preferences && preferences !== 'undefined' && preferences !== 'null') {
        try {
          const parsedPreferences = JSON.parse(preferences);
          // Validate that the parsed object has the expected structure
          if (parsedPreferences && typeof parsedPreferences === 'object') {
            setUserPreferences(parsedPreferences);
          } else {
            console.warn('Invalid preferences structure, resetting...');
            setUserPreferences(null);
            localStorage.removeItem(PREFERENCES_KEY);
          }
        } catch (parseError) {
          console.error('Failed to parse user preferences:', parseError);
          setUserPreferences(null);
          // Clean up corrupted data
          localStorage.removeItem(PREFERENCES_KEY);
        }
      } else {
        setUserPreferences(null);
      }
    } catch (error) {
      console.error('Error loading onboarding data:', error);
      setHasCompletedOnboarding(false);
      setUserPreferences(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completeOnboarding = (preferences: UserPreferences) => {
    try {
      localStorage.setItem(ONBOARDING_KEY, 'true');
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
      setHasCompletedOnboarding(true);
      setUserPreferences(preferences);
    } catch (error) {
      console.error('Failed to save onboarding preferences:', error);
    }
  };

  const skipOnboarding = () => {
    try {
      localStorage.setItem(ONBOARDING_KEY, 'true');
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Failed to save onboarding skip:', error);
    }
  };

  const resetOnboarding = () => {
    try {
      localStorage.removeItem(ONBOARDING_KEY);
      localStorage.removeItem(PREFERENCES_KEY);
      setHasCompletedOnboarding(false);
      setUserPreferences(null);
    } catch (error) {
      console.error('Failed to reset onboarding:', error);
    }
  };

  return {
    hasCompletedOnboarding,
    userPreferences,
    isLoading,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding
  };
}