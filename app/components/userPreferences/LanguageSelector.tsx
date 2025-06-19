import { memo } from 'react';
import { getAvailableLanguages } from '@/app/helpers/countries';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import LanguageSelectorCompact from './LanguageSelectorCompact';
import LanguageSelectorOnboarding from './LanguageSelectorOnboarding';
import LanguageSelectorDefault from './LanguageSelectorDefault';

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
  const { colors } = useLayoutTheme();
  
  // Safe access to languages with fallback
  const availableLanguages = getAvailableLanguages();

  // Early return if no languages available
  if (!availableLanguages || availableLanguages.length === 0) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" 
             style={{ borderColor: colors.primary }} />
        <span className="ml-2 text-sm" style={{ color: colors.foreground }}>Loading languages...</span>
      </div>
    );
  }

  // Render the appropriate variant
  switch (variant) {
    case 'compact':
      return (
        <LanguageSelectorCompact
          value={value}
          onChange={onChange}
          className={className}
          disabled={disabled}
        />
      );
    
    case 'onboarding':
      return (
        <LanguageSelectorOnboarding
          value={value}
          onChange={onChange}
          className={className}
          label={label}
          description={description}
          disabled={disabled}
        />
      );
    
    case 'default':
    default:
      return (
        <LanguageSelectorDefault
          value={value}
          onChange={onChange}
          className={className}
          label={label}
          description={description}
          disabled={disabled}
        />
      );
  }
});

export default LanguageSelector;