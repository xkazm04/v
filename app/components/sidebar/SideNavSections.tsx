import { AnimatePresence, motion } from "framer-motion"
import NavItem from "./SideNavItem";
import SideNavAnalyze from "./SideNavAnalyze"; 
import { NewspaperIcon, ChartBarIcon, GraduationCapIcon } from 'lucide-react';

type Props = {
    isActive: (path: string) => boolean;
    isCollapsed: boolean;
    mounted: boolean;
}

const SideNavMainSection = ({ isActive, mounted }: Props) => {
    return (
        <AnimatePresence initial={false}>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-1 overflow-hidden"
            >
                {[
                    {
                        href: "/",
                        icon: NewspaperIcon,
                        label: "Home",
                        itemId: "home"
                    },
                    {
                        href: "/dashboard",
                        icon: ChartBarIcon,
                        label: "Profiles",
                        itemId: "profiles"
                    },
                    {
                        href: "/timeline",
                        icon: GraduationCapIcon,
                        label: "Hot topics",
                        itemId: "education"
                    }
                ].map((item, index) => (
                    <motion.div
                        key={item.itemId}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ 
                            duration: 0.3, 
                            delay: index * 0.05,
                            ease: "easeOut"
                        }}
                    >
                        <NavItem
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            isActiveRoute={isActive(item.href)}
                        />
                    </motion.div>
                ))}
                
                {process.env.NEXT_PUBLIC_API_BASE_URL && <SideNavAnalyze
                    isActive={isActive}
                    mounted={mounted}
                />}
            </motion.div>
        </AnimatePresence>
    );
};

export default SideNavMainSection;