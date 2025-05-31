'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Check, X, Zap, Sparkles } from 'lucide-react';
import VGradient from './VGradient';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export type ResultType = 'true' | 'false' | null;

export const getFillColor = (result: ResultType) => {
  if (result === 'true') return '#10B981';
  if (result === 'false') return '#EF4444';
  return '#06B6D4';
};

export const getGlowColor = (result: ResultType) => {
  if (result === 'true') return '#10B981';
  if (result === 'false') return '#EF4444';
  return '#06B6D4';
};

const VGesture = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [result, setResult] = useState<ResultType>(null);
  const [showVContent, setShowVContent] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showImpact, setShowImpact] = useState(false);
  const [energyPulse, setEnergyPulse] = useState(0);
  
  const dotX = useMotionValue(20);
  const dotY = useMotionValue(15);
  const fillProgress = useMotionValue(0);
  const trailOpacity = useMotionValue(0.3);
  
  const springConfig = { damping: 20, stiffness: 300, mass: 0.8 };
  const dotXSpring = useSpring(dotX, springConfig);
  const dotYSpring = useSpring(dotY, springConfig);
  const fillSpring = useSpring(fillProgress, springConfig);
  
  const particleIntervalRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<number>();

  const centerX = 50;
  const floorY = 85;
  const leftX = 20;
  const rightX = 80;
  const dotYPos = 15;

  // Particle system
  const createParticle = (x: number, y: number, intensity = 1): Particle => ({
    id: Math.random().toString(36),
    x,
    y,
    vx: (Math.random() - 0.5) * 10 * intensity,
    vy: (Math.random() - 0.5) * 10 * intensity,
    life: 1,
    maxLife: 0.5 + Math.random() * 0.5,
    size: 1 + Math.random() * 3
  });

  const updateParticles = () => {
    setParticles(prev => 
      prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx * 0.016,
        y: particle.y + particle.vy * 0.016,
        life: particle.life - 0.016 / particle.maxLife,
        vx: particle.vx * 0.98,
        vy: particle.vy * 0.98
      })).filter(particle => particle.life > 0)
    );
  };

  useEffect(() => {
    if (isAnimating) {
      animationRef.current = requestAnimationFrame(function animate() {
        updateParticles();
        animationRef.current = requestAnimationFrame(animate);
      });
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating]);

  const spawnParticles = (x: number, y: number, count = 15, intensity = 1) => {
    const newParticles = Array.from({ length: count }, () => 
      createParticle(x, y, intensity)
    );
    setParticles(prev => [...prev, ...newParticles]);
  };

  const triggerGesture = (truthValue: 'true' | 'false') => {
    if (isAnimating) return;

    setIsAnimating(true);
    setResult(truthValue);
    setShowVContent(false);
    setShowImpact(false);
    setEnergyPulse(0);

    // Enhanced trail visibility
    trailOpacity.set(0.8);

    // Phase 1: Dramatic sweep with particle trail
    const sweepDuration = 800;
    dotX.set(rightX);
    dotY.set(dotYPos);
    fillProgress.set(1);

    // Continuous particle emission during sweep
    particleIntervalRef.current = setInterval(() => {
      if (dotX.get() > leftX + 10) {
        spawnParticles(dotX.get(), dotY.get(), 3, 0.6);
      }
    }, 50);

    // Phase 2: Impact at center with explosion
    setTimeout(() => {
      if (particleIntervalRef.current) {
        clearInterval(particleIntervalRef.current);
      }
      
      setShowImpact(true);
      setEnergyPulse(1);
      
      // Major particle explosion at center
      spawnParticles(centerX, (dotYPos + floorY) / 2, 25, 2);
      
      // Energy ripples
      setTimeout(() => setEnergyPulse(2), 100);
      setTimeout(() => setEnergyPulse(3), 200);
      
    }, sweepDuration * 0.7);

    // Phase 3: V-shape reveal with cosmic effect
    setTimeout(() => {
      setShowVContent(true);
      trailOpacity.set(1);
      
      // Create cosmic particle burst
      spawnParticles(centerX, centerX, 30, 1.5);
      
      // Secondary ripple effects
      setTimeout(() => spawnParticles(leftX, dotYPos, 10, 1), 100);
      setTimeout(() => spawnParticles(rightX, dotYPos, 10, 1), 200);
      
    }, sweepDuration);

    // Phase 4: Energy sustain
    setTimeout(() => {
      setEnergyPulse(4);
    }, sweepDuration + 300);

    // Phase 5: Fade out with reverse sweep
    setTimeout(() => {
      setShowVContent(false);
      setShowImpact(false);
      trailOpacity.set(0.4);
      
      // Reverse sweep
      dotX.set(leftX);
      fillProgress.set(0);
      
    }, sweepDuration + 800);

    // Phase 6: Complete reset with final particle burst
    setTimeout(() => {
      spawnParticles(leftX, dotYPos, 15, 1);
      setResult(null);
      trailOpacity.set(0.3);
      setEnergyPulse(0);
      setIsAnimating(false);
    }, sweepDuration + 1300);
  };

  // Animation variants
  const impactVariants = {
    hidden: { scale: 0, rotate: 0, opacity: 0 },
    visible: { 
      scale: [0, 1.2, 1], 
      rotate: [0, 180, 360],
      opacity: [0, 1, 0.8],
      transition: { 
        duration: 0.6, 
        times: [0, 0.6, 1],
        ease: "easeOut"
      }
    }
  };

  const vContentVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0, 
      rotateY: -90,
      z: -100
    },
    visible: { 
      scale: [0, 1.3, 1], 
      opacity: [0, 1, 1],
      rotateY: [90, 0, 0],
      z: [100, 0, 0],
      transition: { 
        duration: 0.8,
        times: [0, 0.6, 1],
        ease: "backOut"
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      rotateY: 90,
      transition: { duration: 0.4 }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 2, 3, 4],
      opacity: [0.8, 0.4, 0.2, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-8 shadow-2xl border border-gray-700/50">
      <div className="relative w-full h-96 mb-8 overflow-hidden rounded-lg">
        {/* Background cosmic effect */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, #3b82f6 0%, transparent 50%)',
              'radial-gradient(circle at 80% 80%, #ef4444 0%, transparent 50%)',
              'radial-gradient(circle at 50% 50%, #10b981 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        {/* SVG Container */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          className="absolute inset-0"
        >
          <VGradient result={result} />

          {/* Energy field background */}
          {energyPulse > 0 && (
            <motion.polygon
              points={`${leftX},${dotYPos} ${centerX},${floorY} ${rightX},${dotYPos}`}
              fill="url(#vFillPattern)"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.8, 0.3],
                filter: [
                  `drop-shadow(0 0 0px ${getFillColor(result)})`,
                  `drop-shadow(0 0 30px ${getFillColor(result)})`,
                  `drop-shadow(0 0 15px ${getFillColor(result)})`
                ]
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          )}

          {/* Dynamic V trails with motion */}
          <motion.line
            x1={dotXSpring}
            y1={dotYSpring}
            x2={centerX}
            y2={floorY}
            stroke="url(#centerGlow)"
            strokeWidth="2"
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 8px ${getGlowColor(result)})`,
              opacity: trailOpacity
            }}
          />

          {/* Secondary trail with delay */}
          <motion.line
            x1={dotXSpring}
            y1={dotYSpring}
            x2={centerX}
            y2={floorY}
            stroke={getGlowColor(result)}
            strokeWidth="2"
            strokeOpacity="0.6"
            strokeLinecap="round"
            style={{
              filter: `blur(2px) drop-shadow(0 0 12px ${getGlowColor(result)})`,
            }}
          />

          {/* Floor point with pulsing energy */}
          <motion.circle
            cx={centerX}
            cy={floorY}
            r="1"
            fill={getGlowColor(result)}
            className={`opacity-30`}
            animate={energyPulse > 0 ? {
              r: [3, 6, 3],
              opacity: [0.2, 0.6, 1]
            } : {}}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{
              filter: `drop-shadow(0 0 12px ${getGlowColor(result)})`,
            }}
          />

          {/* Main animated dot */}
          <motion.circle
            cx={dotXSpring}
            cy={dotYSpring}
            r="4"
            fill="url(#dotGlow)"
            style={{
              filter: `drop-shadow(0 0 15px ${getGlowColor(result)})`,
            }}
          />

          {/* Particles */}
          {particles.map(particle => (
            <motion.circle
              key={particle.id}
              cx={particle.x}
              cy={particle.y}
              r={particle.size}
              fill={getGlowColor(result)}
              opacity={particle.life}
              style={{
                filter: `blur(0.5px)`,
              }}
            />
          ))}
        </svg>

        {/* Impact Effect */}
        <AnimatePresence>
          {showImpact && (
            <motion.div
              className="absolute left-1/2 top-1/2"
              style={{ transform: 'translate(-50%, -50%)' }}
              variants={impactVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.div
                className="w-16 h-16 rounded-full border-4 border-current"
                style={{ 
                  color: getGlowColor(result),
                  boxShadow: `0 0 40px ${getGlowColor(result)}, inset 0 0 40px ${getGlowColor(result)}40`
                }}
                variants={pulseVariants}
                animate="pulse"
              />
              <Zap 
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                size={24} 
                color={getGlowColor(result)} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* V-Shape Content with 3D effect */}
        <AnimatePresence>
          {showVContent && (
            <motion.div
              className="absolute left-1/2 top-1/2"
              style={{ 
                transform: 'translate(-50%, -50%)',
                perspective: '1000px'
              }}
              variants={vContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="relative rounded-full p-6 backdrop-blur-sm"
                style={{
                  backgroundColor: `${getGlowColor(result)}20`,
                  border: `3px solid ${getGlowColor(result)}60`,
                  boxShadow: `
                    0 0 40px ${getGlowColor(result)}60, 
                    inset 0 0 30px ${getGlowColor(result)}20,
                    0 0 80px ${getGlowColor(result)}40
                  `,
                }}
                animate={{
                  boxShadow: [
                    `0 0 40px ${getGlowColor(result)}60, inset 0 0 30px ${getGlowColor(result)}20`,
                    `0 0 60px ${getGlowColor(result)}80, inset 0 0 40px ${getGlowColor(result)}30`,
                    `0 0 40px ${getGlowColor(result)}60, inset 0 0 30px ${getGlowColor(result)}20`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  {result === 'true' ? (
                    <Check size={32} color={getGlowColor(result)} strokeWidth={3} />
                  ) : (
                    <X size={32} color={getGlowColor(result)} strokeWidth={3} />
                  )}
                </motion.div>

                {/* Floating sparkles */}
                <Sparkles 
                  className="absolute -top-2 -right-2 animate-pulse" 
                  size={16} 
                  color={getGlowColor(result)} 
                />
                <Sparkles 
                  className="absolute -bottom-2 -left-2 animate-pulse" 
                  size={12} 
                  color={getGlowColor(result)} 
                  style={{ animationDelay: '0.5s' }}
                />
              </motion.div>

              {/* Expanding energy rings */}
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2"
                  style={{ 
                    borderColor: `${getGlowColor(result)}30`,
                    scale: 1 + i * 0.3
                  }}
                  animate={{
                    scale: [1 + i * 0.3, 2 + i * 0.5],
                    opacity: [0.6, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Control Buttons */}
      <div className="flex gap-6 justify-center">
        <motion.button
          onClick={() => triggerGesture('true')}
          disabled={isAnimating}
          className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          style={{
            boxShadow: isAnimating ? 'none' : '0 8px 25px rgba(16, 185, 129, 0.3)'
          }}
        >
          <Check size={20} />
          <span>Truth</span>
          <motion.div
            className="absolute inset-0 rounded-xl bg-white/20"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        </motion.button>

        <motion.button
          onClick={() => triggerGesture('false')}
          disabled={isAnimating}
          className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          style={{
            boxShadow: isAnimating ? 'none' : '0 8px 25px rgba(239, 68, 68, 0.3)'
          }}
        >
          <X size={20} />
          <span>False</span>
          <motion.div
            className="absolute inset-0 rounded-xl bg-white/20"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        </motion.button>
      </div>
    </div>
  );
};

export default VGesture;