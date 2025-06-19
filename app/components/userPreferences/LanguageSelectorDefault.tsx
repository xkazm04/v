import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { getAvailableLanguages } from '@/app/helpers/countries';
import { cn } from '@/app/lib/utils';
import { LanguageFlagSvg } from './LanguageFlagSvg';

interface LanguageSelectorDefaultProps {
  value: string;
  onChange: (languageCode: string) => void;
  className?: string;
  label?: string;
  description?: string;
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

const LanguageSelectorDefault = memo(function LanguageSelectorDefault({
  value,
  onChange,
  className = '',
  label,
  description,
  disabled = false
}: LanguageSelectorDefaultProps) {
  const { colors } = useLayoutTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  // Safe access to languages with fallback
  const availableLanguages = getAvailableLanguages();
  const selectedLanguage = availableLanguages.find(lang => lang.code === value) || availableLanguages[0];

  const handleSelect = (languageCode: string) => {
    onChange(languageCode);
    setIsOpen(false);
  };

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
            <LanguageFlagSvg 
              flagSvg={selectedLanguage?.flagSvg || '/flags/us.svg'} 
              alt={selectedLanguage?.name || 'English'}
              className="w-6 h-5"
            />
            <div>
              <div className="font-medium">{selectedLanguage?.nativeName || 'English'}</div>
              <div className="text-xs opacity-70">{selectedLanguage?.name || 'English'}</div>
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
              {availableLanguages.map((language, index) => (
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
                    <LanguageFlagSvg 
                      flagSvg={language.flagSvg} 
                      alt={language.name}
                      className="w-6 h-5"
                    />
                    <div>
                      <div className="font-medium">{language.nativeName}</div>
                      <div className="text-xs opacity-70">{language.name}</div>
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

export default LanguageSelectorDefault;