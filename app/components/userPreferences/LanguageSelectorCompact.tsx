import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { getAvailableLanguages } from '@/app/helpers/countries';
import { cn } from '@/app/lib/utils';
import { LanguageFlagSvg } from './LanguageFlagSvg';

interface LanguageSelectorCompactProps {
  value: string;
  onChange: (languageCode: string) => void;
  className?: string;
  disabled?: boolean;
}

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

const LanguageSelectorCompact = memo(function LanguageSelectorCompact({
  value,
  onChange,
  className = '',
  disabled = false
}: LanguageSelectorCompactProps) {
  const { colors, isDark } = useLayoutTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  // Safe access to languages with fallback
  const availableLanguages = getAvailableLanguages();
  const selectedLanguage = availableLanguages.find(lang => lang.code === value) || availableLanguages[0];

  const handleSelect = (languageCode: string) => {
    onChange(languageCode);
    setIsOpen(false);
  };

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
        <LanguageFlagSvg 
          flagSvg={selectedLanguage?.flagSvg || '/flags/us.svg'} 
          alt={selectedLanguage?.name || 'English'}
          className="w-5 h-4"
        />
        <span>{(selectedLanguage?.code || 'en').toUpperCase()}</span>
        {!disabled && <ChevronDown className="w-3 h-3" />}
      </motion.button>

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
            {availableLanguages.map((language, index) => (
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
                <LanguageFlagSvg 
                  flagSvg={language.flagSvg} 
                  alt={language.name}
                  className="w-5 h-4"
                />
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
});

export default LanguageSelectorCompact;