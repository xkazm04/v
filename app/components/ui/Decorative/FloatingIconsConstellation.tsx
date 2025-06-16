import { memo } from 'react';
import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { FloatingVerdictIcon } from './FloatingVerdictIcon';
import DynamicBackground from './DynamicBackground';
import { 
  Globe, 
  Settings,
  Palette,
  User,
  Star,
  Zap,
  Shield,
  Brain
} from 'lucide-react';

interface FloatingIconsConstellationProps {
  variant?: 'settings' | 'preferences' | 'appearance' | 'profile';
  className?: string;
}

const FloatingIconsConstellation = memo(function FloatingIconsConstellation({ 
  variant = 'settings',
  className = ''
}: FloatingIconsConstellationProps) {
  const { colors, isDark } = useLayoutTheme();

  const heroConfig = {
    color: colors.primary,
    bgGradient: isDark 
      ? `radial-gradient(ellipse at center, ${colors.primary}15 0%, transparent 70%)`
      : `radial-gradient(ellipse at center, ${colors.primary}08 0%, transparent 70%)`,
    stampOpacity: '0.08'
  };

  // Variant-specific configurations
  const variantConfigs = {
    settings: {
      mainIcon: Settings,
      satellites: [
        { icon: Globe, color: '#3b82f6', position: { top: '15%', left: '20%' }, delay: 0.5 },
        { icon: Palette, color: '#10b981', position: { top: '20%', right: '15%' }, delay: 0.7 },
        { icon: User, color: '#f59e0b', position: { bottom: '25%', right: '20%' }, delay: 0.9 },
        { icon: Shield, color: '#8b5cf6', position: { bottom: '20%', left: '15%' }, delay: 1.1 },
        { icon: Brain, color: '#ef4444', position: { top: '40%', left: '10%' }, delay: 1.3 },
        { icon: Zap, color: '#06b6d4', position: { top: '35%', right: '10%' }, delay: 1.5 }
      ]
    },
    preferences: {
      mainIcon: Globe,
      satellites: [
        { icon: Brain, color: '#3b82f6', position: { top: '18%', left: '25%' }, delay: 0.5 },
        { icon: Zap, color: '#10b981', position: { top: '22%', right: '20%' }, delay: 0.7 },
        { icon: Shield, color: '#f59e0b', position: { bottom: '30%', right: '25%' }, delay: 0.9 },
        { icon: Star, color: '#8b5cf6', position: { bottom: '25%', left: '20%' }, delay: 1.1 }
      ]
    },
    appearance: {
      mainIcon: Palette,
      satellites: [
        { icon: Star, color: '#3b82f6', position: { top: '20%', left: '22%' }, delay: 0.5 },
        { icon: Zap, color: '#10b981', position: { top: '25%', right: '18%' }, delay: 0.7 },
        { icon: Shield, color: '#f59e0b', position: { bottom: '28%', right: '22%' }, delay: 0.9 }
      ]
    },
    profile: {
      mainIcon: User,
      satellites: [
        { icon: Shield, color: '#3b82f6', position: { top: '22%', left: '20%' }, delay: 0.5 },
        { icon: Star, color: '#10b981', position: { top: '18%', right: '25%' }, delay: 0.7 },
        { icon: Zap, color: '#f59e0b', position: { bottom: '25%', left: '18%' }, delay: 0.9 }
      ]
    }
  };

  const config = variantConfigs[variant];

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Dynamic Background */}
      <div className={`
          ${isDark ? 'opacity-50' : 'opacity-100'}
        `}>
        <DynamicBackground 
          config={heroConfig}
          currentTheme={isDark ? 'dark' : 'light'}
        />
      </div>

      {/* Main Central Constellation */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Central Main Icon */}
        <motion.div
          className="relative z-0"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        >
          <FloatingVerdictIcon
            size="xl"
            customIcon="/logos/logo_spray_white.png"
            showConfidenceRing={false}
            delay={0}
            colors={{
              glowColor: colors.primary,
              ringColor: colors.primary,
              backgroundColor: `${colors.primary}15`
            }}
          />
        </motion.div>

        {/* Satellite Icons */}
        {config.satellites.map((satellite, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={satellite.position}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: satellite.delay, 
              type: "spring", 
              stiffness: 300 
            }}
          >
            <FloatingVerdictIcon
              size="sm"
              confidence={75 + index * 5}
              customIcon="/logos/logo_spray_white.png"
              delay={satellite.delay}
              colors={{ 
                glowColor: satellite.color,
                ringColor: satellite.color,
                backgroundColor: `${satellite.color}10`
              }}
            />
          </motion.div>
        ))}

        {/* Orbital Rings */}
        <motion.div
          className="absolute inset-0 border border-white/5 rounded-full"
          style={{ 
            width: '200px', 
            height: '200px', 
            margin: 'auto',
            left: '45%',
            top: '40%',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Corner Accent Icons */}
      <motion.div
        className="absolute top-10 left-10"
        initial={{ opacity: 0, x: -20, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.8, type: "spring" }}
      >
        <FloatingVerdictIcon
          size="xs"
          confidence={60}
          customIcon="/logos/logo_spray_white.png"
          delay={1.8}
          colors={{ glowColor: '#64748b' }}
        />
      </motion.div>

      <motion.div
        className="absolute top-10 right-10"
        initial={{ opacity: 0, x: 20, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 2.0, type: "spring" }}
      >
        <FloatingVerdictIcon
          size="xs"
          confidence={70}
          customIcon="/logos/logo_spray_white.png"
          delay={2.0}
          colors={{ glowColor: '#64748b' }}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-10"
        initial={{ opacity: 0, x: -20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 2.2, type: "spring" }}
      >
        <FloatingVerdictIcon
          size="xs"
          confidence={55}
          customIcon="/logos/logo_spray_white.png"
          delay={2.2}
          colors={{ glowColor: '#64748b' }}
        />
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-10"
        initial={{ opacity: 0, x: 20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 2.4, type: "spring" }}
      >
        <FloatingVerdictIcon
          size="xs"
          confidence={65}
          customIcon="/logos/logo_spray_white.png"
          delay={2.4}
          colors={{ glowColor: '#64748b' }}
        />
      </motion.div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-20"
            style={{ 
              background: colors.primary,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
});

export default FloatingIconsConstellation;