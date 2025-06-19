import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { useViewport } from "@/app/hooks/useViewport";
import { cn } from "@/app/lib/utils";
import { ResearchResult } from "@/app/types/article";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation"; 
import { useState } from "react";

type Props = {
    research?: ResearchResult;
}

const NewsCardSpeaker = ({ research }: Props) => {
    const { colors, isDark } = useLayoutTheme();
    const { isMobile } = useViewport();
    const router = useRouter();
    const [isSourceHovered, setIsSourceHovered] = useState(false);

    if (!research) {
        return null;
    }

    const handleSourceClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        e.preventDefault(); 
        console.log('clicked source', research.source, research.profileId);
        if (research.profileId) {
            router.push(`/dashboard/${research.profileId}`);
        } else {
            console.warn('No profileId available for navigation');
        }
    };

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
                    research.profileId ? "cursor-pointer" : "cursor-default"
                )}
                style={{
                    color: colors.foreground,
                    textShadow: isDark
                        ? '0 1px 2px rgba(0,0,0,0.8)'
                        : '0 1px 2px rgba(255,255,255,0.8)',
                    zIndex: 20
                }}
                disabled={!research.profileId}
            >
                <span className="truncate">{research.source}</span>
                {research.profileId && !isMobile && (
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

export default NewsCardSpeaker;