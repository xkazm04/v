import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/app/lib/utils";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";

type Props = {
    href: string;
    icon: React.ComponentType<{ className?: string, style?: React.CSSProperties }>;
    label: string;
    isActiveRoute: boolean;
}

const NavItem = ({ 
    href, 
    icon: Icon, 
    label, 
    isActiveRoute, 
}: Props) => {
    const { colors, sidebarColors, isDark } = useLayoutTheme();

    return (
        <motion.div
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            <Link href={href}>
                <motion.button
                    className={cn(
                        'w-full justify-start flex flex-row p-3 relative overflow-hidden group transition-all duration-200 rounded-lg justify-center px-3'
                    )}
                    style={{
                        background: isActiveRoute 
                            ? isDark 
                                ? `linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.1) 100%)`
                                : `linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%)`
                            : 'transparent',
                        color: isActiveRoute 
                            ? colors.primary 
                            : sidebarColors.foreground,
                        borderLeft: isActiveRoute 
                            ? `3px solid ${colors.primary}` 
                            : '3px solid transparent'
                    }}
                    whileHover={{
                        backgroundColor: isDark 
                            ? 'rgba(71, 85, 105, 0.1)' 
                            : 'rgba(248, 250, 252, 0.8)'
                    }}
                >
                    {/* Hover background effect */}
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background: isDark
                                ? `linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.03) 100%)`
                                : `linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(147, 51, 234, 0.02) 100%)`
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                    />
                    
                    <div className="relative z-10 flex items-center w-full">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Icon 
                                className="h-5 w-5 transition-colors duration-200 flex-shrink-0" 
                                style={{
                                    color: isActiveRoute ? colors.primary : sidebarColors.muted
                                }}
                            />
                        </motion.div>
                        
                            <AnimatePresence initial={false}>
                                    <motion.div
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                        className="flex items-center justify-between flex-1 ml-3 overflow-hidden"
                                    >
                                        <div className="flex flex-col items-start">
                                            <span 
                                                className="whitespace-nowrap text-sm font-medium transition-colors duration-200"
                                                style={{
                                                    color: isActiveRoute ? colors.primary : sidebarColors.foreground
                                                }}
                                            >
                                                {label}
                                            </span>
                                        </div>
                                    </motion.div>
                            </AnimatePresence>
                    </div>

                    {/* Active indicator */}
                    {isActiveRoute && (
                        <motion.div
                            className="absolute right-2 top-1/2 w-1 h-6 rounded-full"
                            style={{ backgroundColor: colors.primary }}
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

export default NavItem;