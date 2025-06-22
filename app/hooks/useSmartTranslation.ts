import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { HybridTranslationService } from '@/app/lib/services/translation-hybrid-service';
import { ClientTranslationService } from '@/app/lib/services/translation-service-client';

interface SmartTranslationOptions {
  staticKey?: string;
  dynamicText?: string;
  fallbackText: string;
  params?: Record<string, any>;
  context?: 'news' | 'timeline' | 'expert-opinion';
  enableDynamic?: boolean;
}

export function useSmartTranslation(options: SmartTranslationOptions) {
  const t = useTranslations();
  const locale = useLocale();
  const [dynamicTranslation, setDynamicTranslation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get static translation immediately
  const staticTranslation = options.staticKey 
    ? HybridTranslationService.getStaticTranslation(t, options.staticKey, options.params)
    : null;

  // Handle dynamic translation
  useEffect(() => {
    // Skip if we have static translation or dynamic is disabled
    if (staticTranslation !== options.staticKey || !options.enableDynamic || !options.dynamicText) {
      return;
    }

    // Skip if target locale is English (source language)
    if (locale === 'en') {
      return;
    }

    let isCancelled = false;
    
    const translateDynamic = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await ClientTranslationService.translateText(
          options.dynamicText!,
          'en',
          locale,
          options.context
        );
        
        if (!isCancelled) {
          setDynamicTranslation(result);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Translation failed');
          console.warn('Dynamic translation error:', err);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    translateDynamic();
    
    return () => {
      isCancelled = true;
    };
  }, [options.dynamicText, locale, staticTranslation, options.enableDynamic, options.context]);

  // Determine final text with priority: Static > Dynamic > Fallback
  const finalText = staticTranslation !== options.staticKey 
    ? staticTranslation
    : dynamicTranslation || options.dynamicText || options.fallbackText;

  return {
    text: finalText,
    isLoading,
    error,
    isStatic: staticTranslation !== options.staticKey,
    isDynamic: !!dynamicTranslation,
    locale
  };
}