'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {  Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';
import SideCat from './SideCat';

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
        'h-[calc(100vh-3.5rem)] border-r border-border/40 bg-background/20 transition-all duration-300 hidden md:block relative',
        isCollapsed ? 'w-[80px]' : 'w-[240px]',
        className
      )}
    >

      <SideCat 
        isCollapsed={isCollapsed}
        isActive={isActive}
        />
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