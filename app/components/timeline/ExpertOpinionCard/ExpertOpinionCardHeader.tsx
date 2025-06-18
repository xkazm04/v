import { EXPERT_TIMELINE_CONFIG, ExpertTimelineConfigKey } from "@/app/constants/experts";
import { useViewport } from "@/app/hooks/useViewport";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

type Props = {
    isSecondaryLayout?: boolean;
    isActive: boolean;
    side: 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    isStrongest?: boolean;
    expertType: ExpertTimelineConfigKey; 
}


const ExpertOpinionCardHeader = ({isSecondaryLayout, isActive, side, isStrongest, expertType}: Props) => {
    const { isMobile } = useViewport();
    const expertConfig = EXPERT_TIMELINE_CONFIG[expertType];
    const Icon = expertConfig.icon;
    return <div className={`flex items-center gap-3 mb-4 ${isSecondaryLayout ? 'justify-center' :
            side === 'left' ? 'flex-row-reverse' : 'flex-row'
        }`}>
        <motion.div
            className={`rounded-full flex items-center justify-center ${isMobile ? 'w-8 h-8' : isSecondaryLayout ? 'w-8 h-8' : 'w-10 h-10'
                }`}
            style={{
                backgroundColor: expertConfig.color + '25',
                color: expertConfig.color,
                border: `2px solid ${expertConfig.color}40`
            }}
            animate={{
                rotate: isActive ? [0, 5, -5, 0] : 0,
                scale: isActive ? [1, 1.05, 1] : 1
            }}
            transition={{ duration: 0.6, repeat: isActive ? Infinity : 0 }}
        >
            <Icon className={isMobile || isSecondaryLayout ? "w-4 h-4" : "w-5 h-5"} />
        </motion.div>

        <div className={`flex-1 ${isSecondaryLayout ? 'text-center' :
                side === 'left' ? 'text-right' : 'text-left'
            }`}>
            <h4
                className={`font-bold ${isMobile || isSecondaryLayout ? 'text-xs' : 'text-sm'}`}
                style={{ color: expertConfig.color }}
            >
                {isMobile || isSecondaryLayout ? expertConfig.shortLabel : expertConfig.label}
            </h4>
            {!isMobile && !isSecondaryLayout && (
                <p
                    className="text-xs opacity-80 leading-tight mt-0.5"
                    style={{ color: expertConfig.color }}
                >
                    {expertConfig.specialty}
                </p>
            )}
        </div>

        {/* Primary Badge - Star Icon for strongest opinions */}
        {isStrongest && !isSecondaryLayout && (
            <motion.div
                className={`rounded-full flex items-center justify-center ${isMobile ? 'w-7 h-7' : 'w-8 h-8'
                    }`}
                style={{
                    backgroundColor: expertConfig.color,
                    color: 'white',
                    boxShadow: `0 4px 8px ${expertConfig.color}40`
                }}
                animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3
                }}
            >
                <Star className={isMobile ? "w-3.5 h-3.5" : "w-4 h-4"} fill="currentColor" />
            </motion.div>
        )}
    </div>
}

export default ExpertOpinionCardHeader;