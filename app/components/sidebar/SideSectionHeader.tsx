import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";

type Props = {
    title: string;
    icon: React.ComponentType<{ className?: string, style?: React.CSSProperties }>;
    sectionId: string;
    isExpanded: boolean;
    isCollapsed: boolean;
    mounted: boolean;
    toggleSection: (sectionId: string) => void;
}

const SideSectionHeader = ({
    title,
    icon: Icon,
    sectionId,
    isExpanded,
    isCollapsed,
    mounted,
    toggleSection
}: Props) => {
    const { colors, sidebarColors, isDark } = useLayoutTheme();

    return (
        <motion.div
            className={cn(
                "flex items-center px-3 py-2 cursor-pointer group rounded-lg transition-all duration-200",
                isCollapsed && "justify-center"
            )}
            onClick={() => !isCollapsed && toggleSection(sectionId)}
            whileHover={{ 
                backgroundColor: isDark ? 'rgba(71, 85, 105, 0.1)' : 'rgba(248, 250, 252, 0.8)' 
            }}
            transition={{ duration: 0.15 }}
            style={{
                background: 'transparent'
            }}
        >
            <div className="relative">
                <Icon 
                    className="h-4 w-4 transition-all duration-200 group-hover:scale-110" 
                    style={{ 
                        color: isExpanded 
                            ? colors.primary 
                            : sidebarColors.muted 
                    }}
                />
                {/* Icon glow effect */}
                {isExpanded && (
                    <motion.div
                        className="absolute inset-0 rounded-full blur-sm"
                        style={{ backgroundColor: colors.primary }}
                        animate={{ 
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                )}
            </div>
            
            {mounted && !isCollapsed && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between flex-1 ml-3"
                >
                    <span 
                        className="text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
                        style={{ 
                            color: isExpanded 
                                ? colors.foreground 
                                : sidebarColors.muted 
                        }}
                    >
                        {title}
                    </span>
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="transition-colors duration-200"
                        style={{ 
                            color: isExpanded 
                                ? colors.primary 
                                : sidebarColors.muted 
                        }}
                    >
                        <svg 
                            className="w-3 h-3" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                        >
                            <path 
                                fillRule="evenodd" 
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                                clipRule="evenodd" 
                            />
                        </svg>
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default SideSectionHeader;