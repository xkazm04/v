import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";
import { EnhancedBadge } from "../ui/enhanced-badge";

type Props = {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    isActiveRoute: boolean;
    badge?: number;
    description?: string;
    itemId?: string;
    isCollapsed: boolean;
    mounted: boolean;
}

const NavItem = ({ 
        href, 
        icon: Icon, 
        label, 
        isActiveRoute, 
        badge,
        description,
        itemId,
        isCollapsed, 
        mounted
    }: Props) => (
        <motion.div
            whileHover={{ x: isCollapsed ? 0 : 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            <Link href={href}>
                <button
                    className={cn(
                        'w-full justify-start flex flex-row p-2 relative overflow-hidden group transition-all duration-200',
                        isCollapsed && 'justify-center px-3',
                        isActiveRoute && 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 text-blue-700 dark:text-blue-300 border-l-2 border-blue-500',
                        !isActiveRoute && 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50'
                    )}
                >
                    {/* Background gradient effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.2 }}
                    />
                    
                    <Icon className={cn(
                        "h-5 w-5 relative z-10 transition-colors duration-200",
                        isActiveRoute && "text-blue-600 dark:text-blue-400"
                    )} />
                    
                    {mounted && (
                        <AnimatePresence initial={false}>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.2, ease: "easeInOut" }}
                                    className="flex items-center justify-between flex-1 ml-3 overflow-hidden"
                                >
                                    <div className="flex flex-col">
                                        <span className="whitespace-nowrap text-sm font-medium">
                                            {label}
                                        </span>
                                    </div>
                                    {badge && badge > 0 && (
                                        <EnhancedBadge 
                                            variant="secondary" 
                                            className="ml-2 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                        >
                                            {badge > 999 ? '999+' : badge}
                                        </EnhancedBadge>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                    
                    {!mounted && !isCollapsed && (
                        <div className="flex items-center justify-between flex-1 ml-3">
                            <span className="text-sm font-medium">{label}</span>
                            {badge && badge > 0 && (
                                <EnhancedBadge variant="secondary" className="ml-2 text-xs">
                                    {badge > 999 ? '999+' : badge}
                                </EnhancedBadge>
                            )}
                        </div>
                    )}
                </button>
            </Link>
        </motion.div>
    );

export default NavItem;