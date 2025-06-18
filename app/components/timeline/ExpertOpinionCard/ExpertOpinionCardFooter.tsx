import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { useViewport } from "@/app/hooks/useViewport";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

type Props = {
    isSecondaryLayout?: boolean;
    expertConfig: {
        mockConfidence: number;
        color: string;
    };
    sourceUrl?: string;
}

const ExpertOpinionCardFooter = ({isSecondaryLayout, expertConfig, sourceUrl}: Props) => {
    const { colors, isDark } = useLayoutTheme();
    const { isMobile } = useViewport();
    const getSourceDomain = (url?: string) => {
        if (!url) return null;
        try {
            const domain = new URL(url).hostname.replace('www.', '');
            return domain.length > 20 ? domain.substring(0, 20) + '...' : domain;
        } catch {
            return 'Source';
        }
    };

    return <div className={`flex items-center justify-between ${isSecondaryLayout ? 'flex-col gap-2' : 'gap-3'
        }`}>

        {/* Confidence Level */}
        <motion.div
            className={`flex items-center gap-2 ${isSecondaryLayout ? 'order-2' : ''
                }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
        >
            <span
                className="text-xs font-medium opacity-70"
                style={{ color: colors.foreground }}
            >
                Confidence
            </span>
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                    <motion.div
                        key={level}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                            backgroundColor: level <= expertConfig.mockConfidence
                                ? expertConfig.color
                                : isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.8)'
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + level * 0.05 }}
                    />
                ))}
            </div>
        </motion.div>

        {/* Source Link */}
        {sourceUrl && (
            <motion.div
                className={`${isSecondaryLayout ? 'order-1' : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
            >
                <motion.a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-200 ${isMobile || isSecondaryLayout ? 'text-xs' : 'text-xs'
                        }`}
                    style={{
                        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(248, 250, 252, 0.8)',
                        borderColor: expertConfig.color + '40',
                        color: expertConfig.color
                    }}
                    whileHover={{
                        borderColor: expertConfig.color,
                        backgroundColor: expertConfig.color + '15',
                        scale: 1.05
                    }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ExternalLink className="w-3 h-3" />
                    <span className="font-medium">
                        {getSourceDomain(sourceUrl)}
                    </span>
                </motion.a>
            </motion.div>
        )}
    </div>
}

export default ExpertOpinionCardFooter;