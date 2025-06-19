import { AnimatePresence, motion } from "framer-motion"
import NavItem from "./SideNavItem";
import { 
  Home, 
  Bookmark,
  NewspaperIcon, 
} from 'lucide-react';

type Props = {
    isActive: (path: string) => boolean;
    isCollapsed: boolean;
    mounted: boolean;
}

const SideNavMainSection = ( {isActive, mounted}: Props) => {
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
                            href: "/profiles",
                            icon: Bookmark,
                            label: "Profiles",
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
                            />
                        </motion.div>
                    ))}
                </motion.div>
        </AnimatePresence>
    );
};

export default SideNavMainSection;