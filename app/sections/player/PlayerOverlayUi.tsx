import { Button } from "@/app/components/ui/button";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { cn } from "@/app/lib/utils";
import { VideoWithTimestamps } from "@/app/types/video_api";
import { motion } from "framer-motion";
import { MoreVertical } from "lucide-react";

type Props = {
    index: number;
    currentIndex: number;
    video: VideoWithTimestamps['video']; 
    showTimeline: boolean;
    setShowTimeline: (show: boolean) => void;
    setCurrentIndex: (index: number) => void;
    videos: VideoWithTimestamps[];
}

const PlayerOverlayUi = ({
    currentIndex, 
    video, 
    showTimeline, 
    setShowTimeline, 
    setCurrentIndex, 
    videos 
}: Props) => {
    const { colors, isDark, vintage } = useLayoutTheme();
    
    // Theme-aware gradient styles
    const gradientStyles = {
        top: isDark
            ? 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)'
            : 'linear-gradient(to bottom, rgba(139, 69, 19, 0.3) 0%, rgba(139, 69, 19, 0.1) 50%, transparent 100%)',
        bottom: isDark
            ? 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.5) 60%, transparent 100%)'
            : 'linear-gradient(to top, rgba(139, 69, 19, 0.4) 0%, rgba(139, 69, 19, 0.2) 60%, transparent 100%)'
    };

    const buttonStyles = isDark
        ? {
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white'
          }
        : {
            background: `${vintage.paper}E6`,
            backdropFilter: 'blur(8px)',
            border: `1px solid ${vintage.sepia}60`,
            color: vintage.ink,
            boxShadow: vintage.shadow
          };
    
    return (
        <>
            <div className="absolute inset-0 pointer-events-none">
                {/* Enhanced Theme-Aware Gradients */}
                <div
                    className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
                    style={{ background: gradientStyles.top }}
                />

                <div
                    className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
                    style={{ background: gradientStyles.bottom }}
                />

                {/* Enhanced Right Side Controls */}
                <div className="absolute right-4 bottom-32 flex flex-col items-center gap-4 pointer-events-auto">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="w-12 h-12 rounded-full transition-all duration-300 hover:scale-105"
                            style={buttonStyles}
                            onClick={() => setShowTimeline(!showTimeline)}
                        >
                            <MoreVertical className="w-5 h-5" />
                        </Button>
                        
                        {/* Tooltip */}
                        <motion.div
                            className={cn(
                                "absolute right-full mr-3 top-1/2 transform -translate-y-1/2",
                                "px-2 py-1 rounded-lg text-xs whitespace-nowrap pointer-events-none",
                                isDark 
                                    ? "bg-slate-800 text-white border border-slate-600" 
                                    : "bg-vintage-paper text-vintage-ink border border-vintage-sepia/30"
                            )}
                            initial={{ opacity: 0, x: 10 }}
                            whileHover={{ opacity: 1, x: 0 }}
                            style={{ 
                                boxShadow: isDark ? 'none' : vintage.shadow,
                                backdropFilter: 'blur(8px)'
                            }}
                        >
                            {showTimeline ? 'Hide Timeline' : 'Show Timeline'}
                        </motion.div>
                    </motion.div>
                </div>


                {/* Enhanced Progress Dots */}
                <div className="absolute right-4 top-1/3 flex flex-col space-y-3 pointer-events-auto">
                    {videos.map((_, dotIndex) => (
                        <motion.div
                            key={dotIndex}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300 cursor-pointer backdrop-blur-sm",
                                dotIndex === currentIndex 
                                    ? "scale-125 shadow-lg" 
                                    : ""
                            )}
                            style={{
                                backgroundColor: dotIndex === currentIndex 
                                    ? (isDark ? 'white' : vintage.ink)
                                    : (isDark ? 'rgba(255, 255, 255, 0.5)' : `${vintage.faded}80`),
                                boxShadow: dotIndex === currentIndex
                                    ? (isDark 
                                        ? `0 0 12px ${colors.primary}` 
                                        : `0 0 8px ${vintage.sepia}, ${vintage.shadow}`
                                      )
                                    : 'none',
                                border: isDark 
                                    ? 'none' 
                                    : `1px solid ${vintage.sepia}40`
                            }}
                            whileHover={{ 
                                scale: 1.3,
                                backgroundColor: isDark ? 'white' : vintage.ink
                            }}
                            whileTap={{ scale: 1.1 }}
                            onClick={() => setCurrentIndex(dotIndex)}
                        />
                    ))}
                </div>

                {/* Vintage Paper Texture Overlay (Light Mode Only) */}
                {!isDark && (
                    <div 
                        className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                            backgroundImage: vintage.effects?.paperStain,
                            mixBlendMode: 'multiply'
                        }}
                    />
                )}
            </div>
        </>
    );
};

export default PlayerOverlayUi;