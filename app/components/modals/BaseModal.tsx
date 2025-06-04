'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';
import { useCallback, useEffect } from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  className?: string;
  showCloseButton?: boolean;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

export function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'lg',
  className,
  showCloseButton = true
}: BaseModalProps) {
  const { cardColors, overlayColors, colors, mounted } = useLayoutTheme();

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!mounted) {
    return null;
  }

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-scroll">
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleBackdropClick}
            className="absolute inset-0 backdrop-blur-sm"
            style={{ backgroundColor: overlayColors.backdrop }}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "relative w-full max-h-[90vh] overflow-hidden rounded-xl shadow-2xl",
              maxWidthClasses[maxWidth],
              className
            )}
            style={{
              backgroundColor: cardColors.background,
              border: `1px solid ${cardColors.border}`,
              boxShadow: `0 25px 50px -12px ${cardColors.shadow}`
            }}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div 
                className="flex items-center justify-between p-6 border-b"
                style={{ borderColor: cardColors.border }}
              >
                {title && (
                  <h2 
                    className="text-xl font-bold"
                    style={{ color: cardColors.foreground }}
                  >
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <motion.button
                    onClick={onClose}
                    className="p-2 rounded-lg transition-all duration-200"
                    style={{
                      color: colors.mutedForeground,
                      backgroundColor: 'transparent'
                    }}
                    whileHover={{ 
                      scale: 1.1,
                      backgroundColor: colors.muted,
                      color: colors.foreground
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}