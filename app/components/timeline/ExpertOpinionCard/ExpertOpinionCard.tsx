import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { ExpertType } from '../../../types/timeline';
import ExpertOpinionCardFooter from './ExpertOpinionCardFooter';
import { EXPERT_TIMELINE_CONFIG, ExpertTimelineConfigKey } from '@/app/constants/experts';
import ExpertOpinionCardHeader from './ExpertOpinionCardHeader';
import ExpertOpinionCardContent from './ExpertOpinionCardContent';
import ExpertOpinionCardWrapper from './ExpertOpinionCardWrapper';

interface ExpertOpinionCardProps {
  opinion: string;
  expertType: ExpertType;
  sourceUrl?: string;
  side: 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  isStrongest: boolean;
  isActive: boolean;
  isExpanded?: boolean;
  index?: number;
  isSecondaryLayout?: boolean;
}

export default function ExpertOpinionCard({
  opinion,
  expertType,
  sourceUrl,
  side,
  isStrongest,
  isActive,
  isExpanded = false,
  index = 0,
  isSecondaryLayout = false
}: ExpertOpinionCardProps) {
  const { isDark } = useLayoutTheme();
  const { isMobile } = useViewport();
  const expertConfig = EXPERT_TIMELINE_CONFIG[expertType];
  const SvgComponent = expertConfig.SvgComponent;

  // ENHANCED: Premium slide-in animations based on side
  const getSlideVariants = () => {
    const distance = isMobile ? 30 : 50;
    const baseDelay = isSecondaryLayout ? index * 0.1 : 0;
    
    switch (side) {
      case 'left':
        return {
          hidden: { x: -distance, opacity: 0, scale: 0.95 },
          visible: { 
            x: 0, 
            opacity: 1, 
            scale: 1,
            transition: { 
              delay: baseDelay,
              duration: 0.6, 
              ease: [0.16, 1, 0.3, 1] 
            }
          }
        };
      case 'right':
        return {
          hidden: { x: distance, opacity: 0, scale: 0.95 },
          visible: { 
            x: 0, 
            opacity: 1, 
            scale: 1,
            transition: { 
              delay: baseDelay,
              duration: 0.6, 
              ease: [0.16, 1, 0.3, 1] 
            }
          }
        };
      default:
        return {
          hidden: { y: distance, opacity: 0, scale: 0.95 },
          visible: { 
            y: 0, 
            opacity: 1, 
            scale: 1,
            transition: { 
              delay: baseDelay,
              duration: 0.6, 
              ease: [0.16, 1, 0.3, 1] 
            }
          }
        };
    }
  };


  return (
    <motion.div
      variants={getSlideVariants()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      animate={isActive && isStrongest ? "floating" : "idle"}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
    >
      <ExpertOpinionCardWrapper
        isSecondaryLayout={isSecondaryLayout}
        isStrongest={isStrongest}
        isExpanded={isExpanded}
        index={index}
        side={side}
        isActive={isActive}
        expertType={expertType}
      >
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5"
          animate={isActive ? { rotate: [0, 2, 0, -2, 0] } : {}}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <SvgComponent 
            width={isMobile || isSecondaryLayout ? 200 : 280} 
            height={isMobile || isSecondaryLayout ? 200 : 280} 
            color={isDark ? '#ffffff' : '#000000'} 
          />
        </motion.div>
        <motion.div 
          className="absolute inset-0 rounded-[18px] pointer-events-none"
          style={{
            background: isStrongest 
              ? `linear-gradient(${side === 'left' ? '135deg' : '45deg'}, ${expertConfig.color}08, transparent, ${expertConfig.color}15)`
              : 'linear-gradient(135deg, rgba(255,255,255,0.03), transparent, rgba(255,255,255,0.03))'
          }}
          animate={isActive && isStrongest ? {
            background: [
              `linear-gradient(${side === 'left' ? '135deg' : '45deg'}, ${expertConfig.color}08, transparent, ${expertConfig.color}15)`,
              `linear-gradient(${side === 'left' ? '135deg' : '45deg'}, ${expertConfig.color}12, transparent, ${expertConfig.color}20)`,
              `linear-gradient(${side === 'left' ? '135deg' : '45deg'}, ${expertConfig.color}08, transparent, ${expertConfig.color}15)`
            ]
          } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* ENHANCED: Card Content with staggered reveals */}
        <motion.div 
          className={`relative z-10 ${isMobile ? 'p-4' : isSecondaryLayout ? 'p-4' : 'p-5'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <ExpertOpinionCardHeader
              isSecondaryLayout={isSecondaryLayout}
              isActive={isActive}
              side={side}
              isStrongest={isStrongest}
              expertType={expertType}
            />
          </motion.div>

          {/* ENHANCED: Analysis Section with typewriter effect on active */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <ExpertOpinionCardContent   
              opinion={opinion}
              isSecondaryLayout={isSecondaryLayout}
              expertConfig={expertConfig}
            />
          </motion.div>

          {/* ENHANCED: Footer Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <ExpertOpinionCardFooter
              isSecondaryLayout={isSecondaryLayout}
              expertConfig={expertConfig}
              sourceUrl={sourceUrl}
            />
          </motion.div>
        </motion.div>

        {/* ENHANCED: Secondary Layout Index with premium animation */}
        {isSecondaryLayout && (
          <motion.div
            className="absolute -top-3 -right-3 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold"
            style={{
              backgroundColor: expertConfig.color,
              borderColor: isDark ? '#1e293b' : '#f8fafc',
              color: '#fff',
              boxShadow: `0 4px 12px ${expertConfig.color}50`
            }}
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ 
              delay: index * 0.1 + 0.3, 
              duration: 0.5,
              type: "spring", 
              stiffness: 200,
              damping: 15
            }}
            whileHover={{ scale: 1.1 }}
          >
            {index + 1}
          </motion.div>
        )}

        {/* ENHANCED: Premium glow effect for active primary cards */}
        {isActive && isStrongest && (
          <motion.div
            className="absolute inset-0 rounded-[18px] pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at ${side === 'left' ? 'right' : 'left'}, ${expertConfig.color}20, transparent 70%)`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.01, 1]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </ExpertOpinionCardWrapper>
    </motion.div>
  );
}