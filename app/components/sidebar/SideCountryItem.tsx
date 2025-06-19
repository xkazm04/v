import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useFilterStore, useSelectedCountry } from '@/app/stores/filterStore';
import { getCountryFlagSvg } from '@/app/helpers/countries';
import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/app/lib/utils';

const CountryFlagBackground = ({ 
  flagSvg, 
  alt, 
  isFilterActive, 
  isHovered 
}: { 
  flagSvg: string; 
  alt: string; 
  isFilterActive: boolean;
  isHovered: boolean;
}) => {
  const [imageError, setImageError] = useState(false);
  
  if (imageError) {
    return null;
  }
  
  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden rounded-lg"
      animate={{
        opacity: isFilterActive ? 0.4 : isHovered ? 0.3 : 0.2
      }}
      transition={{ duration: 0.3 }}
    >
      <Image
        src={flagSvg}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setImageError(true)}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: isFilterActive 
            ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.12))'
            : 'linear-gradient(135deg, rgba(0,0,0,0.12), rgba(0,0,0,0.04), rgba(0,0,0,0.12))'
        }}
      />
    </motion.div>
  );
};

interface SideCountryItemProps {
    mounted: boolean;
    isCollapsed: boolean;
    country: {
        name: string;
        flag: string;
        href: string;
        code: string;
        isDefault?: boolean;
    };
    isActiveRoute?: boolean;
}

