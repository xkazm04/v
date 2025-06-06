import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/app/lib/utils';
import { EnhancedBadge } from '../ui/enhanced-badge';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

type Props = {
    country: {
        name: string;
        flag: string;
        href: string;
        count?: number;
        isDefault?: boolean;
    };
    isActiveRoute: boolean;
    isCollapsed: boolean;
    mounted: boolean;
}

const SideCountryItem = ({ country, isActiveRoute, isCollapsed, mounted }: Props) => {
    const { colors, sidebarColors, isDark } = useLayoutTheme();

    return (
        <motion.div
            whileHover={{ x: isCollapsed ? 0 : 6 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            <Link href={country.href}>
                <motion.button
                    className={cn(
                        'w-full justify-start relative overflow-hidden group h-10 flex flex-row p-2 rounded-lg transition-all duration-200',
                        isCollapsed && 'justify-center px-2',
                        country.isDefault && 'font-medium'
                    )}
                    style={{
                        background: isActiveRoute 
                            ? isDark 
                                ? `linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)`
                                : `linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)`
                            : 'transparent',
                        color: isActiveRoute 
                            ? isDark ? '#4ade80' : '#16a34a'
                            : sidebarColors.foreground,
                        borderLeft: isActiveRoute 
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
                                                color: isActiveRoute 
                                                    ? isDark ? '#4ade80' : '#16a34a'
                                                    : sidebarColors.foreground
                                            }}
                                        >
                                            {country.name}
                                        </span>
                                        {country.count && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.1, type: "spring" }}
                                            >
                                                <EnhancedBadge  
                                                    variant="outline"
                                                    className="ml-2 text-xs h-5 px-2 font-medium"
                                                >
                                                    {country.count}
                                                </EnhancedBadge>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </div>

                    {/* Active indicator */}
                    {isActiveRoute && (
                        <motion.div
                            className="absolute right-2 top-1/2 w-1 h-4 rounded-full"
                            style={{ backgroundColor: isDark ? '#4ade80' : '#16a34a' }}
                            initial={{ scale: 0, y: '-50%' }}
                            animate={{ scale: 1, y: '-50%' }}
                            transition={{ type: "spring", stiffness: 400 }}
                        />
                    )}
                </motion.button>
            </Link>
        </motion.div>
    );
};

export default SideCountryItem;