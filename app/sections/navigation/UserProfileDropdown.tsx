'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/app/lib/utils';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import Link from 'next/link';
import { User, Settings, Shield, LogOut, Menu, ChevronDown } from 'lucide-react';

interface UserProfileDropdownProps {
  user: any;
  onLogout: () => void;
  variant?: 'desktop' | 'mobile';
  className?: string;
}

const dropdownVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.1 }
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 25,
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

export function UserProfileDropdown({ 
  user, 
  onLogout, 
  variant = 'desktop',
  className 
}: UserProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { colors, isDark, getColors } = useLayoutTheme();

  if (!user) {
    return (
      <Button
        variant="outline"
        size={variant === 'mobile' ? 'sm' : 'default'}
        asChild
        className={cn("transition-all duration-200", className)}
      >
        <Link href="/auth">Sign In</Link>
      </Button>
    );
  }

  const dropdownColors = getColors('card');
  const userInitials = user.email?.substring(0, 2).toUpperCase() || 'U';

  const menuItems = [
    {
      icon: User,
      label: 'Profile',
      href: '/profile',
      description: 'Manage your profile'
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/settings',
      description: 'App preferences'
    },
    {
      icon: Shield,
      label: 'Privacy',
      href: '/privacy',
      description: 'Privacy settings'
    }
  ];

  const renderDropdown = () => (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          {variant === 'mobile' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
          )}

          {/* Dropdown menu */}
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={cn(
              "absolute z-50 min-w-[220px] rounded-xl border shadow-lg",
              variant === 'mobile' 
                ? "bottom-full mb-2 right-0" 
                : "top-full mt-2 right-0"
            )}
            style={{
              backgroundColor: dropdownColors.background,
              borderColor: dropdownColors.border,
              boxShadow: isDark 
                ? '0 10px 40px rgba(0, 0, 0, 0.4)' 
                : '0 10px 40px rgba(0, 0, 0, 0.15)'
            }}
          >
            {/* User info header */}
            <motion.div 
              variants={itemVariants}
              className="p-4 border-b"
              style={{ borderColor: dropdownColors.border }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: dropdownColors.foreground }}>
                    {user.name || user.email}
                  </p>
                  <p className="text-xs truncate" style={{ color: dropdownColors.muted }}>
                    {user.email}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Menu items */}
            <div className="py-2">
              {menuItems.map((item) => (
                <motion.div key={item.href} variants={itemVariants}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center px-4 py-3 text-sm transition-colors hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                    style={{ color: dropdownColors.foreground }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${colors.primary}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    <div className="flex-1">
                      <div>{item.label}</div>
                      <div className="text-xs" style={{ color: dropdownColors.muted }}>
                        {item.description}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}

              {/* Logout button */}
              <motion.div variants={itemVariants} className="border-t pt-2 mt-2" style={{ borderColor: dropdownColors.border }}>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sign out
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="ghost"
        size={variant === 'mobile' ? 'sm' : 'icon'}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "transition-all duration-200",
          variant === 'mobile' && "px-2"
        )}
        style={{ color: colors.foreground }}
      >
        {variant === 'mobile' ? (
          <Menu className="h-4 w-4" />
        ) : (
          <>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="ml-1"
            >
              <ChevronDown className="h-3 w-3" />
            </motion.div>
          </>
        )}
      </Button>

      {renderDropdown()}
    </div>
  );
}