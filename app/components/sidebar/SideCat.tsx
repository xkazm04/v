'use client';

import { Home, TrendingUp as Trending, Bookmark, History, ThumbsUp, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { cn } from '@/app/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

type Props = {
    isCollapsed: boolean;
    isActive: (path: string) => boolean;
}

const SideCat = ({isCollapsed, isActive}: Props) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const NavItem = ({ href, icon: Icon, label, isActiveRoute }: {
        href: string;
        icon: any;
        label: string;
        isActiveRoute: boolean;
    }) => (
        <Link href={href}>
            <Button
                variant={isActiveRoute ? 'secondary' : 'ghost'}
                className={cn(
                    'w-full justify-start',
                    isCollapsed && 'justify-center'
                )}
            >
                <Icon className="h-5 w-5" />
                {mounted && (
                    <AnimatePresence initial={false}>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-2 overflow-hidden whitespace-nowrap"
                            >
                                {label}
                            </motion.span>
                        )}
                    </AnimatePresence>
                )}
                {!mounted && !isCollapsed && (
                    <span className="ml-2">{label}</span>
                )}
            </Button>
        </Link>
    );

    return (
        <ScrollArea className="h-full py-4">
            <div className="px-3 pb-4">
                <nav className="flex flex-col gap-1">
                    <NavItem href="/" icon={Home} label="Home" isActiveRoute={isActive('/')} />
                    <NavItem href="/trending" icon={Trending} label="Trending" isActiveRoute={isActive('/trending')} />
                    <NavItem href="/subscriptions" icon={Bookmark} label="Subscriptions" isActiveRoute={isActive('/subscriptions')} />

                    <div className="mt-4 mb-2 px-4">
                        <div className={cn("h-px bg-border", isCollapsed && "mx-auto w-5")} />
                    </div>
                </nav>
            </div>
        </ScrollArea>
    );
};

export default SideCat;