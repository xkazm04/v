// app/sections/settings/Appearance/SetAppearancePreview.tsx
'use client';

import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';
import { 
  Palette,
  Sparkles,
  Eye,
  Zap,
  Star
} from 'lucide-react';

interface SetAppearancePreviewProps {
  className?: string;
}

export function SetAppearancePreview({ className }: SetAppearancePreviewProps) {
  const { colors } = useLayoutTheme();

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  return (
    <motion.div 
      variants={itemVariants}
      className={className}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3" style={{ color: colors.foreground }}>
          <motion.div
            className="p-2 rounded-xl"
            style={{ 
              background: `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}10)`,
              border: `1px solid ${colors.primary}30`
            }}
            whileHover={{ scale: 1.1, rotate: -10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Eye className="w-7 h-7" style={{ color: colors.primary }} />
          </motion.div>
          Live Preview
        </h2>
        <p className="text-lg text-muted-foreground">
          See how your theme choices look in real-time
        </p>
      </div>

      {/* Preview Container */}
      <GlassContainer
        style="crystal"
        border="glow"
        rounded="2xl"
        shadow="glow"
        className="relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full opacity-20"
              style={{ 
                background: colors.primary,
                left: `${5 + i * 6}%`,
                top: `${15 + (i % 4) * 25}%`
              }}
              animate={{
                y: [0, -12, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.4, 1]
              }}
              transition={{
                duration: 4 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Palette className="w-8 h-8" style={{ color: colors.primary }} />
              </motion.div>
              <h3 className="text-2xl font-bold" style={{ color: colors.primary }}>
                Theme Preview
              </h3>
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6" style={{ color: colors.primary }} />
              </motion.div>
            </div>
            
            {/* Content Preview */}
            <div className="space-y-4">
              <div className="space-y-2">
                <motion.div 
                  className="h-4 rounded-lg animate-pulse"
                  style={{ background: `${colors.primary}30` }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div 
                  className="h-3 rounded-lg animate-pulse w-3/4"
                  style={{ background: `${colors.foreground}20` }}
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                <motion.div 
                  className="h-3 rounded-lg animate-pulse w-1/2"
                  style={{ background: `${colors.foreground}15` }}
                  animate={{ opacity: [0.2, 0.6, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </div>
            
            {/* Feature Indicators */}
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" style={{ color: colors.primary }} />
                <span className="text-muted-foreground">Auto-Applied</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" style={{ color: colors.primary }} />
                <span className="text-muted-foreground">Device Synced</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" style={{ color: colors.primary }} />
                <span className="text-muted-foreground">Live Updates</span>
              </div>
            </div>
          </div>
        </div>
      </GlassContainer>

      {/* Info Text */}
      <motion.p 
        className="text-center text-sm text-muted-foreground mt-6 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        ✨ Changes are saved automatically and synced across all your devices. 
        Your theme preferences will be remembered for future visits.
      </motion.p>
    </motion.div>
  );
}