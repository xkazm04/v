import { Button } from "@/app/components/ui/button";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { VideoWithTimestamps } from "@/app/types/video_api";
import { motion } from "framer-motion"
import { ChevronDown, ChevronUp, MoreVertical } from "lucide-react";

type Props = {
    index: number;
    currentIndex: number;
    showTimeline: boolean;
    setShowTimeline: (show: boolean) => void;
    setCurrentIndex: (index: number) => void;
    videos: VideoWithTimestamps[];
}

const PlayerOverlayUi = ({currentIndex, showTimeline, setShowTimeline, setCurrentIndex, videos }: Props) => {
    const { colors, isDark } = useLayoutTheme();
    return <>
        <div className="absolute inset-0 pointer-events-none">
            {/* Enhanced Gradients */}
            <div
                className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
                style={{
                    background: `linear-gradient(to bottom, 
                    rgba(0, 0, 0, 0.6) 0%, 
                    rgba(0, 0, 0, 0.3) 50%, 
                    transparent 100%
                  )`
                }}
            />

            <div
                className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
                style={{
                    background: `linear-gradient(to top, 
                    rgba(0, 0, 0, 0.8) 0%, 
                    rgba(0, 0, 0, 0.4) 60%, 
                    transparent 100%
                  )`
                }}
            />

            {/* Enhanced Right Side Controls */}
            <div className="absolute right-4 bottom-32 flex flex-col items-center gap-4 pointer-events-auto">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-12 h-12 rounded-full text-white hover:bg-white/20 backdrop-blur-md border border-white/20"
                        style={{
                            background: isDark
                                ? 'rgba(15, 23, 42, 0.6)'
                                : 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(8px)'
                        }}
                        onClick={() => setShowTimeline(!showTimeline)}
                    >
                        <MoreVertical className="w-5 h-5" />
                    </Button>
                </motion.div>
            </div>

            {/* Enhanced Navigation Hints */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-auto">
                <motion.div
                    className="flex flex-col items-center space-y-3 text-white/60 backdrop-blur-sm rounded-full p-3"
                    style={{
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                >
                    <motion.div
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <ChevronUp className="w-6 h-6" />
                    </motion.div>
                    <div className="text-xs font-medium">Swipe</div>
                    <motion.div
                        animate={{ y: [2, -2, 2] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <ChevronDown className="w-6 h-6" />
                    </motion.div>
                </motion.div>
            </div>

            {/* Enhanced Progress Dots */}
            <div className="absolute right-4 top-1/3 flex flex-col space-y-2 pointer-events-auto">
                {videos.map((_, dotIndex) => (
                    <motion.div
                        key={dotIndex}
                        className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer backdrop-blur-sm ${dotIndex === currentIndex ? 'bg-white scale-125 shadow-lg' : 'bg-white/50'
                            }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 1.1 }}
                        onClick={() => setCurrentIndex(dotIndex)}
                        style={{
                            boxShadow: dotIndex === currentIndex
                                ? `0 0 12px ${colors.primary}`
                                : 'none'
                        }}
                    />
                ))}
            </div>
        </div>
    </>
}

export default PlayerOverlayUi;