'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp as Trending, Bookmark, History, ThumbsUp, Clock, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { CategoryList } from '@/app/components/sidebar/category-list';
import { cn } from '@/app/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div 
      className={cn(
        'h-[calc(100vh-3.5rem)] border-r border-border/40 bg-background transition-all duration-300 hidden md:block relative',
        isCollapsed ? 'w-[80px]' : 'w-[240px]',
        className
      )}
    >
      <ScrollArea className="h-full py-4">
        <div className="px-3 pb-4">
          <nav className="flex flex-col gap-1">
            <Link href="/">
              <Button 
                variant={isActive('/') ? 'secondary' : 'ghost'} 
                className={cn(
                  'w-full justify-start', 
                  isCollapsed && 'justify-center'
                )}
              >
                <Home className="h-5 w-5 mr-2" />
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Home
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>
            <Link href="/trending">
              <Button 
                variant={isActive('/trending') ? 'secondary' : 'ghost'} 
                className={cn(
                  'w-full justify-start', 
                  isCollapsed && 'justify-center'
                )}
              >
                <Trending className="h-5 w-5 mr-2" />
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Trending
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>
            <Link href="/subscriptions">
              <Button 
                variant={isActive('/subscriptions') ? 'secondary' : 'ghost'} 
                className={cn(
                  'w-full justify-start', 
                  isCollapsed && 'justify-center'
                )}
              >
                <Bookmark className="h-5 w-5 mr-2" />
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Subscriptions
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>

            <div className="mt-4 mb-2 px-4">
              <div className={cn("h-px bg-border", isCollapsed && "mx-auto w-5")} />
            </div>

            <Link href="/library">
              <Button 
                variant={isActive('/library') ? 'secondary' : 'ghost'} 
                className={cn(
                  'w-full justify-start', 
                  isCollapsed && 'justify-center'
                )}
              >
                <History className="h-5 w-5 mr-2" />
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Library
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>
            <Link href="/liked">
              <Button 
                variant={isActive('/liked') ? 'secondary' : 'ghost'} 
                className={cn(
                  'w-full justify-start', 
                  isCollapsed && 'justify-center'
                )}
              >
                <ThumbsUp className="h-5 w-5 mr-2" />
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Liked Videos
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>
            <Link href="/watch-later">
              <Button 
                variant={isActive('/watch-later') ? 'secondary' : 'ghost'} 
                className={cn(
                  'w-full justify-start', 
                  isCollapsed && 'justify-center'
                )}
              >
                <Clock className="h-5 w-5 mr-2" />
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Watch Later
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </Link>

            {!isCollapsed && (
              <>
                <div className="mt-4 mb-2 px-4">
                  <div className="h-px bg-border" />
                </div>
                
                <div className="px-4 mb-2">
                  <h3 className="text-sm font-medium">Categories</h3>
                </div>
                
                <CategoryList />
              </>
            )}
          </nav>
        </div>
      </ScrollArea>

      <div className="absolute bottom-4 right-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="rounded-full"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="absolute bottom-4 left-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          asChild
        >
          <Link href="/settings">
            <Settings className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}