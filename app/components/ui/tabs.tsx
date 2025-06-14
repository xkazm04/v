'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { cn } from '@/app/lib/utils';

const Tabs = TabsPrimitive.Root;

interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  variant?: 'default' | 'pills' | 'underline';
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = 'default', ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center text-muted-foreground relative',
      {
        'h-12 rounded-xl bg-muted/50 p-1 backdrop-blur-sm border border-border/50': variant === 'default',
        'h-auto bg-transparent p-0 gap-2': variant === 'pills',
        'h-auto bg-transparent p-0 border-b border-border': variant === 'underline',
      },
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  icon?: React.ReactNode;
  variant?: 'default' | 'pills' | 'underline';
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, icon, variant = 'default', children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative group',
      {
        // Default variant
        'rounded-lg py-2.5 text-sm data-[state=active]:bg-yellow-100/50 data-[state=active]:text-foreground data-[state=active]:shadow-sm': variant === 'default',
        // Pills variant
        'rounded-xl py-3 text-sm bg-muted/30 hover:bg-muted/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg': variant === 'pills',
        // Underline variant
        'px-4 py-3 text-sm hover:text-foreground data-[state=active]:text-foreground border-b-2 border-transparent data-[state=active]:border-primary': variant === 'underline',
      },
      className
    )}
    {...props}
  >
    <motion.div 
      className="flex items-center gap-2"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon && (
        <motion.div
          className="flex-shrink-0"
          initial={{ rotate: 0 }}
          whileHover={{ rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
      )}
      {children}
    </motion.div>
    
    {/* Active indicator for pills variant */}
    {variant === 'pills' && (
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-primary/30 opacity-0 group-data-[state=active]:opacity-100"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    )}
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };