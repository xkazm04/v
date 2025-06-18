import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useTimelineAudioStore } from '@/app/stores/useTimelineAudioStore';
import { useCallback } from 'react';

const TimelineProgressFooter = () => {
    const { colors, isDark } = useLayoutTheme();
    const { 
        volume, 
        isMuted, 
        setVolume, 
        setMuted, 
        isPlaying,
        currentTrack,
        pauseTrack,
        stopTrack,
        isAutoPlayMode,
        setAutoPlayMode
    } = useTimelineAudioStore();

    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (isMuted && newVolume > 0) {
            setMuted(false);
        }
    }, [setVolume, setMuted, isMuted]);

    const handleMuteToggle = useCallback(() => {
        setMuted(!isMuted);
    }, [isMuted, setMuted]);

    const handleStopAudio = useCallback(() => {
        stopTrack();
    }, [stopTrack]);

    const handlePauseAudio = useCallback(() => {
        pauseTrack();
    }, [pauseTrack]);

    const handleAutoPlayToggle = useCallback(() => {
        setAutoPlayMode(!isAutoPlayMode);
    }, [isAutoPlayMode, setAutoPlayMode]);

    return (
        <div 
            className="px-4 py-3 flex flex-row justify-between border-t rounded-b-2xl"
            style={{ 
                borderColor: colors.border + '30',
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(248, 250, 252, 0.95)',
            }}
        >
            {/* Volume Control */}
            <div className="flex items-center gap-3">
                <motion.button
                    onClick={handleMuteToggle}
                    className="p-1 rounded hover:bg-opacity-10"
                    style={{ backgroundColor: colors.primary + '10' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {isMuted ? (
                        <VolumeX className="w-4 h-4" style={{ color: colors.foreground + '60' }} />
                    ) : (
                        <Volume2 className="w-4 h-4" style={{ color: colors.primary }} />
                    )}
                </motion.button>
                
                <div className="relative">
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, ${colors.primary} 0%, ${colors.primary} ${(isMuted ? 0 : volume) * 100}%, ${colors.border} ${(isMuted ? 0 : volume) * 100}%, ${colors.border} 100%)`
                        }}
                    />
                </div>
                
                <span className="text-xs tabular-nums" style={{ color: colors.foreground + '60' }}>
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
            </div>

            {/* Auto-play toggle */}
            <div className="flex items-center gap-2 justify-between border-t" style={{ borderColor: colors.border + '20' }}>
                <span className="text-xs" style={{ color: colors.foreground + '80' }}>
                    Auto-play
                </span>
                <motion.button
                    onClick={handleAutoPlayToggle}
                    className="relative w-8 h-4 rounded-full"
                    style={{ 
                        backgroundColor: isAutoPlayMode ? colors.primary : colors.border 
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.div
                        className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"
                        animate={{
                            x: isAutoPlayMode ? 16 : 2
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                </motion.button>
            </div>
        </div>
    );
};

export default TimelineProgressFooter;