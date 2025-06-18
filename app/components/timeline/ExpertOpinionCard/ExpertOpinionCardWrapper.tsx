import { EXPERT_TIMELINE_CONFIG } from "@/app/constants/experts";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { useViewport } from "@/app/hooks/useViewport";
import { motion } from "framer-motion";

type Props = {
    children: React.ReactNode;
    isSecondaryLayout?: boolean;
    isStrongest?: boolean;
    isExpanded?: boolean;
    index: number;
    side: 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    isActive?: boolean;
    expertType: string; 
}

const ExpertOpinionCardWrapper = ({ children, isSecondaryLayout, isStrongest, isExpanded, index, side, isActive, expertType }: Props) => {
    const { isDark } = useLayoutTheme();
    const { isMobile, isTablet } = useViewport();
    const expertConfig = EXPERT_TIMELINE_CONFIG[expertType];

    const getStackTransform = () => {
        if (isSecondaryLayout || !isExpanded || isStrongest) return { x: 0, y: 0, scale: 1, zIndex: 10 };

        const offset = index * (isMobile ? 8 : 12);
        const scaleReduction = index * 0.02;

        const isLeftSide = side === 'left' || side === 'top-left' || side === 'bottom-left';
        const isRightSide = side === 'right' || side === 'top-right' || side === 'bottom-right';

        return {
            x: isLeftSide ? -offset : isRightSide ? offset : 0,
            y: offset * 0.5,
            scale: 1 - scaleReduction,
            zIndex: 10 - index
        };
    };

    const stackTransform = getStackTransform();

    const getCardDimensions = () => {
        if (isSecondaryLayout) {
            if (isMobile || isTablet) {
                return "min-h-[120px] max-w-full";
            } else {
                return "min-h-[160px] w-[450px]"; 
            }
        } else if (isMobile || isTablet) {
            return "min-h-[140px] max-w-full";
        } else {
            return "min-h-[180px] w-[500px]"; 
        }
    };

    const getTextAlignment = () => {
        if (isSecondaryLayout) {
            return 'text-center';
        } else {
            const isLeftSide = side === 'left' || side === 'top-left' || side === 'bottom-left';
            const isRightSide = side === 'right' || side === 'top-right' || side === 'bottom-right';
            
            if (isLeftSide) return 'ml-auto';
            if (isRightSide) return 'mr-auto';
            return 'mx-auto';
        }
    };

    const getCardStyling = () => {
        const baseOpacity = isDark ? '15' : '08';
        const strongOpacity = isDark ? '25' : '15';

        if (isStrongest) {
            return {
                backgroundColor: expertConfig.color + strongOpacity,
                borderColor: expertConfig.color,
                glowColor: expertConfig.color + '40'
            };
        } else {
            return {
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(248, 250, 252, 0.85)',
                borderColor: expertConfig.color + '60',
                glowColor: expertConfig.color + '20'
            };
        }
    };

    const cardStyling = getCardStyling();
    
    return <motion.div
        className={`relative backdrop-blur-md border ${getCardDimensions()} ${getTextAlignment()} overflow-hidden`}
        style={{
            backgroundColor: cardStyling.backgroundColor,
            borderColor: cardStyling.borderColor,
            borderRadius: isMobile ? '16px' : '20px',
            boxShadow: isStrongest && isActive
                ? `0 20px 40px ${cardStyling.glowColor}, 0 0 0 1px ${expertConfig.color}30`
                : `0 8px 24px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`,
            x: stackTransform.x,
            y: stackTransform.y,
            scale: stackTransform.scale,
            zIndex: stackTransform.zIndex
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{
            opacity: 1,
            y: stackTransform.y,
            x: stackTransform.x,
            scale: stackTransform.scale
        }}
        whileHover={{
            scale: stackTransform.scale + 0.02,
            y: stackTransform.y - 4,
            boxShadow: `0 25px 45px ${cardStyling.glowColor}`,
            borderColor: expertConfig.color,
            transition: { duration: 0.2 }
        }}
        transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
            delay: index * 0.05
        }}
    >{children}</motion.div>
}

export default ExpertOpinionCardWrapper;