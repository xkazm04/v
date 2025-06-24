import { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ResearchResult } from '@/app/types/article';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { cn } from '@/app/lib/utils';
import { Divider } from '../ui/divider';
import { NewsCardFooter } from './NewsCardFooter';
import { getCountryFlagSvg, getCountryName } from '@/app/helpers/countries';
import Image from 'next/image';

interface NewsCardContentProps {
  isCompact?: boolean;
  research: ResearchResult;
  onQuoteClick?: () => void;
}

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

const DynamicCountryFlagBackground = memo(({ 
  countryCode, 
  isHovered 
}: { 
  countryCode?: string; 
  isHovered: boolean;
}) => {
  const [imageError, setImageError] = useState(false);
  const { isDark } = useLayoutTheme();
  
  const flagSvgPath = useMemo(() => {
    if (!countryCode) return '/flags/worldwide.svg'; 
    
    const normalizedCode = countryCode.toLowerCase().trim();
    const mappedCode = normalizedCode;
    
    try {
      return getCountryFlagSvg(mappedCode);
    } catch (error) {
      console.warn(`Failed to get flag for country: ${countryCode}`, error);
      return '/flags/worldwide.svg';
    }
  }, [countryCode]);
  
  const countryDisplayName = useMemo(() => {
    if (!countryCode) return 'Unknown Country';
    
    try {
      return getCountryName(countryCode);
    } catch (error) {
      return `${countryCode.toUpperCase()}`;
    }
  }, [countryCode]);
  
  // Don't render if image failed to load
  if (imageError) {
    return null;
  }
  
  return (
    <motion.div 
      className="absolute w-full h-full inset-0 overflow-hidden transition-all duration-300 ease-linear"
      style={{ zIndex: 1 }}
      animate={{
        opacity: isHovered ? 0.15 : 0.08
      }}
      transition={{ duration: 0.3 }}
    >
      <Image
        src={flagSvgPath}
        alt={`Flag of ${countryDisplayName}`}
        fill
        className={cn(
          "object-cover pointer-events-none transition-all duration-300",
          isHovered ? "opacity-100" : "opacity-60"
        )}
        style={{
          filter: isDark 
            ? 'brightness(0.7) contrast(1.1)' 
            : 'brightness(1.1) contrast(0.9)',
          objectPosition: 'center'
        }}
        onError={() => {
          console.warn(`Failed to load flag image: ${flagSvgPath}`);
          setImageError(true);
        }}
        // ✅ **Performance optimization**
        loading="lazy"
        quality={75}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      
      {/* ✅ **Enhanced overlay gradient for better text readability** */}
      <div 
        className="absolute inset-0 transition-all duration-300"
        style={{
          background: isDark
            ? isHovered
              ? 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2), rgba(0,0,0,0.4))'
              : 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3), rgba(0,0,0,0.6))'
            : isHovered
              ? 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1), rgba(255,255,255,0.3))'
              : 'linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2), rgba(255,255,255,0.5))'
        }}
      />
    </motion.div>
  );
});

DynamicCountryFlagBackground.displayName = 'DynamicCountryFlagBackground';

const NewsCardContent = memo(function NewsCardContent({
  isCompact = false,
  research,
  onQuoteClick
}: NewsCardContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isQuoteHovered, setIsQuoteHovered] = useState(false);
  const { colors } = useLayoutTheme();
  const { isMobile } = useViewport();

  const maxLength = isCompact ? 120 : 180;
  const shouldTruncate = useMemo(() => {
    return (research.statement?.length || 0) > maxLength;
  }, [research.statement, maxLength]);

  const displayText = useMemo(() => {
    if (!research.statement) return 'No statement available';

    if (isExpanded || !shouldTruncate) {
      return research.statement;
    }

    return `${research.statement.slice(0, maxLength)}...`;
  }, [research.statement, isExpanded, shouldTruncate, maxLength]);

  // ✅ **Extract and normalize country code**
  const countryCode = useMemo(() => {
    // Handle various country field formats
    const country = research.country || research.source;
    
    if (!country) return undefined;
    
    // Handle string country values
    if (typeof country === 'string') {
      // Remove common prefixes and clean up
      const cleaned = country
        .toLowerCase()
        .replace(/^(country_|flag_|nation_)/, '')
        .replace(/\.(svg|png|jpg|jpeg)$/, '')
        .trim();
      
      return cleaned;
    }
    
    return undefined;
  }, [research.country, research.source]);

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (shouldTruncate && !isExpanded) {
      setIsExpanded(true);
    } else {
      if (!isMobile) {
        onQuoteClick?.();
      }
    }
  };

  return (
    <motion.div
      className="relative z-10 flex flex-col h-full justify-between p-4 min-h-[180px] cursor-pointer hover:text-bold"
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      onClick={handleQuoteClick}
      onMouseEnter={() => setIsQuoteHovered(true)}
      onMouseLeave={() => setIsQuoteHovered(false)}
    >
      {/* ✅ **UPDATED: Dynamic country flag background** */}
      <DynamicCountryFlagBackground 
        countryCode={countryCode}
        isHovered={isQuoteHovered}
      />
      
      {/* ✅ Clean, readable quote section */}
      <motion.div
        className="flex flex-col items-start justify-between flex-1"
        variants={itemVariants}
      >
        <div className="w-full relative">
          <blockquote
            className={cn(
              "font-medium leading-relaxed transition-all duration-300 line-clamp-5",
              isCompact ? 'text-sm' : 'md:text-lg',
              "relative group rounded-lg p-3 -m-3",
              "border border-transparent"
            )}
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              color: colors.foreground,
              zIndex: 15
            }}
          >
            <motion.span
              className="relative block"
              animate={{
                // ✅ Simple color transition - no text shadow effects
                color: isQuoteHovered && !isMobile
                  ? colors.primary
                  : colors.foreground
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              "{displayText}"
            </motion.span>

            {/* ✅ Clean hover background */}
            {!isMobile && (
              <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, 
                    ${colors.primary}08 0%, 
                    ${colors.primary}04 50%, 
                    ${colors.primary}08 100%
                  )`,
                  border: `1px solid ${colors.primary}20`
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: isQuoteHovered ? 1 : 0,
                  scale: isQuoteHovered ? 1 : 0.95
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            )}
          </blockquote>
        </div>
      </motion.div>

      <div className="my-3">
        <Divider variant='glow' />
      </div>
      
      {research.verdict && (
        <motion.div
          className="text-sm font-medium line-clamp-2 transition-colors duration-300"
          variants={itemVariants}
          style={{
            color: isQuoteHovered && !isMobile
              ? colors.mutedForeground
              : `${colors.mutedForeground}cc`
          }}
        >
          {research.verdict}
        </motion.div>
      )}
      
      <NewsCardFooter
        research={research}
        layout={'grid'}
        isHovered={false}
      />
    </motion.div>
  );
});

export default NewsCardContent;