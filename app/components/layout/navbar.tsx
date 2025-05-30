'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, Upload, Bell, User, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ThemeToggle } from '@/app/components/theme/theme-toggle';
import { cn } from '@/app/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHome = pathname === '/';

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">VideoHub</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex-1 hidden md:flex items-center justify-between">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link 
              href="/" 
              className={cn(
                "transition-colors hover:text-primary", 
                isHome ? "text-primary" : "text-foreground"
              )}
            >
              Home
            </Link>
            <Link 
              href="/trending" 
              className="transition-colors hover:text-primary"
            >
              Trending
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {isSearchOpen ? (
              <motion.div 
                initial={{ width: 0, opacity: 0 }} 
                animate={{ width: "300px", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Input 
                  type="search" 
                  placeholder="Search videos..." 
                  className="w-full pr-8"
                  autoFocus
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0" 
                  onClick={toggleSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <Button variant="ghost" size="icon" onClick={toggleSearch}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <Upload className="h-5 w-5" />
              <span className="sr-only">Upload</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">User</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex-1 flex justify-end items-center space-x-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleSearch}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
            <span className="sr-only">User</span>
          </Button>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 top-14 z-20 border-b border-border bg-background px-4 py-2"
          >
            <div className="relative">
              <Input 
                type="search" 
                placeholder="Search videos..." 
                className="w-full pr-8"
                autoFocus
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0" 
                onClick={toggleSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-full bg-background md:hidden"
          >
            <nav className="grid gap-2 p-4">
              <Link 
                href="/" 
                className="flex items-center px-4 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
              <Link 
                href="/edu" 
                className="flex items-center px-4 py-2 text-lg font-medium hover:bg-accent hover:text-accent-foreground rounded-md"
                onClick={toggleMobileMenu}
              >
                Edu
              </Link>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}