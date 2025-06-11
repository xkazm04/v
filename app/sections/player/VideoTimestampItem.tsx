'use client';

import { motion } from 'framer-motion';
import { VideoTimestamp } from '@/app/types/video_api';
import { Badge } from '@/app/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertTriangle, HelpCircle, ExternalLink, PlayCircle } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface VideoTimestampItemProps {
  timestamp: VideoTimestamp;
  isActive?: boolean;
  onSeekToTimestamp: (timestamp: VideoTimestamp) => void;
  animationDelay?: number;
}

export function VideoTimestampItem({ 
  timestamp, 
  isActive = false, 
  onSeekToTimestamp, 
  animationDelay = 0 
}: VideoTimestampItemProps) {
  const { colors, isDark } = useLayoutTheme();
  // TBD reverted - not used now

  // Get status icon and color
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'TRUE':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'FALSE':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'PARTIALLY_TRUE':
      case 'MISLEADING':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <HelpCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'TRUE':
        return isDark ? 'bg-green-900/20 text-green-400 border-green-500/30' : 'bg-green-100 text-green-800 border-green-200';
      case 'FALSE':
        return isDark ? 'bg-red-900/20 text-red-400 border-red-500/30' : 'bg-red-100 text-red-800 border-red-200';
      case 'PARTIALLY_TRUE':
      case 'MISLEADING':
        return isDark ? 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30' : 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return isDark ? 'bg-gray-900/20 text-gray-400 border-gray-500/30' : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleClick = () => {
    onSeekToTimestamp(timestamp);
  };

  const themeColors = {
    background: isActive 
      ? (isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)')
      : (isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255, 255, 255, 0.8)'),
    border: isActive 
      ? colors.primary 
      : (isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(203, 213, 225, 0.4)'),
    hover: isDark ? 'rgba(51, 65, 85, 0.6)' : 'rgba(248, 250, 252, 0.9)',
    shadow: isActive 
      ? (isDark ? `0 4px 12px ${colors.primary}30` : `0 4px 12px ${colors.primary}20`)
      : (isDark ? '0 2px 8px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.08)')
  };

  return (
    <motion.div 
      className="group rounded-xl border cursor-pointer transition-all duration-300"
      style={{
        background: themeColors.background,
        borderColor: themeColors.border,
        boxShadow: themeColors.shadow
      }}
      whileHover={{ 
        scale: 1.01,
        backgroundColor: themeColors.hover
      }}
      whileTap={{ scale: 0.99 }}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay, duration: 0.4 }}
    >
      <div className="p-4 space-y-3">
        {/* Header with time and status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{
                background: isActive ? colors.primary : (isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.6)'),
                color: isActive ? 'white' : colors.foreground
              }}
            >
              <PlayCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-mono font-semibold">
                <span style={{ color: colors.foreground }}>
                  {formatTime(timestamp.startTime)}
                </span>
                {timestamp.endTime !== timestamp.startTime && (
                  <>
                    <span className="text-xs text-muted-foreground">→</span>
                    <span style={{ color: colors.foreground }}>
                      {formatTime(timestamp.endTime)}
                    </span>
                  </>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Duration: {formatTime(timestamp.endTime - timestamp.startTime)}
              </div>
            </div>
          </div>
          
          {/* Status badge */}
          <div className="flex items-center gap-2">
            {timestamp.factCheck ? (
              <div className="flex items-center gap-2">
                {getStatusIcon(timestamp.factCheck.status)}
                <Badge className={`${getStatusColor(timestamp.factCheck.status)} border text-xs font-medium`}>
                  {timestamp.factCheck.status?.replace('_', ' ') || 'Unknown'}
                </Badge>
              </div>
            ) : (
              <Badge variant="outline" className="border-dashed text-xs">
                <Clock className="w-3 h-3 mr-1" />
                Pending Research
              </Badge>
            )}
          </div>
        </div>
        
        {/* Statement */}
        <div className="space-y-2">
          <div 
            className="p-3 rounded-lg border-l-4"
            style={{
              background: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(248, 250, 252, 0.8)',
              borderLeftColor: isActive ? colors.primary : (isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(203, 213, 225, 0.6)')
            }}
          >
            <p className="text-sm leading-relaxed font-medium" style={{ color: colors.foreground }}>
              "{timestamp.statement}"
            </p>
            {timestamp.context && (
              <p className="text-xs text-muted-foreground mt-2 italic">
                Context: {timestamp.context}
              </p>
            )}
          </div>
        </div>
        
        {/* Fact-check details */}
        {timestamp.factCheck && (
          <motion.div 
            className="space-y-3 pt-3 border-t border-muted"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.1 }}
          >
            {/* Verdict */}
            <div 
              className="p-3 rounded-lg"
              style={{
                background: isDark ? 'rgba(71, 85, 105, 0.2)' : 'rgba(241, 245, 249, 0.8)'
              }}
            >
              <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">
                Verdict
              </div>
              <p className="text-sm font-medium leading-relaxed" style={{ color: colors.foreground }}>
                {timestamp.factCheck.verdict}
              </p>
            </div>
            
            {/* Correction */}
            {timestamp.factCheck.correction && (
              <div 
                className="p-3 rounded-lg border-l-4"
                style={{
                  background: isDark ? 'rgba(239, 68, 68, 0.05)' : 'rgba(254, 242, 242, 0.8)',
                  borderLeftColor: isDark ? '#ef4444' : '#dc2626'
                }}
              >
                <div className="text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: isDark ? '#f87171' : '#dc2626' }}>
                  Correction
                </div>
                <p className="text-sm leading-relaxed" style={{ color: colors.foreground }}>
                  {timestamp.factCheck.correction}
                </p>
              </div>
            )}
            
            {/* Sources summary */}
            <div className="flex items-center justify-between p-2 rounded text-xs">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Confidence: <span className="font-semibold">{timestamp.factCheck.confidence}%</span>
                </span>
              </div>
              {timestamp.factCheck.sources?.agreed?.count && timestamp.factCheck.sources.agreed.count > 0 && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-green-600 font-medium">
                    {timestamp.factCheck.sources.agreed.count} sources agree
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Category badge */}
        {timestamp.category && (
          <div className="pt-2 border-t border-muted">
            <Badge 
              variant="secondary" 
              className="text-xs"
              style={{
                background: `${colors.primary}10`,
                color: colors.primary,
                border: `1px solid ${colors.primary}30`
              }}
            >
              {timestamp.category}
            </Badge>
          </div>
        )}
      </div>
    </motion.div>
  );
}