'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

const DashEmptyState: React.FC<EmptyStateProps> = ({
  title = "No Breakdown Data Available",
  description = "Insufficient data to generate category breakdown"
}) => {
  const { colors, isDark, vintage } = useLayoutTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <GlassContainer
        style={isDark ? 'crystal' : 'subtle'}
        border={isDark ? 'glow' : 'visible'}
        rounded="xl"
        shadow={isDark ? 'glow' : 'lg'}
        className="p-8 text-center"
      >
        {/* Vintage paper texture for light mode */}
        {!isDark && (
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none rounded-xl"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
                radial-gradient(circle at 80% 70%, rgba(139, 69, 19, 0.015) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px, 25px 25px'
            }}
          />
        )}

        <div className="relative z-10">
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{
              background: isDark 
                ? `linear-gradient(135deg, ${colors.primary}20, ${colors.primary}10)`
                : `linear-gradient(135deg, ${vintage.sepia}20, ${vintage.aged}10)`,
              border: isDark 
                ? `2px solid ${colors.primary}30`
                : `2px solid ${vintage.aged}`
            }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Tag className="w-8 h-8" style={{ 
              color: isDark ? colors.primary : vintage.ink 
            }} />
          </motion.div>

          <h3 
            className="text-xl font-bold mb-2"
            style={{ 
              color: isDark ? colors.foreground : vintage.ink,
              fontFamily: '"Playfair Display", serif'
            }}
          >
            {title}
          </h3>
          <p 
            className="text-sm"
            style={{ 
              color: isDark ? colors.mutedForeground : vintage.faded,
              fontFamily: '"Crimson Text", serif'
            }}
          >
            {description}
          </p>
        </div>
      </GlassContainer>
    </motion.div>
  );
};

export default DashEmptyState;