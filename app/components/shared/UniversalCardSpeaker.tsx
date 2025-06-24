import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { useViewport } from "@/app/hooks/useViewport";
import { useUserPreferences } from "@/app/hooks/use-user-preferences";
import { cn } from "@/app/lib/utils";
import { ResearchResult } from "@/app/types/article";
import { Video } from "@/app/types/video_api";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation"; 
import { useState } from "react";

type Props = {
    data?: ResearchResult | Video;
}

// Type guards
const isResearchResult = (data: any): data is ResearchResult => {
    return data && 'statement' in data && 'source' in data;
};

const isVideo = (data: any): data is Video => {
    return data && 'video_url' in data && 'speaker_name' in data;
};

const UniversalCardSpeaker = ({ data }: Props) => {
    const { colors, isDark } = useLayoutTheme();
    const { isMobile } = useViewport();
    const { preferences } = useUserPreferences();
    const router = useRouter();
    const [isSourceHovered, setIsSourceHovered] = useState(false);

    if (!data) {
        return null;
    }

    // Extract speaker/source and profile info
    let speakerName = '';
    let profileId = '';
    let navigationPath = '';

    if (isResearchResult(data)) {
        speakerName = data.source || '';
        profileId = data.profileId || data.profile_id || '';
        navigationPath = profileId ? `/dashboard/${profileId}` : '';
    } else if (isVideo(data)) {
        speakerName = data.speaker_name || data.source || '';
        // For videos, you might navigate to a different route
        navigationPath = `/watch/${data.id}`;
        profileId = data.id; // Use video ID as the clickable identifier
    }

    // Check if language is English or not set (default)
    const isEnglishOrDefault = !preferences.language || preferences.language === 'en';

    const handleSourceClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        e.preventDefault(); 
        console.log('clicked source', speakerName, profileId);
        if (navigationPath) {
            router.push(navigationPath);
        } else {
            console.warn('No navigation path available');
        }
    };

    // If language is not English, render as simple text
    if (!isEnglishOrDefault) {
        return (
            <div className="flex items-center space-x-2 min-w-0 flex-1">
                <span 
                    className={cn(
                        "text-sm font-semibold truncate",
                        "drop-shadow-sm px-2 py-1"
                    )}
                    style={{
                        color: colors.foreground,
                        textShadow: isDark
                            ? '0 1px 2px rgba(0,0,0,0.8)'
                            : '0 1px 2px rgba(255,255,255,0.8)',
                    }}
                >
                    {speakerName}
                </span>
            </div>
        );
    }

    // For English or default language, render as interactive button
    return (
        <div className="flex items-center space-x-2 min-w-0 flex-1">
            <motion.button
                onClick={handleSourceClick}
                onMouseEnter={() => setIsSourceHovered(true)}
                onMouseLeave={() => setIsSourceHovered(false)}
                className={cn(
                    "text-sm font-semibold truncate transition-all duration-200 z-30",
                    "drop-shadow-sm relative group flex items-center gap-1",
                    "px-2 py-1 rounded-md",
                    navigationPath ? "cursor-pointer" : "cursor-default"
                )}
                style={{
                    color: colors.foreground,
                    textShadow: isDark
                        ? '0 1px 2px rgba(0,0,0,0.8)'
                        : '0 1px 2px rgba(255,255,255,0.8)',
                    zIndex: 20
                }}
                disabled={!navigationPath}
            >
                <span className="truncate">{speakerName}</span>
                {navigationPath && !isMobile && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: -5 }}
                        animate={{
                            opacity: isSourceHovered ? 1 : 0,
                            x: isSourceHovered ? 0 : -5
                        }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <ExternalLink className="w-3 h-3" />
                    </motion.div>
                )}
            </motion.button>
        </div>
    );
};

export default UniversalCardSpeaker;