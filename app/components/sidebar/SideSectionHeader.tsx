import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

type Props = {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
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
}: Props) => (
    <motion.div
        className={cn(
            "flex items-center px-3 py-2 cursor-pointer group",
            isCollapsed && "justify-center"
        )}
        onClick={() => !isCollapsed && toggleSection(sectionId)}
        whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
        transition={{ duration: 0.15 }}
    >
        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        {mounted && !isCollapsed && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between flex-1 ml-2"
            >
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                    {title}
                </span>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-muted-foreground"
                >
                    ▼
                </motion.div>
            </motion.div>
        )}
    </motion.div>
);

export default SideSectionHeader;