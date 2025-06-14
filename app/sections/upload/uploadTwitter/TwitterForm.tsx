'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardContent } from '../../../components/ui/card';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { TwitterAnalysisRequest, PredefinedTweet } from '@/app/types/research';
import TwitterUrlInput from './TwitterUrlInput';
import PredefinedTweets from './PredefinedTweets';
import TwitterFormActions from './TwitterFormActions';
import { contentVariants } from '@/app/components/animations/variants/placeholderVariants';
import { researchService } from '@/app/lib/services/x-service';

interface TwitterFormProps {
  onSubmit: (
    mode: 'url' | 'predefined', 
    formData: TwitterAnalysisRequest, 
    selectedTweet?: PredefinedTweet | null
  ) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onReset: () => void;
}

const containerVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1
    }
  }
};

const TwitterForm: React.FC<TwitterFormProps> = ({ onSubmit, isLoading, error: submitError, onReset }) => {
  const { colors, isDark } = useLayoutTheme();
  const [mode, setMode] = useState<'url' | 'predefined'>('url');
  const [formData, setFormData] = useState<TwitterAnalysisRequest>({
    tweet_url: '',
    additional_context: '',
    country: ''
  });

  // UI state
  const [localError, setLocalError] = useState<string>('');
  const [touched, setTouched] = useState(false);
  const [selectedTweet, setSelectedTweet] = useState<PredefinedTweet | null>(null);

  const validateUrl = (url: string): string => {
    if (!url.trim()) {
      return 'Twitter URL is required';
    }
    if (!researchService.validateTwitterUrl(url)) {
      return 'Please enter a valid Twitter/X URL (e.g., https://x.com/user/status/123)';
    }
    return '';
  };

  const handleUrlChange = (value: string) => {
    setFormData(prev => ({ ...prev, tweet_url: value }));
    setLocalError(validateUrl(value));
  };

  const handleUrlBlur = () => {
    setTouched(true);
    setLocalError(validateUrl(formData.tweet_url));
  };

  const handlePredefinedTweetSelect = (tweet: PredefinedTweet) => {
    setSelectedTweet(tweet);
    setFormData(prev => ({ ...prev, tweet_url: tweet.url }));
    setLocalError('');
    setTouched(false);
  };

  const resetForm = () => {
    setFormData({ tweet_url: '', additional_context: '', country: '' });
    setLocalError('');
    setTouched(false);
    setSelectedTweet(null);
    onReset();
  };

  const handleSubmit = async () => {
    // Validate form before submission
    const urlError = validateUrl(formData.tweet_url);
    if (urlError) {
      setLocalError(urlError);
      setTouched(true);
      return;
    }

    try {
      await onSubmit(mode, formData, selectedTweet);
    } catch (error: any) {
      console.error('Form submission error:', error);
      // Error is handled by parent component
    }
  };

  // Combine local validation errors and submission errors
  const currentError = submitError || localError;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <CardContent className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
        {/* Header */}
        <motion.div
          variants={contentVariants}
          className="text-center mb-8"
        >
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent mb-2">
            Twitter/X Analysis
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground font-normal max-w-md mx-auto leading-relaxed">
            Analyze tweets for credibility assessment
          </p>
        </motion.div>

        {/* Mode Switch */}
        <motion.div
          variants={contentVariants}
          className="flex items-center absolute text-gray-500 right-10 justify-center gap-4 mb-8"
        >
          <Label htmlFor="mode-switch" className="text-sm font-medium">
            URL Input
          </Label>
          <Switch
            id="mode-switch"
            checked={mode === 'predefined'}
            onCheckedChange={(checked) => {
              setMode(checked ? 'predefined' : 'url');
              setLocalError('');
              setTouched(false);
              setSelectedTweet(null);
              setFormData(prev => ({ ...prev, tweet_url: '' }));
            }}
            disabled={isLoading}
          />
          <Label htmlFor="mode-switch" className="text-sm font-medium">
            Predefined
          </Label>
        </motion.div>

        {/* Form Content */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
          <AnimatePresence mode="wait">
            {mode === 'url' && (
              <motion.div
                key="url-mode"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <TwitterUrlInput
                  value={formData.tweet_url}
                  onChange={handleUrlChange}
                  onBlur={handleUrlBlur}
                  error={currentError}
                  touched={touched}
                  disabled={isLoading}
                />
              </motion.div>
            )}
            
            <div
              className="text-xs px-3 py-2 rounded-lg border 2xl:max-w-[50%] max-w-full"
              style={{
                borderColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.4)',
                background: isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(248, 250, 252, 0.5)',
                color: colors.mutedForeground
              }}
            >
              {mode === 'url'
                ? "💭 Due to the rate limit it is allowed to pass only 1 tweet per 15 minutes"
                : "📋 Choose from curated examples below to test fact-checking capabilities"
              }
            </div>

            {mode === 'predefined' && (
              <motion.div
                key="predefined-mode"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PredefinedTweets
                  onSelectTweet={handlePredefinedTweetSelect}
                  selectedTweetId={selectedTweet?.id}
                  disabled={isLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <TwitterFormActions
            mode={mode}
            formData={formData}
            selectedTweet={selectedTweet}
            resetForm={resetForm}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            hasValidData={mode === 'predefined' ? !!selectedTweet : researchService.validateTwitterUrl(formData.tweet_url)}
          />
        </form>

        {/* Help Text */}
        <motion.div
          variants={contentVariants}
          className="mt-6 p-4 rounded-xl border"
          style={{
            borderColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.4)',
            background: isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(248, 250, 252, 0.5)'
          }}
        >
          <h4 className="font-semibold text-sm mb-2" style={{ color: colors.foreground }}>
            {mode === 'url' ? 'Supported URL Formats:' : 'About Predefined Tweets:'}
          </h4>
          {mode === 'url' ? (
            <ul className="text-xs space-y-1" style={{ color: colors.mutedForeground }}>
              <li>• Individual tweets: x.com/username/status/123456789</li>
              <li>• Extract: Get tweet content and metadata</li>
              <li>• Research: Full fact-checking analysis</li>
            </ul>
          ) : (
            <ul className="text-xs space-y-1" style={{ color: colors.mutedForeground }}>
              <li>• Curated examples for testing fact-checking</li>
              <li>• Research only (content pre-extracted)</li>
              <li>• Covers various categories and claim types</li>
            </ul>
          )}
        </motion.div>
      </CardContent>
    </motion.div>
  );
};

export default TwitterForm;