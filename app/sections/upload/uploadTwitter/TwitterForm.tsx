'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardContent } from '../../../components/ui/card';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import { useTwitterResearch } from '@/app/hooks/useTwitterResearch';
import { xService, PredefinedTweet } from '@/app/lib/services/x-service';
import TwitterUrlInput from './TwitterUrlInput';
import PredefinedTweets from './PredefinedTweets';
import TwitterFormActions from './TwitterFormActions';
import { contentVariants } from '@/app/components/animations/variants/placeholderVariants';

export interface TwitterAnalysisRequest {
  tweet_url: string;
  additional_context?: string;
  country?: string;
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

const TwitterForm: React.FC = () => {
  const { colors, isDark } = useLayoutTheme();
  const [mode, setMode] = useState<'url' | 'predefined'>('url');
  const [formData, setFormData] = useState<TwitterAnalysisRequest>({
    tweet_url: '',
    additional_context: '',
    country: ''
  });

  // UI state
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);
  const [selectedTweet, setSelectedTweet] = useState<PredefinedTweet | null>(null);
  const { isResearching, researchError } = useTwitterResearch();

  const validateUrl = (url: string): string => {
    if (!url.trim()) {
      return 'Twitter URL is required';
    }
    if (!xService.validateTwitterUrl(url)) {
      return 'Please enter a valid Twitter/X URL (e.g., https://x.com/user/status/123)';
    }
    return '';
  };

  const handleUrlChange = (value: string) => {
    setFormData(prev => ({ ...prev, tweet_url: value }));
    setError(validateUrl(value));
  };

  const handleUrlBlur = () => {
    setTouched(true);
    setError(validateUrl(formData.tweet_url));
  };

  const handlePredefinedTweetSelect = (tweet: PredefinedTweet) => {
    setSelectedTweet(tweet);
    setFormData(prev => ({ ...prev, tweet_url: tweet.url }));
    setError('');
    setTouched(false);
  };


  const resetForm = () => {
    setFormData({ tweet_url: '', additional_context: '', country: '' });
    setError('');
    setTouched(false);
    setSelectedTweet(null);
  };

  const currentError =  researchError || error;

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
          className="flex items-center justify-center gap-4 mb-8"
        >
          <Label htmlFor="mode-switch" className="text-sm font-medium">
            URL Input
          </Label>
          <Switch
            id="mode-switch"
            checked={mode === 'predefined'}
            onCheckedChange={(checked) => {
              setMode(checked ? 'predefined' : 'url');
              setError('');
              setTouched(false);
              setSelectedTweet(null);
              setFormData(prev => ({ ...prev, tweet_url: '' }));
            }}
            disabled={isResearching}
          />
          <Label htmlFor="mode-switch" className="text-sm font-medium">
            Predefined Tweets
          </Label>
        </motion.div>

        {/* Form Content */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          <AnimatePresence mode="wait">
            {mode === 'url' ? (
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
                  disabled={isResearching}
                />
              </motion.div>
            ) : (
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
                  disabled={isResearching}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
            <TwitterFormActions
              mode={mode}
              xService={xService}
              formData={formData}
              selectedTweet={selectedTweet}
              resetForm={resetForm}
              setError={setError}
              setTouched={setTouched}
              validateUrl={validateUrl}
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