import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { ExpertType } from '../../../sections/edu/data/timeline';
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


  return (
    <ExpertOpinionCardWrapper
        isSecondaryLayout={isSecondaryLayout}
        isStrongest={isStrongest}
        isExpanded={isExpanded}
        index={index}
        side={side}
        isActive={isActive}
        expertType={expertType}
    >

      {/* SVG Background using SvgComponent from config */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <SvgComponent 
          width={isMobile || isSecondaryLayout ? 200 : 280} 
          height={isMobile || isSecondaryLayout ? 200 : 280} 
          color={isDark ? '#ffffff' : '#000000'} 
        />
      </div>

      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 rounded-[18px] pointer-events-none"
        style={{
          background: isStrongest 
            ? `linear-gradient(${side === 'left' ? '135deg' : '45deg'}, ${expertConfig.color}08, transparent, ${expertConfig.color}15)`
            : 'linear-gradient(135deg, rgba(255,255,255,0.03), transparent, rgba(255,255,255,0.03))'
        }}
      />

      {/* Card Content - Enhanced Layout with left-aligned content */}
      <div className={`relative z-10 ${isMobile ? 'p-4' : isSecondaryLayout ? 'p-4' : 'p-5'}`}>
        <ExpertOpinionCardHeader
          isSecondaryLayout={isSecondaryLayout}
          isActive={isActive}
          side={side}
          isStrongest={isStrongest}
          expertType={expertType}
        />

        {/* Analysis Section - Non-transparent background with left-aligned text */}
        <ExpertOpinionCardContent   
            opinion={opinion}
            isSecondaryLayout={isSecondaryLayout}
            expertConfig={expertConfig}
        />


        {/* Footer Section */}
        <ExpertOpinionCardFooter
          isSecondaryLayout={isSecondaryLayout}
          expertConfig={expertConfig}
          sourceUrl={sourceUrl}
        />
      </div>

      {/* Secondary Layout: Index Indicator */}
      {isSecondaryLayout && (
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold"
          style={{
            backgroundColor: expertConfig.color,
            borderColor: isDark ? '#1e293b' : '#f8fafc',
            color: '#fff',
            boxShadow: `0 2px 8px ${expertConfig.color}40`
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
        >
          {index + 1}
        </motion.div>
      )}

      {/* Enhanced Glow Effect for Active Primary */}
      {isActive && isStrongest && (
        <motion.div
          className="absolute inset-0 rounded-[18px] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at ${side === 'left' ? 'right' : 'left'}, ${expertConfig.color}15, transparent 70%)`,
          }}
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </ExpertOpinionCardWrapper>
  );
}