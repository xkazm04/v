import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/app/lib/utils';
import { EnhancedBadge } from '../ui/enhanced-badge';

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

const SideCountryItem = ({ country, isActiveRoute, isCollapsed, mounted }: Props) => (
    <motion.div
        whileHover={{ x: isCollapsed ? 0 : 6 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
        <Link href={country.href}>
            <button
                className={cn(
                    'w-full justify-start relative overflow-hidden group h-8 flex flex-row p-2',
                    isCollapsed && 'justify-center px-2',
                    isActiveRoute && 'bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 text-green-700 dark:text-green-300',
                    country.isDefault && 'font-medium'
                )}
            >
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.2 }}
                />

                <span className="text-base mr-2 relative z-10">{country.flag}</span>

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
                                <span className="whitespace-nowrap text-sm font-medium">
                                    {country.name}
                                </span>
                                {country.count && (
                                    <EnhancedBadge  
                                        variant="outline"
                                        className="ml-2 text-xs h-4 px-1 bg-white/50 dark:bg-gray-800/50"
                                    >
                                        {country.count}
                                    </EnhancedBadge>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </button>
        </Link>
    </motion.div>
);

export default SideCountryItem;