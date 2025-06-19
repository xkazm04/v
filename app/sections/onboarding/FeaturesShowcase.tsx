import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { SHOWCASE_FEATURES } from '@/app/constants/showcase';

interface FeaturesShowcaseProps {
  className?: string;
}

const FeaturesShowcase: React.FC<FeaturesShowcaseProps> = ({ className = '' }) => {
  const [activeFeature, setActiveFeature] = useState(0);
  const { colors, isDark } = useLayoutTheme();

  const nextFeature = () => {
    setActiveFeature((prev) => (prev + 1) % SHOWCASE_FEATURES.length);
  };

  const prevFeature = () => {
    setActiveFeature((prev) => (prev - 1 + SHOWCASE_FEATURES.length) % SHOWCASE_FEATURES.length);
  };

  const currentFeature = SHOWCASE_FEATURES[activeFeature];

  // Helper function to convert Tailwind gradient to CSS gradient
  const getGradientStyle = (gradientString: string) => {
    // Map Tailwind color names to actual hex values
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

    // Parse "from-blue-500 to-indigo-600" format
    const match = gradientString.match(/from-(\w+-\d+)\s+to-(\w+-\d+)/);
    if (match) {
      const [, fromColor, toColor] = match;
      const startColor = colorMap[fromColor] || '#3b82f6';
      const endColor = colorMap[toColor] || '#4f46e5';
      return `linear-gradient(135deg, ${startColor}, ${endColor})`;
    }
    
    // Fallback
    return 'linear-gradient(135deg, #3b82f6, #4f46e5)';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Feature Tabs */}
      <div className="flex flex-wrap justify-center gap-2 px-4">
        {SHOWCASE_FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          const isActive = index === activeFeature;
          
          return (
            <motion.button
              key={feature.id}
              onClick={() => setActiveFeature(index)}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'text-white shadow-lg' 
                  : 'hover:scale-105'
              }`}
              style={{
                color: isActive ? 'white' : colors.foreground,
                borderColor: isActive ? 'transparent' : colors.border
              }}
              whileHover={{ scale: isActive ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">{feature.title}</span>
              <span className="sm:hidden">{feature.title.split(' ')[0]}</span>
              
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-lg"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Feature Display */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Feature Card */}
            <div 
              className="relative rounded-2xl border overflow-hidden"
              style={{ 
                borderColor: colors.border,
                background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'
              }}
            >

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Image placeholder */}
                <div 
                  className="relative h-[400px] rounded-xl overflow-hidden border"
                  style={{ 
                    borderColor: colors.border,
                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <currentFeature.icon className="w-8 h-8 mx-auto opacity-30" style={{ color: colors.foreground }} />
                      <p className="text-xs opacity-50" style={{ color: colors.foreground }}>
                        Feature Preview
                      </p>
                    </div>
                  </div>
                  
                  {/* Gradient overlay */}
                  <div 
                    className="absolute inset-0 opacity-10"
                    style={{ 
                      background: getGradientStyle(currentFeature.gradient)
                    }}
                  />
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <p className="text-sm md:text-base leading-relaxed" style={{ color: colors.foreground }}>
                    {currentFeature.description}
                  </p>
                  
                  {/* Benefits */}
                  <div className="flex flex-wrap gap-2">
                    {currentFeature.benefits.map((benefit, index) => (
                      <motion.div
                        key={benefit}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                          color: colors.foreground
                        }}
                      >
                        ✓ {benefit}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {SHOWCASE_FEATURES.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveFeature(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === activeFeature ? 'w-6' : 'opacity-30'
              }`}
              style={{ 
                backgroundColor: index === activeFeature ? colors.primary : colors.foreground 
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesShowcase;