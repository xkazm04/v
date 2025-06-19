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
      className="absolute max-w-[100px] inset-0 overflow-hidden rounded-lg"
      animate={{
        opacity: isFilterActive ? 0.55 : isHovered ? 0.35 : 0.28
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
      {/* Overlay gradient for better text readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20"
        style={{
          background: isFilterActive 
            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05), rgba(59, 130, 246, 0.1))'
            : 'linear-gradient(135deg, rgba(0,0,0,0.1), rgba(0,0,0,0.02), rgba(0,0,0,0.1))'
        }}
      />
    </motion.div>
  );
};

type Props = {
    country: {
        name: string;
        flag: string;
        href: string;
        code: string;
        isDefault?: boolean;
    };
    isActiveRoute: boolean;
    isCollapsed: boolean;
    mounted: boolean;
}

const SideCountryItem = ({ country, isActiveRoute, isCollapsed, mounted }: Props) => {
    const { isDark } = useLayoutTheme();
    const [isHovered, setIsHovered] = useState(false);
    
    // Get current filter state
    const selectedCountry = useSelectedCountry();
    const { setSelectedCountry } = useFilterStore();

    const isFilterActive = selectedCountry === country.code;
    const flagSvgPath = country.code !== 'worldwide' ? getCountryFlagSvg(country.code) : null;

    const handleCountryClick = (e: React.MouseEvent) => {
        e.preventDefault();

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
                whileHover={{ x: isCollapsed ? 0 : 6 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <motion.button
                    onClick={handleCountryClick}
                    className={cn(
                        'w-full justify-start relative overflow-hidden group h-12 flex flex-row p-3 rounded-lg transition-all duration-300',
                        isCollapsed && 'justify-center px-2 h-10',
                        country.isDefault && 'font-medium'
                    )}
                    whileHover={{
                        backgroundColor: isFilterActive
                            ? isDark 
                                ? 'rgba(34, 197, 94, 0.25)' 
                                : 'rgba(34, 197, 94, 0.18)'
                            : isDark 
                                ? 'rgba(71, 85, 105, 0.12)' 
                                : 'rgba(248, 250, 252, 0.8)'
                    }}
                    whileTap={{ scale: 0.98 }}
                >
                    {/* ✅ SVG Flag Background (only for non-worldwide countries) */}
                    {flagSvgPath && (
                        <CountryFlagBackground 
                            flagSvg={flagSvgPath}
                            alt={country.name}
                            isFilterActive={isFilterActive}
                            isHovered={isHovered}
                        />
                    )}

                    {/* Hover background effect */}
                    <motion.div
                        className="absolute inset-0 rounded-lg"
                        style={{
                            background: isDark
                                ? `linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)`
                                : `linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(59, 130, 246, 0.03) 100%)`
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                    />

                    {/* Selection pulse effect */}
                    {isFilterActive && (
                        <motion.div
                            className="absolute inset-0 rounded-lg border-2 pointer-events-none"
                            style={{ borderColor: isDark ? '#4ade80' : '#16a34a' }}
                            animate={{
                                opacity: [0, 0.3, 0],
                                scale: [1, 1.02, 1]
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    )}
                </motion.button>
            </motion.div>
        </AnimatePresence>
    );
};

export default SideCountryItem;