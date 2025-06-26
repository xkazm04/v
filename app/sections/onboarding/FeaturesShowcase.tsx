'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { SHOWCASE_FEATURES } from '@/app/constants/showcase';
import Image from 'next/image';
import { Check, Sparkles } from 'lucide-react';

interface FeaturesShowcaseProps {
  className?: string;
}

const FeaturesShowcase: React.FC<FeaturesShowcaseProps> = ({ className = '' }) => {
  const [activeFeature, setActiveFeature] = useState(0);
  const { colors, isDark } = useLayoutTheme();

  const currentFeature = SHOWCASE_FEATURES[activeFeature];

  const getGradientStyle = (gradientString: string) => {
    const colorMap: Record<string, string> = {
      'blue-500': '#3b82f6',
      'indigo-600': '#4f46e5',
      'red-500': '#ef4444',
      'pink-600': '#db2777',
      'green-500': '#22c55e',
      'emerald-600': '#059669',
      'purple-500': '#a855f7',
      'violet-600': '#7c3aed',
      'yellow-500': '#eab308',
      'orange-600': '#ea580c'
    };

    const match = gradientString.match(/from-(\w+-\d+)\s+to-(\w+-\d+)/);
    if (match) {
      const [, fromColor, toColor] = match;
      const startColor = colorMap[fromColor] || '#3b82f6';
      const endColor = colorMap[toColor] || '#4f46e5';
      return `linear-gradient(135deg, ${startColor}, ${endColor})`;
    }
    
    return 'linear-gradient(135deg, #3b82f6, #4f46e5)';
  };

  const getButtonStyles = (isActive: boolean) => {
    if (isActive) {
      return {
        background: getGradientStyle(currentFeature.gradient),
        color: 'white',
        border: 'none',
        boxShadow: isDark 
          ? '0 4px 20px rgba(59, 130, 246, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)'
          : '0 4px 20px rgba(59, 130, 246, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(-1px)'
      };
    } else {
      return {
        background: isDark 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(0, 0, 0, 0.05)',
        color: colors.foreground,
        border: `1px solid ${colors.border}`,
        boxShadow: isDark
          ? '0 2px 8px rgba(0, 0, 0, 0.2)'
          : '0 2px 8px rgba(0, 0, 0, 0.08)',
        transform: 'translateY(0px)'
      };
    }
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex flex-wrap justify-center gap-2 px-3 py-3 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
        {SHOWCASE_FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          const isActive = index === activeFeature;
          
          return (
            <motion.button
              key={feature.id}
              onClick={() => setActiveFeature(index)}
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300"
              style={getButtonStyles(isActive)}
              whileHover={{ 
                scale: isActive ? 1.02 : 1.05,
                y: isActive ? -1 : -2
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Icon className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline font-semibold">{feature.title}</span>
              <span className="sm:hidden font-semibold">{feature.title.split(' ')[0]}</span>
              
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  layoutId="activeTab"
                  style={{
                    background: getGradientStyle(feature.gradient),
                    zIndex: -1
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
      <div className="flex-1 flex relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full h-full flex"
          >
            {/* ✅ UPDATED: Left Side - Image/GIF (3/4 width) - Maximized space */}
            <div className="w-3/4 min-h-[450px] relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <div className="relative h-full overflow-hidden">
                <Image
                  src={currentFeature.imagePlaceholder} 
                  alt={`${currentFeature.title} Preview`}
                  fill
                  className="object-cover transition-all duration-700 hover:scale-105"
                  style={{
                    filter: isDark 
                      ? 'brightness(0.8) contrast(1.1) sepia(0.1)' 
                      : 'brightness(0.95) contrast(1.02)'
                  }}
                />
                
                <div 
                  className="absolute inset-0 opacity-5"
                  style={{
                    background: `linear-gradient(45deg, ${getGradientStyle(currentFeature.gradient).replace('linear-gradient(135deg, ', '').replace(')', '')})`
                  }}
                />
              </div>
            </div>

            <div className="w-1/4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-l border-gray-200/50 dark:border-gray-700/50 flex flex-col">
              <div className="p-3 border-b border-gray-200/50 dark:border-gray-700/50">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {currentFeature.description}
                </p>
              </div>
              

              <div className="flex-1 p-3 space-y-2">
                {currentFeature.benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-2 group"
                  >
                    <div 
                      className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
                      style={{
                        background: getGradientStyle(currentFeature.gradient)
                      }}
                    >
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      {benefit}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-4 left-4 flex gap-2 z-10">
          {SHOWCASE_FEATURES.map((feature, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveFeature(index)}
              className="rounded-full transition-all duration-300 backdrop-blur-sm"
              style={{
                width: index === activeFeature ? '28px' : '8px',
                height: '8px',
                background: index === activeFeature 
                  ? 'rgba(255, 255, 255, 0.9)'
                  : 'rgba(255, 255, 255, 0.4)',
                border: index === activeFeature 
                  ? `2px solid ${getGradientStyle(feature.gradient).split(',')[0].replace('linear-gradient(135deg, ', '')}`
                  : '1px solid rgba(255, 255, 255, 0.3)'
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesShowcase;