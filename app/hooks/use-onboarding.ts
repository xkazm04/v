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
    // Check if user has completed onboarding
    const completed = localStorage.getItem(ONBOARDING_KEY);
    const preferences = localStorage.getItem(PREFERENCES_KEY);

    setHasCompletedOnboarding(completed === 'true');
    setUserPreferences(preferences ? JSON.parse(preferences) : null);
    setIsLoading(false);
  }, []);

  const completeOnboarding = (preferences: UserPreferences) => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    setHasCompletedOnboarding(true);
    setUserPreferences(preferences);
  };

  const skipOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setHasCompletedOnboarding(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(PREFERENCES_KEY);
    setHasCompletedOnboarding(false);
    setUserPreferences(null);
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