const SideCountryItem = ({ mounted, isCollapsed, country, isActiveRoute = false }: SideCountryItemProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const { colors, sidebarColors, isDark } = useLayoutTheme();
    
    // Filter store state
    const { selectedCountry } = useFilterStore();
    const { setSelectedCountry } = useSelectedCountry();
    
    // Determine if this country is the active filter
    const isFilterActive = selectedCountry === country.code || 
                          (country.isDefault && selectedCountry === 'worldwide') ||
                          isActiveRoute;
    
    // Get flag SVG path for background (only for non-worldwide countries)
    const flagSvgPath = country.code !== 'worldwide' ? getCountryFlagSvg(country.code) : null;
    
    // Mock article counts for visual appeal
    const articleCount = country.isDefault ? 1247 : Math.floor(Math.random() * 500) + 50;

    const handleCountryClick = () => {
        if (country.isDefault || country.code === 'worldwide') {
            setSelectedCountry('worldwide');
        } else {
            setSelectedCountry(country.code);
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={country.code} 
                layout 
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25,
                    opacity: { duration: 0.2 },
                    layout: { duration: 0.3 }
                }}
                whileHover={{ x: isCollapsed ? 0 : 4 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <motion.button
                    onClick={handleCountryClick}
                    className={cn(
                        'w-full relative overflow-hidden group rounded-xl transition-all duration-300', // Increased border radius
                        isCollapsed ? 'h-10 px-2' : 'h-14 px-0', // Slightly taller for better proportions
                        country.isDefault && 'font-medium'
                    )}
                    style={{
                        background: isFilterActive 
                            ? isDark 
                                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.18), rgba(139, 92, 246, 0.12))'
                                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.10), rgba(168, 85, 247, 0.08))'
                            : 'transparent',
                        border: isFilterActive 
                            ? `1px solid ${isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.35)'}` 
                            : `1px solid ${isDark ? 'rgba(71, 85, 105, 0.2)' : 'rgba(148, 163, 184, 0.15)'}`,
                        boxShadow: isFilterActive 
                            ? `0 4px 12px ${isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.12)'}`
                            : 'none'
                    }}
                    whileHover={{
                        backgroundColor: isFilterActive
                            ? isDark 
                                ? 'rgba(59, 130, 246, 0.22)' 
                                : 'rgba(59, 130, 246, 0.18)'
                            : isDark 
                                ? 'rgba(71, 85, 105, 0.12)' 
                                : 'rgba(248, 250, 252, 0.8)',
                        borderColor: isFilterActive
                            ? isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.45)'
                            : isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(148, 163, 184, 0.25)'
                    }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isCollapsed ? (
                        // ✅ Collapsed view - just flag icon
                        <div className="flex items-center justify-center h-full">
                            <motion.span 
                                className="text-lg drop-shadow-sm"
                                whileHover={{ scale: 1.1, rotate: isHovered ? 3 : 0 }}
                                transition={{ type: "spring", stiffness: 400 }}
                                animate={{ scale: isFilterActive ? 1.05 : 1 }}
                            >
                                {country.flag}
                            </motion.span>
                        </div>
                    ) : (
                        // ✅ Expanded view - split layout: 45% flag area, 55% text area for better balance
                        <div className="flex h-full">
                            {/* ✅ Left 45% - Flag Area */}
                            <div className="w-[45%] relative flex items-center justify-center">
                                {/* SVG Flag Background (only for non-worldwide countries) */}
                                {flagSvgPath && (
                                    <CountryFlagBackground 
                                        flagSvg={flagSvgPath}
                                        alt={country.name}
                                        isFilterActive={isFilterActive}
                                        isHovered={isHovered}
                                    />
                                )}
                                
                                {/* Flag Icon */}
                                <motion.span 
                                    className="text-2xl drop-shadow-sm relative z-10"
                                    whileHover={{ scale: 1.1, rotate: isHovered ? 3 : 0 }}
                                    transition={{ type: "spring", stiffness: 400 }}
                                    animate={{ scale: isFilterActive ? 1.05 : 1 }}
                                >
                                    {country.flag}
                                </motion.span>
                            </div>

                            {/* ✅ Right 55% - Text Area with improved spacing */}
                            <div className="w-[55%] flex flex-col justify-center px-3 py-1.5">
                                {mounted && (
                                    <AnimatePresence initial={false}>
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="space-y-1"
                                        >
                                            {/* Country Code */}
                                            <motion.div
                                                className="text-xs font-bold uppercase tracking-wider leading-none"
                                                style={{
                                                    color: isFilterActive 
                                                        ? isDark ? '#60a5fa' : '#2563eb'
                                                        : sidebarColors.foreground
                                                }}
                                                animate={{ fontWeight: isFilterActive ? 700 : 600 }}
                                            >
                                                {country.code === 'worldwide' ? 'ALL' : country.code.toUpperCase()}
                                            </motion.div>

                                            {/* Article Count */}
                                            <motion.div
                                                className="text-xs leading-none"
                                                style={{ color: colors.mutedForeground }}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 }}
                                            >
                                                {articleCount.toLocaleString()} articles
                                            </motion.div>

                                            {/* Special badge for worldwide */}
                                            {country.isDefault && (
                                                <motion.div
                                                    className="text-xs px-1.5 py-0.5 rounded-md text-center font-medium leading-none"
                                                    style={{
                                                        background: isDark 
                                                            ? 'rgba(139, 92, 246, 0.25)' 
                                                            : 'rgba(139, 92, 246, 0.15)',
                                                        color: isDark ? '#c084fc' : '#8b5cf6',
                                                        fontSize: '10px'
                                                    }}
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    Global
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Enhanced Active indicator */}
                    <AnimatePresence>
                        {isFilterActive && (
                            <motion.div
                                className="absolute right-2 top-1/2"
                                initial={{ scale: 0, opacity: 0, y: '-50%' }}
                                animate={{ scale: 1, opacity: 1, y: '-50%' }}
                                exit={{ scale: 0, opacity: 0, y: '-50%' }}
                                transition={{ type: "spring", stiffness: 400, delay: 0.1 }}
                            >
                                <motion.div
                                    className="w-1 h-6 rounded-full shadow-lg"
                                    style={{ backgroundColor: isDark ? '#60a5fa' : '#2563eb' }}
                                    animate={{
                                        boxShadow: [
                                            `0 0 0 0 ${isDark ? 'rgba(96, 165, 250, 0.4)' : 'rgba(37, 99, 235, 0.4)'}`,
                                            `0 0 0 3px ${isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.1)'}`,
                                            `0 0 0 0 ${isDark ? 'rgba(96, 165, 250, 0.4)' : 'rgba(37, 99, 235, 0.4)'}`
                                        ]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </motion.div>
        </AnimatePresence>
    );
};

export default SideCountryItem;