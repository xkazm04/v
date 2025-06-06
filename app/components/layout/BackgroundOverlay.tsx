'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';

interface BackgroundOverlayProps {
  isVisible: boolean;
  onClick?: () => void;
  blur?: boolean;
  opacity?: number;
  className?: string;
  children?: React.ReactNode;
}

export function BackgroundOverlay({
  isVisible,
  onClick,
  blur = true,
  opacity = 0.5,
  className,
  children
}: BackgroundOverlayProps) {
  const { getColors, mounted } = useLayoutTheme();

  if (!mounted) {
    return null;
  }

  const overlayColors = getColors('overlay');

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center",
            blur && "backdrop-blur-sm",
            className
          )}
          style={{
            backgroundColor: `rgba(0, 0, 0, ${opacity})`
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={onClick}
        >
          {/* Overlay gradient effect */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at center, transparent 0%, ${overlayColors.backdrop} 100%)`
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          {/* Content */}
          {children && (
            <motion.div
              className="relative z-10"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}