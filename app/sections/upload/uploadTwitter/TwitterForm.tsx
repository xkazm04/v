'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CardContent } from '../../../components/ui/card';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { Label } from '@/app/components/ui/label';
import { Twitter, Play, RotateCcw, AlertCircle, ExternalLink, User, Calendar } from 'lucide-react';

interface TwitterAnalysisRequest {
  url: string;
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

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

const TwitterForm: React.FC = () => {
  const { colors, isDark } = useLayoutTheme();

  // Form state
  const [formData, setFormData] = useState<TwitterAnalysisRequest>({
    url: ''
  });

  // UI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);

  const inputStyle = () => ({
    background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    color: colors.foreground,
    borderColor: error && touched
      ? '#ef4444'
      : formData.url && isValidTwitterUrl(formData.url)
        ? isDark ? 'rgba(29, 161, 242, 0.5)' : 'rgba(29, 161, 242, 0.3)'
        : isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.5)',
  });

  // Twitter URL validation
  const isValidTwitterUrl = (url: string): boolean => {
    if (!url.trim()) return false;
    
    const twitterUrlPatterns = [
      /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+\/status\/\d+/,
      /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+$/,
      /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+\/?\?/
    ];
    
    return twitterUrlPatterns.some(pattern => pattern.test(url.trim()));
  };

  const validateUrl = (url: string): string => {
    if (!url.trim()) {
      return 'Twitter URL is required';
    }
    
    if (!isValidTwitterUrl(url)) {
      return 'Please enter a valid Twitter/X URL (e.g., https://twitter.com/user/status/123 or https://x.com/user)';
    }
    
    return '';
  };

