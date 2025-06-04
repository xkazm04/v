'use client';

import { cn } from '@/app/lib/utils';
import { motion } from 'framer-motion';

interface EnhancedBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'glow';
  className?: string;
  animate?: boolean;
}

export function EnhancedBadge({ 
  children, 
  variant = 'default', 
  className,
  animate = false 
}: EnhancedBadgeProps) {
  const baseClasses = "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium transition-all duration-200";
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    glow: "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
  };

  const Component = animate ? motion.span : 'span';
  const motionProps = animate ? {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    whileHover: { scale: 1.05 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      className={cn(baseClasses, variantClasses[variant], className)}
      {...motionProps}
    >
      {children}
    </Component>
  );
}