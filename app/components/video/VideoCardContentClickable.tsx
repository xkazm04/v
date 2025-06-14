import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { cn } from "@/app/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { ExternalLink, BookOpen, Building2 } from 'lucide-react';
import Link from 'next/link';
import { Video } from "@/app/types/video_api";

type Props = {
    video: Video;
}

const linkButtonVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.2 }
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.15 }
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

const VideoCardContentClickable = ({video}: Props) => {
    const { colors } = useLayoutTheme();
    const [sourceHovered, setSourceHovered] = useState(false);
    const [topicHovered, setTopicHovered] = useState(false);

    // Mock topic for now - will come from API later
    const mockTopic = video.title ? `Politics` : null;
    return <div className="flex flex-row gap-2">
        {/* Source - Clickable to Dashboard */}
        <motion.div
            variants={linkButtonVariants}
            whileHover="hover"
            whileTap="tap"
            onHoverStart={() => setSourceHovered(true)}
            onHoverEnd={() => setSourceHovered(false)}
        >
            <Link
                href="/dashboard"
                className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all duration-200",
                    "border font-medium text-xs hover:shadow-md",
                    "group relative overflow-hidden cursor-pointer"
                )}
                style={{
                    backgroundColor: sourceHovered
                        ? `${colors.primary}15`
                        : `${colors.card.background}f0`,
                    borderColor: sourceHovered
                        ? `${colors.primary}60`
                        : `${colors.border}60`,
                    color: sourceHovered ? colors.primary : colors.foreground
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <Building2 className="w-3 h-3" />
                <span>{video.source} TBD</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70" />

                {/* Hover effect background */}
                <motion.div
                    className="absolute inset-0 -z-10"
                    style={{ backgroundColor: `${colors.primary}10` }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: sourceHovered ? 1 : 0,
                        opacity: sourceHovered ? 1 : 0
                    }}
                    transition={{ duration: 0.2 }}
                />
            </Link>
        </motion.div>

        {/* Topic - Clickable to Timeline (if available) */}
        {mockTopic && (
            <motion.div
                variants={linkButtonVariants}
                className="absolute right-0 bottom-0"
                whileHover="hover"
                whileTap="tap"
                onHoverStart={() => setTopicHovered(true)}
                onHoverEnd={() => setTopicHovered(false)}
            >
                <Link
                    href="/timeline"
                    className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all duration-200",
                        "border font-medium text-xs hover:shadow-md",
                        "group relative overflow-hidden cursor-pointer"
                    )}
                    style={{
                        backgroundColor: topicHovered
                            ? `${colors.accent}15`
                            : `${colors.muted}80`,
                        borderColor: topicHovered
                            ? `${colors.accent}60`
                            : `${colors.border}40`,
                        color: topicHovered ? colors.accent : colors.mutedForeground
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <BookOpen className="w-3 h-3" />
                    <span>Topic TBD</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-70" />

                    {/* Hover effect background */}
                    <motion.div
                        className="absolute inset-0 -z-10"
                        style={{ backgroundColor: `${colors.accent}10` }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: topicHovered ? 1 : 0,
                            opacity: topicHovered ? 1 : 0
                        }}
                        transition={{ duration: 0.2 }}
                    />
                </Link>
            </motion.div>
        )}</div>
}

export default VideoCardContentClickable;