import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { getAvailableLanguages } from '@/app/helpers/countries';
import { cn } from '@/app/lib/utils';
import { LanguageFlagSvg } from './LanguageFlagSvg';

interface LanguageSelectorOnboardingProps {
  value: string;
  onChange: (languageCode: string) => void;
  className?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}

const LanguageSelectorOnboarding = memo(function LanguageSelectorOnboarding({
  value,
  onChange,
  className = '',
  label,
  description,
  disabled = false
}: LanguageSelectorOnboardingProps) {
  // Safe access to languages with fallback
  const availableLanguages = getAvailableLanguages();

  const handleSelect = (languageCode: string) => {
    onChange(languageCode);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {availableLanguages.map((language) => (
          <motion.button
            key={language.code}
            onClick={() => handleSelect(language.code)}
            disabled={disabled}
            className={cn(
              "relative p-6 rounded-2xl border-2 transition-all duration-300 group overflow-hidden",
              "hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
              value === language.code
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-lg shadow-blue-500/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600",
              disabled ? "opacity-50 cursor-not-allowed" : ""
            )}
            whileHover={!disabled ? { y: -2 } : undefined}
            whileTap={!disabled ? { scale: 0.98 } : undefined}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />

            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
              <motion.div
                whileHover={!disabled ? { scale: 1.1, rotate: 5 } : undefined}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <LanguageFlagSvg 
                  flagSvg={language.flagSvg} 
                  alt={language.name}
                  className="w-16 h-12"
                />
              </motion.div>

              <div className="space-y-1">
                <h4 className={cn(
                  "font-semibold text-base transition-colors",
                  value === language.code ? "text-blue-700 dark:text-blue-300" : "text-gray-900 dark:text-gray-100"
                )}>
                  {language.nativeName}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {language.name}
                </p>
                {language.description && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {language.description}
                  </p>
                )}
              </div>
            </div>

            <AnimatePresence>
              {value === language.code && (
                <motion.div
                  className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
              style={{
                background: 'radial-gradient(circle at center, #3b82f615, transparent 70%)'
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
});

export default LanguageSelectorOnboarding;