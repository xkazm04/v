'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { DesktopNavbar } from '@/app/sections/navigation/DesktopNavbar';
import { MobileNavbar } from '@/app/sections/navigation/mobile/MobileNavbar';

interface LayoutShellProps {
  children: ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  
  // Simple video mode detection
  const isVideoPlayerMode = pathname.startsWith('/watch') || 
                           pathname.startsWith('/videos/') ||
                           pathname.includes('/player/');

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Desktop Navigation - Always visible */}
      <div className="hidden md:block relative z-50">
        <DesktopNavbar />
      </div>

      {/* Main Content with Transitions */}
      <main className="flex-1 relative z-10">
          {children}
      </main>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden relative z-40 ${
          isVideoPlayerMode ? 'fixed bottom-0 left-0 right-0' : ''
        }`}
      >
        <MobileNavbar />
      </div>
    </div>
  );
}