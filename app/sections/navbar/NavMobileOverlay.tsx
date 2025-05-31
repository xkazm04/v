import { navAnim } from "@/app/components/animations/variants/navVariants";
import { NAVIGATION_CONFIG } from "@/app/config/navItems";
import { motion } from "framer-motion";

type Props = {
    toggleMobileMenu: () => void;
    actionButtons: {
        key: string;
        icon: React.ElementType;
        label: string;
        onClick: () => void;
        showOnDesktop: boolean;
        showOnMobile: boolean;
        badge?: React.ReactNode | null;
    }[];
    renderNavLink: (item: { href: string; label: string; description: string }, isMobile?: boolean) => React.ReactNode;
    renderActionButton: (config: {
        key: string;
        icon: React.ElementType;
        label: string;
        onClick: () => void;
        showOnDesktop: boolean;
        showOnMobile: boolean;
        badge?: React.ReactNode | null;
    }, isMobile?: boolean) => React.ReactNode;  
}

const NavMobileOverlay = ({toggleMobileMenu, actionButtons, renderNavLink, renderActionButton}: Props) => {
    return (

                <>
                    {/* Backdrop */}
                    <motion.div
                        variants={navAnim.mobileMenu.overlay}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed inset-0 top-16 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                        onClick={toggleMobileMenu}
                    />

                    {/* Menu Panel */}
                    <motion.div
                        variants={navAnim.mobileMenu.panel}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-80 bg-card border-r border-border shadow-xl md:hidden"
                    >
                        <div className="p-6 h-full flex flex-col">
                            {/* Branding in Mobile */}
                            <div className="mb-6 pb-4 border-b border-border">
                                <h2 className="font-bold text-xl text-foreground">
                                    FactCheck Pro
                                </h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Truth in every statement
                                </p>
                            </div>

                            {/* Navigation Links */}
                            <nav className="space-y-1 flex-1">
                                {NAVIGATION_CONFIG.mainNav.map(item => renderNavLink(item, true))}
                            </nav>

                            {/* Mobile Actions */}
                            <div className="pt-4 border-t border-border space-y-2">
                                {actionButtons
                                    .filter(config => config.showOnMobile)
                                    .map(config => renderActionButton(config, true))}
                            </div>
                        </div>
                    </motion.div>
                </>
    )
}

export default NavMobileOverlay;