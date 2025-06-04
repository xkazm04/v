'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { 
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import DynamicBackground from '@/app/components/ui/Decorative/DynamicBackground';
import OnboardingHeader from './OnboardingHeader';
import OnboardingSelectionButton from './OnboardingSelectionButton';
import { CATEGORIES, COUNTRIES, THEMES } from '@/app/constants/onboarding';

interface UserPreferences {
  countries: string[];
  categories: string[];
  theme: 'light' | 'dark';
}

interface FirstTimeUserModalProps {
  isOpen: boolean;
  onComplete: (preferences: UserPreferences) => void;
  onSkip?: () => void;
}


export function FirstTimeUserModal({ isOpen, onComplete, onSkip }: FirstTimeUserModalProps) {
  const { setTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    countries: ['worldwide'],
    categories: ['politics', 'environment', 'military'],
    theme: 'light'
  });
  const [setIsVisible] = useState(true);

  const steps = [
    { title: 'Choose Your Regions', subtitle: 'Where would you like to see fact-checks from?' },
    { title: 'Select Categories', subtitle: 'What topics interest you most?' },
    { title: 'Pick Your Theme', subtitle: 'How would you like the app to look?' },
  ];

  const handleCountryToggle = (countryId: string) => {
    setPreferences(prev => ({
      ...prev,
      countries: prev.countries.includes(countryId)
        ? prev.countries.filter(id => id !== countryId)
        : [...prev.countries, countryId]
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setPreferences(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleThemeSelect = (themeId: 'light' | 'dark') => {
    setPreferences(prev => ({ ...prev, theme: themeId }));
    setTheme(themeId);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(preferences);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return preferences.countries.length > 0;
      case 1: return preferences.categories.length > 0;
      case 2: return true;
      default: return false;
    }
  };

  const getBackgroundConfig = () => ({
    color: currentStep === 0 ? '#3b82f6' : currentStep === 1 ? '#22c55e' : '#8b5cf6',
    bgGradient: `linear-gradient(135deg, 
      rgba(15, 23, 42, 0.95) 0%, 
      rgba(30, 41, 59, 0.98) 30%, 
      rgba(${currentStep === 0 ? '59, 130, 246' : currentStep === 1 ? '34, 197, 94' : '139, 92, 246'}, 0.15) 100%
    )`,
    stampOpacity: '0.03'
  });



  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
            {COUNTRIES.map((country) => (
              <OnboardingSelectionButton
                key={country.id}
                item={country}
                isSelected={preferences.countries.includes(country.id)}
                onClick={() => handleCountryToggle(country.id)}
                type="country"
              />
            ))}
          </div>
        );
      
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {CATEGORIES.map((category) => (
              <OnboardingSelectionButton
                key={category.id}
                item={category}
                isSelected={preferences.categories.includes(category.id)}
                onClick={() => handleCategoryToggle(category.id)}
                type="category"
              />
            ))}
          </div>
        );
      
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
            {THEMES.map((theme) => (
              <OnboardingSelectionButton
                key={theme.id}
                item={theme}
                isSelected={preferences.theme === theme.id}
                onClick={() => handleThemeSelect(theme.id as 'light' | 'dark')}
                type="theme"
              />
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border-2 border-gray-200 dark:border-gray-700"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Dynamic Background */}
            <DynamicBackground 
              config={getBackgroundConfig()}
              currentTheme={preferences.theme}
            />
            {/* Content */}
            <div className="relative z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
              {/* Header */}
              <OnboardingHeader
                onSkip={onSkip}
                currentStep={currentStep}
                steps={steps}
                getBackgroundConfig={getBackgroundConfig}
                preferences={preferences}
                />

              {/* Step Content */}
              <div className="p-6 md:p-8">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Step Title */}
                  <div className="text-center space-y-2">
                    <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {steps[currentStep].title}
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                      {steps[currentStep].subtitle}
                    </p>
                  </div>

                  {/* Step Content */}
                  {renderStepContent()}
                </motion.div>
              </div>

              {/* Footer */}
              <div className="p-6 md:p-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="px-6"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="px-6"
                    style={{
                      backgroundColor: canProceed() ? getBackgroundConfig().color : undefined
                    }}
                  >
                    {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}