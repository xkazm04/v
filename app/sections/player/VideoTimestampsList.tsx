'use client';

import { motion } from 'framer-motion';
import { VideoWithTimestamps, VideoTimestamp } from '@/app/types/video_api'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertTriangle, HelpCircle, ExternalLink, BookOpen, PlayCircle } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface VideoTimestampsListProps {
  video: VideoWithTimestamps; 
  currentTimestamp?: VideoTimestamp;
  onSeekToTimestamp?: (timestamp: number) => void;
  className?: string;
}

export function VideoTimestampsList({ 
  video, 
  currentTimestamp, 
  onSeekToTimestamp,
  className 
}: VideoTimestampsListProps) {
  const { colors } = useLayoutTheme();

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
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'FALSE':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'PARTIALLY_TRUE':
      case 'MISLEADING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTimestampClick = (timestamp: VideoTimestamp) => {
    if (onSeekToTimestamp) {
      onSeekToTimestamp(timestamp.startTime);
    }
  };

  // Direct calculations - no conversion needed!
  const totalStatements = video.timestamps.length;
  const researchedStatements = video.timestamps.filter(ts => ts.factCheck).length;
  const completionRate = totalStatements > 0 
    ? (researchedStatements / totalStatements) * 100 
    : 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          All Statements & Fact-Checks
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {researchedStatements} of {totalStatements} statements researched
          </p>
          <div className="flex items-center gap-2">
            <div 
              className="text-xs font-bold px-2 py-1 rounded"
              style={{ 
                color: colors.primary,
                backgroundColor: `${colors.primary}20`
              }}
            >
              {completionRate.toFixed(1)}% Complete
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
        {video.timestamps.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Statements Found</h3>
            <p>This video hasn't been analyzed for statements yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {video.timestamps.map((timestamp, index) => (
              <motion.div 
                key={`${timestamp.startTime}-${index}`}
                className={`group p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  currentTimestamp === timestamp 
                    ? 'bg-primary/10 border-primary shadow-sm' 
                    : 'bg-background hover:bg-muted/50'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleTimestampClick(timestamp)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm font-mono font-medium text-muted-foreground">
                      {formatTime(timestamp.startTime)}
                    </span>
                    {timestamp.endTime !== timestamp.startTime && (
                      <>
                        <span className="text-xs text-muted-foreground">→</span>
                        <span className="text-sm font-mono text-muted-foreground">
                          {formatTime(timestamp.endTime)}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {timestamp.factCheck ? (
                      <>
                        {getStatusIcon(timestamp.factCheck.status)}
                        <Badge className={getStatusColor(timestamp.factCheck.status)}>
                          {timestamp.factCheck.status?.replace('_', ' ')}
                        </Badge>
                      </>
                    ) : (
                      <Badge variant="outline">
                        Pending Research
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm leading-relaxed text-foreground">
                    "{timestamp.statement}"
                  </p>
                  {timestamp.context && (
                    <p className="text-xs text-muted-foreground mt-1 italic">
                      Context: {timestamp.context}
                    </p>
                  )}
                </div>
                
                {timestamp.factCheck && (
                  <motion.div 
                    className="space-y-2 pt-3 border-t border-muted"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.1 }}
                  >
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">Verdict:</div>
                      <p className="text-sm text-foreground">
                        {timestamp.factCheck.verdict}
                      </p>
                    </div>
                    
                    {timestamp.factCheck.correction && (
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1">Correction:</div>
                        <p className="text-sm text-foreground">
                          {timestamp.factCheck.correction}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        <span>Sources: {timestamp.factCheck.confidence}</span>
                      </div>
                      {timestamp.factCheck.sources?.agreed.count && timestamp.factCheck.sources.agreed.count > 0 && (
                        <span className="text-green-600">
                          {timestamp.factCheck.sources.agreed.count} sources agree
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
                
                {timestamp.category && (
                  <div className="mt-2 pt-2 border-t border-muted">
                    <Badge variant="secondary">
                      {timestamp.category}
                    </Badge>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}