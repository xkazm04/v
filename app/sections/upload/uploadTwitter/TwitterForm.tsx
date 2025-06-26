'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Card, CardContent } from '@/app/components/ui/card';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { Input } from '@/app/components/ui/input';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { contentVariants } from '@/app/components/animations/variants/placeholderVariants';
import TwitterFormActions from './TwitterFormActions';
import PredefinedTweets from './PredefinedTweets';
import { researchService } from '@/app/lib/services/x-service';
import type { TwitterAnalysisRequest, PredefinedTweet } from '@/app/types/research';

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

const containerVariants: Variants = {
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
  const [mode, setMode] = useState<'url' | 'predefined'>('predefined');
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
    setFormData(prev => ({ ...prev, tweet_url: tweet.tweet_url })); // ✅ FIXED: Use tweet_url
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
    // ✅ FIXED: Get the correct URL from either mode
    const currentUrl = mode === 'predefined' ? selectedTweet?.tweet_url : formData.tweet_url;
    
    // Validate form before submission
    if (!currentUrl) {
      setLocalError(mode === 'predefined' ? 'Please select a tweet' : 'Twitter URL is required');
      setTouched(true);
      return;
    }

    if (mode === 'url') {
      const urlError = validateUrl(currentUrl);
      if (urlError) {
        setLocalError(urlError);
        setTouched(true);
        return;
      }
    }

    try {
      // ✅ FIXED: Ensure formData has the correct URL
      const submitData = {
        ...formData,
        tweet_url: currentUrl
      };
      
      await onSubmit(mode, submitData, selectedTweet);
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
            Tweet check
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
            }}
            disabled={isLoading}
          />
          <Label htmlFor="mode-switch" className="text-sm font-medium">
            Examples
          </Label>
        </motion.div>

        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }} className="space-y-6">
          
          <AnimatePresence mode="wait">
            {mode === 'url' ? (
              <motion.div 
                key="url-mode"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-4"
              >
                {/* Twitter URL Input */}
                <div className="space-y-2">
                  <Label htmlFor="tweet-url" className="text-sm font-medium">
                    Twitter/X URL *
                  </Label>
                  <Input
                    id="tweet-url"
                    type="url"
                    placeholder="https://x.com/username/status/123456789"
                    value={formData.tweet_url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    onBlur={handleUrlBlur}
                    disabled={isLoading}
                    className={`transition-all duration-200 ${
                      currentError && touched ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                  />
                  {currentError && touched && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500 mt-1"
                    >
                      {currentError}
                    </motion.p>
                  )}
                </div>

                {/* Country Filter */}
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium">
                    Country Context (Optional)
                  </Label>
                  <Input
                    id="country"
                    placeholder="e.g., US, UK, CA..."
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))
                    }
                    disabled={isLoading}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="predefined-mode"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <PredefinedTweets
                  onSelectTweet={handlePredefinedTweetSelect}
                  selectedTweetId={selectedTweet?.id}
                  disabled={isLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ✅ FIXED: Action Buttons with correct props */}
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

        {/* Error Display */}
        {currentError && (
          <motion.div
            variants={contentVariants}
            className="mt-6 p-4 rounded-xl border"
            style={{
              borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.4)',
              background: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 0.5)'
            }}
          >
            <p className="text-sm text-red-600 dark:text-red-400">
              {currentError}
            </p>
          </motion.div>
        )}

        {/* Help Text */}
        <motion.div
          variants={contentVariants}
          className="mt-6 p-4 rounded-xl border"
          style={{
            borderColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.4)',
            background: isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(248, 250, 252, 0.5)'
          }}
        >
          <h4 className="font-semibold mb-2" style={{ color: colors.foreground }}>
            How it works:
          </h4>
          <ul className="text-sm space-y-1" style={{ color: colors.mutedForeground }}>
            <li>• Paste any Twitter/X URL or select from examples</li>
            <li>• Our AI analyzes the tweet's claims for accuracy</li>
            <li>• Get detailed fact-checking results with sources</li>
            <li>• Review expert opinions and credibility assessment</li>
          </ul>
        </motion.div>
      </CardContent>
    </motion.div>
  );
};

export default TwitterForm;