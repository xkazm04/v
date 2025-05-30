'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ThemeToggle } from '@/app/components/theme/theme-toggle';
import { cn } from '@/app/lib/utils';
import { Menu, Search, Upload, Bell, User, X } from 'lucide-react';

export function Navbar() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Handle navigation loading
  const handleNavigation = () => {
    setIsLoading(true);
    // Reset loading state after a short delay
    setTimeout(() => setIsLoading(false), 100);
  };

  const isHome = pathname === '/';

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Desktop Navigation */}
        <div className="flex-1 hidden md:flex items-center justify-between">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link 
              href="/" 
              onClick={handleNavigation}
              className={cn(
                "relative transition-colors hover:text-primary", 
                isHome ? "text-primary" : "text-foreground"
              )}
            >
              Home
              {isHome && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
            <Link 
              href="/edu" 
              onClick={handleNavigation}
              className="relative transition-colors hover:text-primary"
            >
              Timeline v1
              {pathname === '/edu' && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
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
      
      {/* Loading indicator */}
      {isLoading && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          className="absolute bottom-0 left-0 h-0.5 w-full bg-primary origin-left"
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.nav>
  );
}