  const handleInputChange = (value: string) => {
    setFormData({ url: value });
    setError(validateUrl(value));
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validateUrl(formData.url));
  };

  const startAnalysis = async () => {
    const validationError = validateUrl(formData.url);
    if (validationError) {
      setError(validationError);
      setTouched(true);
      return;
    }

    try {
      setIsProcessing(true);
      
      // TODO: Replace with actual API call
      console.log('Starting Twitter analysis for:', formData.url);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Twitter analysis started! (This is a placeholder)');
      
    } catch (error) {
      console.error('Failed to start Twitter analysis:', error);
      alert(`Failed to start analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setFormData({ url: '' });
    setError('');
    setTouched(false);
    setIsProcessing(false);
  };

  const extractTwitterInfo = (url: string) => {
    if (!isValidTwitterUrl(url)) return null;
    
    const match = url.match(/(?:twitter\.com|x\.com)\/(\w+)(?:\/status\/(\d+))?/);
    if (match) {
      return {
        username: match[1],
        tweetId: match[2] || null
      };
    }
    return null;
  };

  const twitterInfo = extractTwitterInfo(formData.url);

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
          variants={fieldVariants}
          className="text-center mb-8"
        >
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent mb-2">
            Twitter/X Analysis
          </h1>
          
          <p className="text-sm sm:text-base text-muted-foreground font-normal max-w-md mx-auto leading-relaxed">
            Analyze tweets for credibility assessment
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); startAnalysis(); }} className="space-y-6">
          {/* Twitter URL Input */}
          <motion.div
            variants={fieldVariants}
            className="space-y-3"
          >
            <Label
              htmlFor="twitter-url"
              className="flex items-center gap-2 text-sm sm:text-base font-semibold"
              style={{ color: colors.foreground }}
            >
              <Twitter className="h-4 w-4 text-sky-500 flex-shrink-0" />
              <span>Twitter/X URL *</span>
            </Label>
            
            <div className="relative">
              <input
                id="twitter-url"
                type="url"
                value={formData.url}
                onChange={(e) => handleInputChange(e.target.value)}
                onBlur={handleBlur}
                placeholder="https://twitter.com/username/status/123456789 or https://x.com/username"
                className="w-full outline-none h-12 sm:h-14 p-3 sm:p-4 pr-12 rounded-xl border transition-all duration-300 text-sm sm:text-base"
                style={{
                  ...inputStyle(),
                  boxShadow: formData.url && isValidTwitterUrl(formData.url)
                    ? isDark
                      ? '0 0 0 3px rgba(29, 161, 242, 0.1)'
                      : '0 0 0 3px rgba(29, 161, 242, 0.05)'
                    : 'none'
                }}
                disabled={isProcessing}
                required
              />
              
              {/* URL Status Icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {formData.url && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isValidTwitterUrl(formData.url) ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          ✓
                        </motion.div>
                      </div>
                    ) : touched ? (
                      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-white" />
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && touched && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-red-500 text-sm font-medium"
              >
                <AlertCircle className="h-4 w-4" />
                {error}
              </motion.div>
            )}

            {/* URL Preview */}
            {formData.url && isValidTwitterUrl(formData.url) && twitterInfo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl border-2"
                style={{
                  borderColor: isDark ? 'rgba(29, 161, 242, 0.3)' : 'rgba(29, 161, 242, 0.2)',
                  background: isDark ? 'rgba(29, 161, 242, 0.05)' : 'rgba(29, 161, 242, 0.02)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/20">
                    <Twitter className="h-4 w-4 text-sky-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3 w-3" style={{ color: colors.mutedForeground }} />
                      <span className="font-medium" style={{ color: colors.foreground }}>
                        @{twitterInfo.username}
                      </span>
                    </div>
                    {twitterInfo.tweetId && (
                      <div className="flex items-center gap-2 text-xs" style={{ color: colors.mutedForeground }}>
                        <Calendar className="h-3 w-3" />
                        <span>Tweet ID: {twitterInfo.tweetId}</span>
                      </div>
                    )}
                  </div>
                  <ExternalLink className="h-4 w-4" style={{ color: colors.mutedForeground }} />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={fieldVariants}
            className="flex flex-col sm:flex-row gap-3"
          >
            <motion.button
              type="submit"
              disabled={isProcessing || !formData.url.trim() || !isValidTwitterUrl(formData.url)}
              className="flex-1 h-12 sm:h-14 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 relative overflow-hidden group border-0 flex items-center justify-center gap-2 sm:gap-3"
              style={{
                background: (isProcessing || !formData.url.trim() || !isValidTwitterUrl(formData.url))
                  ? isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.5)'
                  : `linear-gradient(135deg, 
                      rgba(29, 161, 242, 0.9) 0%,
                      rgba(56, 189, 248, 0.9) 50%,
                      rgba(14, 165, 233, 0.9) 100%
                    )`,
                color: (isProcessing || !formData.url.trim() || !isValidTwitterUrl(formData.url)) 
                  ? colors.mutedForeground 
                  : 'white',
                boxShadow: (isProcessing || !formData.url.trim() || !isValidTwitterUrl(formData.url))
                  ? 'none'
                  : '0 8px 25px -8px rgba(29, 161, 242, 0.5)',
                cursor: (isProcessing || !formData.url.trim() || !isValidTwitterUrl(formData.url)) 
                  ? 'not-allowed' 
                  : 'pointer'
              }}
              whileHover={!(isProcessing || !formData.url.trim() || !isValidTwitterUrl(formData.url)) ? { scale: 1.02 } : {}}
              whileTap={!(isProcessing || !formData.url.trim() || !isValidTwitterUrl(formData.url)) ? { scale: 0.98 } : {}}
            >
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.div>
                  <span className="hidden sm:inline">Analyzing Twitter Content...</span>
                  <span className="sm:hidden">Analyzing...</span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="hidden sm:inline">Start Twitter Analysis</span>
                  <span className="sm:hidden">Start Analysis</span>
                </>
              )}
            </motion.button>

            {(isProcessing || formData.url) && (
              <motion.button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 h-12 sm:h-14 rounded-xl border-2 font-medium transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  borderColor: isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.5)',
                  background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                  color: colors.foreground
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Reset</span>
              </motion.button>
            )}
          </motion.div>
        </form>

        {/* Help Text */}
        <motion.div
          variants={fieldVariants}
          className="mt-6 p-4 rounded-xl border"
          style={{
            borderColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.4)',
            background: isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(248, 250, 252, 0.5)'
          }}
        >
          <h4 className="font-semibold text-sm mb-2" style={{ color: colors.foreground }}>
            Supported URL Formats:
          </h4>
          <ul className="text-xs space-y-1" style={{ color: colors.mutedForeground }}>
            <li>• Individual tweets: x.com/username/status/123456789</li>
          </ul>
        </motion.div>
      </CardContent>
    </motion.div>
  );
};

export default TwitterForm;