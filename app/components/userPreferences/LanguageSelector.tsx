
import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  description?: string;
}

// Available languages for translation
export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    description: 'Default language'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    description: 'Traducción automática'
  }
];

interface LanguageSelectorProps {
  value: string;
  onChange: (languageCode: string) => void;
  variant?: 'default' | 'compact' | 'onboarding';
  className?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}

const LanguageSelector = memo(function LanguageSelector({
  value,
  onChange,
  variant = 'default',
  className = '',
  label,
  description,
  disabled = false
}: LanguageSelectorProps) {
  const { colors, isDark } = useLayoutTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedLanguage = AVAILABLE_LANGUAGES.find(lang => lang.code === value) || AVAILABLE_LANGUAGES[0];

  const handleSelect = (languageCode: string) => {
    onChange(languageCode);
    setIsOpen(false);
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.2
      }
    })
  };

  if (variant === 'compact') {
    return (
      <div className={cn("relative", className)}>
        <motion.button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            "border border-transparent hover:border-opacity-50",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          )}
          style={{
            background: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(148, 163, 184, 0.2)',
            color: colors.foreground,
            borderColor: colors.border
          }}
          whileHover={!disabled ? { scale: 1.02 } : undefined}
          whileTap={!disabled ? { scale: 0.98 } : undefined}
        >
          <span className="text-base">{selectedLanguage.flag}</span>
          <span>{selectedLanguage.code.toUpperCase()}</span>
          {!disabled && <ChevronDown className="w-3 h-3" />}
        </motion.button>

        {/* Compact Dropdown */}
        <AnimatePresence>
          {isOpen && !disabled && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute top-full left-0 mt-1 z-50 min-w-[160px] rounded-lg shadow-lg border"
              style={{
                background: colors.popover,
                borderColor: colors.border
              }}
            >
              {AVAILABLE_LANGUAGES.map((language, index) => (
                <motion.button
                  key={language.code}
                  variants={itemVariants}
                  custom={index}
                  onClick={() => handleSelect(language.code)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors duration-150",
                    "hover:bg-opacity-80 first:rounded-t-lg last:rounded-b-lg",
                    value === language.code ? "bg-opacity-100" : ""
                  )}
                  style={{
                    background: value === language.code 
                      ? `${colors.primary}20` 
                      : 'transparent',
                    color: colors.foreground
                  }}
                >
                  <span className="text-base">{language.flag}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{language.nativeName}</div>
                  </div>
                  {value === language.code && (
                    <Check className="w-4 h-4" style={{ color: colors.primary }} />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (variant === 'onboarding') {
    return (
      <div className={cn("space-y-4", className)}>
        {label && (
          <div className="text-center space-y-1">
            <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
              <Globe className="w-5 h-5" />
              {label}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {AVAILABLE_LANGUAGES.map((language) => (
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
              {/* Background Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                {/* Flag */}
                <motion.div
                  className="text-3xl md:text-4xl"
                  whileHover={!disabled ? { scale: 1.1, rotate: 5 } : undefined}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {language.flag}
                </motion.div>

                {/* Text Content */}
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

              {/* Selection indicator */}
              <AnimatePresence>
                {value === language.code && (
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hover glow */}
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
  }

  // Default variant
  return (
    <div className={cn("space-y-3", className)}>
      {label && (
        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {label}
          </label>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <div className="relative">
        <motion.button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg",
            "border transition-all duration-200 text-left",
            isOpen ? "ring-2 ring-opacity-50" : "",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-opacity-70"
          )}
          style={{
            background: colors.input,
            borderColor: colors.border,
            color: colors.foreground,
            ringColor: isOpen ? `${colors.primary}50` : 'transparent'
          }}
          whileHover={!disabled ? { scale: 1.01 } : undefined}
          whileTap={!disabled ? { scale: 0.99 } : undefined}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{selectedLanguage.flag}</span>
            <div>
              <div className="font-medium">{selectedLanguage.nativeName}</div>
              <div className="text-xs opacity-70">{selectedLanguage.name}</div>
            </div>
          </div>
          {!disabled && (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          )}
        </motion.button>

        {/* Default Dropdown */}
        <AnimatePresence>
          {isOpen && !disabled && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg shadow-lg border overflow-hidden"
              style={{
                background: colors.popover,
                borderColor: colors.border
              }}
            >
              {AVAILABLE_LANGUAGES.map((language, index) => (
                <motion.button
                  key={language.code}
                  variants={itemVariants}
                  custom={index}
                  onClick={() => handleSelect(language.code)}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-4 py-3 text-left",
                    "transition-colors duration-150 hover:bg-opacity-80",
                    value === language.code ? "bg-opacity-100" : ""
                  )}
                  style={{
                    background: value === language.code 
                      ? `${colors.primary}15` 
                      : 'transparent',
                    color: colors.foreground
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{language.flag}</span>
                    <div>
                      <div className="font-medium">{language.nativeName}</div>
                      <div className="text-xs opacity-70">{language.name}</div>
                      {language.description && (
                        <div className="text-xs opacity-50 mt-0.5">{language.description}</div>
                      )}
                    </div>
                  </div>
                  {value === language.code && (
                    <Check className="w-4 h-4" style={{ color: colors.primary }} />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default LanguageSelector;