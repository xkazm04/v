import { motion } from 'framer-motion';
import { Calendar, Hash, Pause, Loader2, PlayIcon } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

interface TimelineRowItemProps {
  item: {
    id: string;
    type: 'hero' | 'milestone' | 'event';
    title: string;
    content: {
      content?: string;
      date?: string;
      line1?: string;
      line2?: string;
    };
    isActive: boolean;
    isCurrentlyPlaying: boolean;
    parentMilestoneId?: string;
    track?: any;
  };
  index: number;
  hasAudio: boolean;
  isAudioLoading: boolean;
  onContentClick: () => void;
  onAudioClick: (e: React.MouseEvent) => void;
}

const TimelineProgressRowItem = ({
  item,
  index,
  hasAudio,
  isAudioLoading,
  onContentClick,
  onAudioClick
}: TimelineRowItemProps) => {
  const { colors } = useLayoutTheme();
  const { isCurrentlyPlaying } = item;

  return (
    <motion.div
      key={item.id}
      className={`relative flex items-start gap-3 ${
        item.type === 'event' ? 'ml-4' : '' 
      }`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      layout
    >
      {/* Audio control button */}
      <motion.button
        className={`relative flex-shrink-0 rounded-full border-2 flex items-center justify-center ${
          item.type === 'hero' ? 'w-6 h-6' :
          item.type === 'milestone' ? 'w-6 h-6' : 'w-5 h-5'
        }`}
        style={{
          backgroundColor: isCurrentlyPlaying ? colors.primary :
                            hasAudio ? colors.primary + '20' : colors.background,
          borderColor: isCurrentlyPlaying ? colors.primary :
                       hasAudio ? colors.primary : colors.border,
          zIndex: 10
        }}
        animate={{
          scale: isCurrentlyPlaying ? 1.2 : hasAudio ? 1.1 : 1,
          boxShadow: isCurrentlyPlaying
            ? `0 0 16px ${colors.primary}60`
            : hasAudio ? `0 0 8px ${colors.primary}30` : 'none'
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
        whileHover={{ scale: isCurrentlyPlaying ? 1.3 : hasAudio ? 1.2 : 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={hasAudio ? onAudioClick : onContentClick}
        disabled={!hasAudio && item.type !== 'hero'}
      >
        {hasAudio ? (
          isAudioLoading ? (
            <Loader2 className={`text-blue-500 w-2.5 h-2.5 animate-spin`}/>
          ) : isCurrentlyPlaying ? (
            <Pause className="w-2.5 h-2.5" style={{ color: colors.primary }} />
          ) : (
            // Use calendar for milestones/hero, hash for events
            item.type === 'event' ? (
              <Hash className="text-blue-500" style={{ color: colors.primary }} />
            ) : (
              <PlayIcon className="w-3 h-3 text-blue-500" style={{ color: colors.primary }} />
            )
          )
        ) : (
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: colors.border }} />
        )}
      </motion.button>

      {/* Content */}
      <motion.button
        className="flex-1 text-left hover:bg-opacity-5 p-2 rounded-md transition-colors"
        style={{ 
          backgroundColor: item.isActive ? colors.primary + '10' : 'transparent',
        }}
        onClick={onContentClick}
        whileHover={{ x: 2 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="space-y-1">
          {/* Milestone/Hero: Single row with date */}
          {(item.type === 'milestone' || item.type === 'hero') && (
            <>
              <div
                className="text-xs font-semibold leading-tight"
                style={{ 
                  color: item.isActive ? colors.primary : colors.foreground 
                }}
              >
                {item.content.content}
                {isCurrentlyPlaying && (
                  <motion.span
                    className="ml-2 text-xs"
                    style={{ color: colors.primary }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ♪
                  </motion.span>
                )}
              </div>
              {item.content.date && (
                <div 
                  className="text-xs opacity-60 font-mono"
                  style={{ color: colors.foreground }}
                >
                  {item.content.date}
                </div>
              )}
            </>
          )}

          {/* Event: Two concise rows, no date */}
          {item.type === 'event' && (
            <div className="space-y-0.5">
              <div
                className="text-xs font-medium leading-snug"
                style={{ 
                  color: item.isActive ? colors.primary : colors.foreground 
                }}
              >
                {item.content.line1}
                {isCurrentlyPlaying && (
                  <motion.span
                    className="ml-2 text-xs"
                    style={{ color: colors.primary }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ♪
                  </motion.span>
                )}
              </div>
              {item.content.line2 && (
                <div
                  className="text-xs font-medium leading-snug opacity-80 pl-1"
                  style={{ 
                    color: item.isActive ? colors.primary : colors.foreground 
                  }}
                >
                  {item.content.line2}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.button>
    </motion.div>
  );
};

export default TimelineProgressRowItem;