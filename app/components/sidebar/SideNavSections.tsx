import { AnimatePresence, motion } from "framer-motion"
import NavItem from "./SideNavItem";
import { 
  Home, 
  TrendingUp as Trending, 
  Bookmark, 
} from 'lucide-react';

type Props = {
    expandedSections: Set<string>;
    isActive: (path: string) => boolean;
    isCollapsed: boolean;
    mounted: boolean;
}

const SideNavMainSection = ({expandedSections, isActive, isCollapsed, mounted}: Props) => {
    return (
        <AnimatePresence initial={false}>
            {expandedSections.has('main') && (
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
                            icon: Home,
                            label: "Home",
                            itemId: "home"
                        },
                        {
                            href: "/trending",
                            icon: Trending,
                            label: "Trending",
                            itemId: "trending",
                            badge: 12
                        },
                        {
                            href: "/profiles",
                            icon: Bookmark,
                            label: "Liked profiles",
                            itemId: "profiles"
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
                                badge={item.badge}
                                isCollapsed={isCollapsed}
                                mounted={mounted}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SideNavMainSection;