import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/app/lib/utils';
import { EnhancedBadge } from '../ui/enhanced-badge';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useFilterStore, useSelectedCountry } from '@/app/stores/filterStore';


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
    const { colors, sidebarColors, isDark } = useLayoutTheme();
    
    // Get current filter state
    const selectedCountry = useSelectedCountry();
    const { setSelectedCountry } = useFilterStore();
    
    // Get real country counts from API
    // const { data: countryCounts = {}, isLoading: countsLoading } = useCountryCounts();
    
    // Check if this country is currently selected in filters
    const isFilterActive = selectedCountry === country.code;
    
    // Get the actual count for this country from API (don't show count for worldwide/default)
    // const actualCount = country.isDefault ? 0 : (countryCounts[country.code] || 0);

    const handleCountryClick = (e: React.MouseEvent) => {
        e.preventDefault();
        
        // Handle worldwide/default countries
        if (country.isDefault || country.code === 'worldwide') {
            setSelectedCountry('worldwide');
        } else {
            setSelectedCountry(country.code);
        }
    };

    return (
        <motion.div
            whileHover={{ x: isCollapsed ? 0 : 6 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            <motion.button
                onClick={handleCountryClick}
                className={cn(
                    'w-full justify-start relative overflow-hidden group h-10 flex flex-row p-2 rounded-lg transition-all duration-200',
                    isCollapsed && 'justify-center px-2',
                    country.isDefault && 'font-medium'
                )}
                style={{
                    background: isFilterActive 
                        ? isDark 
                            ? `linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)`
                            : `linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)`
                        : 'transparent',
                    color: isFilterActive 
                        ? isDark ? '#4ade80' : '#16a34a'
                        : sidebarColors.foreground,
                    borderLeft: isFilterActive 
                        ? `3px solid ${isDark ? '#4ade80' : '#16a34a'}` 
                        : '3px solid transparent'
                }}
                whileHover={{
                    backgroundColor: isDark 
                        ? 'rgba(71, 85, 105, 0.08)' 
                        : 'rgba(248, 250, 252, 0.6)'
                }}
            >
                {/* Hover background effect */}
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: isDark
                            ? `linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(59, 130, 246, 0.03) 100%)`
                            : `linear-gradient(135deg, rgba(34, 197, 94, 0.03) 0%, rgba(59, 130, 246, 0.02) 100%)`
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                />

                <div className="relative z-10 flex items-center w-full">
                    <motion.span 
                        className="text-lg mr-2 flex-shrink-0"
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        {country.flag}
                    </motion.span>

                    {mounted && (
                        <AnimatePresence initial={false}>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    className="flex items-center justify-between flex-1 overflow-hidden"
                                >
                                    <span 
                                        className="whitespace-nowrap text-sm font-medium transition-colors duration-200"
                                        style={{
                                            color: isFilterActive 
                                                ? isDark ? '#4ade80' : '#16a34a'
                                                : sidebarColors.foreground
                                        }}
                                    >
                                        {country.name}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>

                {/* Active indicator */}
                {isFilterActive && (
                    <motion.div
                        className="absolute right-2 top-1/2 w-1 h-4 rounded-full"
                        style={{ backgroundColor: isDark ? '#4ade80' : '#16a34a' }}
                        initial={{ scale: 0, y: '-50%' }}
                        animate={{ scale: 1, y: '-50%' }}
                        transition={{ type: "spring", stiffness: 400 }}
                    />
                )}
            </motion.button>
        </motion.div>
    );
};

export default SideCountryItem;