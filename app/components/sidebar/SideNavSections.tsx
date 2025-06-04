import { AnimatePresence, motion } from "framer-motion"
import NavItem from "./SideNavItem";
import { 
  Home, 
  TrendingUp as Trending, 
  Bookmark, 
  Eye,
} from 'lucide-react';

type Props = {
    expandedSections: Set<string>;
    isActive: (path: string) => boolean;
    isCollapsed: boolean;
    mounted: boolean;
}

const SideNavMainSection = ({expandedSections, isActive, isCollapsed, mounted}: Props) => {
    return <AnimatePresence initial={false}>
        {expandedSections.has('main') && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-1 overflow-hidden"
            >
                <NavItem
                    href="/"
                    icon={Home}
                    label="Home"
                    isActiveRoute={isActive('/')}
                    description="Latest fact-checks"
                    itemId="home"
                    isCollapsed={isCollapsed}
                    mounted={mounted}
                />
                <NavItem
                    href="/trending"
                    icon={Trending}
                    label="Trending"
                    isActiveRoute={isActive('/trending')}
                    badge={12}
                    description="Hot topics"
                    itemId="trending"
                    isCollapsed={isCollapsed}
                    mounted={mounted}
                />
                <NavItem
                    href="/subscriptions"
                    icon={Bookmark}
                    label="Subscriptions"
                    isActiveRoute={isActive('/subscriptions')}
                    description="Your sources"
                    itemId="subscriptions"
                    isCollapsed={isCollapsed}
                    mounted={mounted}
                />
                <NavItem
                    href="/watchlist"
                    icon={Eye}
                    label="Watch Later"
                    isActiveRoute={isActive('/watchlist')}
                    badge={5}
                    description="Saved for later"
                    itemId="watchlist"
                    isCollapsed={isCollapsed}
                    mounted={mounted}
                />
            </motion.div>
        )}
    </AnimatePresence>
}

export default SideNavMainSection;