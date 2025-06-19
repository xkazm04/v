import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import DynamicBackground from '@/app/components/ui/Decorative/DynamicBackground';
import OnboardingHeader from './OnboardingHeader';
import FeaturesShowcase from './FeaturesShowcase';
import CompactThemeSwitcher from './CompactThemeSwitcher';
import CompactCategorySelector from './CompactCategorySelector';
import { useUserPreferences } from '@/app/hooks/use-user-preferences';
import LanguageSelector from '@/app/components/userPreferences/LanguageSelector';
import Divider from '@/app/components/ui/divider';
import FloatingIconsConstellation from '@/app/components/ui/Decorative/FloatingIconsConstellation';

interface FirstTimeUserModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip?: () => void;
}

export function FirstTimeUserModal({ isOpen, onComplete, onSkip }: FirstTimeUserModalProps) {
  const { setTheme, theme } = useTheme();
  const { completeOnboarding } = useUserPreferences();
  const [currentStep, setCurrentStep] = useState(0);

  // Local state for onboarding preferences - default to light theme
  const [tempPreferences, setTempPreferences] = useState({
    language: 'en',
    categories: ['politics', 'environment'],
    theme: 'light' as 'light' | 'dark'
  });

  const steps = [
    {
      title: 'Personalize Your Experience',
      subtitle: 'Choose your language, interests, and preferred theme to get started'
    },
    {
      title: 'Discover Powerful Features',
      subtitle: 'Explore the comprehensive fact-checking tools at your disposal'
    },
  ];

  const handleLanguageChange = (language: string) => {
    setTempPreferences(prev => ({ ...prev, language }));
  };

  const handleCategoriesChange = (categories: string[]) => {
    setTempPreferences(prev => ({ ...prev, categories }));
  };

  const handleThemeSelect = (themeId: 'light' | 'dark') => {
    setTempPreferences(prev => ({ ...prev, theme: themeId }));
    setTheme(themeId);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding with all preferences
      completeOnboarding({
        language: tempPreferences.language,
        countries: ['worldwide'], // Default to worldwide
        categories: tempPreferences.categories,
        theme: tempPreferences.theme,
      });
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    // Complete onboarding with minimal preferences (light theme default)
    completeOnboarding({
      language: 'en',
      countries: ['worldwide'],
      categories: ['politics'],
      theme: 'light',
    });
    onSkip?.();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return tempPreferences.categories.length > 0;
      case 1: return true; 
      default: return false;
    }
  };

  const getBackgroundConfig = () => ({
    color: currentStep === 0 ? '#10b981' : '#3b82f6',
    bgGradient: `linear-gradient(135deg, 
      rgba(15, 23, 42, 0.95) 0%, 
      rgba(30, 41, 59, 0.98) 30%, 
      rgba(${currentStep === 0 ? '16, 185, 129' : '59, 130, 246'}, 0.15) 100%
    )`,
    stampOpacity: '0.03'
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className={`
              ${theme === 'dark' ? 'opacity-70' : 'opacity-20'} `}>
              <FloatingIconsConstellation />
            </div>
            <div className="lg:ml-8 lg:mt-12">
              <div className="flex flex-row absolute top-0 right-0 space-y-3 justify-center">
                <CompactThemeSwitcher
                  value={tempPreferences.theme}
                  onChange={handleThemeSelect}
                />
              </div>
            </div>
            <Divider/>
            {/* Top Section: Language Selection + Theme Switcher */}
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                <div className="flex-1 max-w-2xl">
                  <LanguageSelector
                    value={tempPreferences.language}
                    onChange={handleLanguageChange}
                    variant="onboarding"
                    label="Content Language"
                    description="News articles will be translated to your preferred language"
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-gray-900 px-4 text-sm text-gray-500 dark:text-gray-400">
                  What interests you most?
                </span>
              </div>
            </div>

            {/* Bottom Section: Categories - Compact Icons */}
            <div className="max-w-4xl mx-auto">
              <CompactCategorySelector
                selectedCategories={tempPreferences.categories}
                onChange={handleCategoriesChange}
              />
            </div>
          </div>
        );

      case 1:
        return <FeaturesShowcase />;

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
            className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl border-2 border-gray-200 dark:border-gray-700"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Dynamic Background */}
            <DynamicBackground
              config={getBackgroundConfig()}
              currentTheme={tempPreferences.theme}
            />

            {/* Content */}
            <div className="relative z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm h-full flex flex-col">
              {/* Header */}
              <OnboardingHeader
                onSkip={handleSkip}
                currentStep={currentStep}
                steps={steps}
                getBackgroundConfig={getBackgroundConfig}
                preferences={tempPreferences}
              />

              {/* Step Content - Scrollable */}
              <div className="flex-1 overflow-y-auto relative">
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
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {steps[currentStep].title}
                      </h2>
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {steps[currentStep].subtitle}
                      </p>
                    </div>

                    {/* Step Content */}
                    {renderStepContent()}
                  </motion.div>
                </div>
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
                    {currentStep === steps.length - 1 ? 'Start Using Vaai' : 'Continue'}
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