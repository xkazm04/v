'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, AlertCircle, ExternalLink, User, Calendar } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { Label } from '@/app/components/ui/label';
import { xService } from '@/app/lib/services/x-service';

interface TwitterUrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
}

const TwitterUrlInput: React.FC<TwitterUrlInputProps> = ({
  value,
  onChange,
  onBlur,
  error,
  touched,
  disabled
}) => {
  const { colors, isDark } = useLayoutTheme();

  const isValid = value && xService.validateTwitterUrl(value);

  const inputStyle = () => ({
    background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    color: colors.foreground,
    borderColor: error && touched
      ? '#ef4444'
      : isValid
        ? isDark ? 'rgba(29, 161, 242, 0.5)' : 'rgba(29, 161, 242, 0.3)'
        : isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.5)',
  });

  const extractTwitterInfo = (url: string) => {
    if (!isValid) return null;
    
    const match = url.match(/(?:twitter\.com|x\.com)\/(\w+)(?:\/status\/(\d+))?/);
    if (match) {
      return {
        username: match[1],
        tweetId: match[2] || null
      };
    }
    return null;
  };

  const twitterInfo = extractTwitterInfo(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder="https://x.com/username/status/123456789"
          className="w-full outline-none h-12 sm:h-14 p-3 sm:p-4 pr-12 rounded-xl border transition-all duration-300 text-sm sm:text-base"
          style={{
            ...inputStyle(),
            boxShadow: isValid
              ? isDark
                ? '0 0 0 3px rgba(29, 161, 242, 0.1)'
                : '0 0 0 3px rgba(29, 161, 242, 0.05)'
              : 'none'
          }}
          disabled={disabled}
          required
        />
        
        {/* URL Status Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {value && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isValid ? (
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
      {value && isValid && twitterInfo && (
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
  );
};

export default TwitterUrlInput;