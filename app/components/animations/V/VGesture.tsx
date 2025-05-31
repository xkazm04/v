'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Zap } from 'lucide-react';
import VGradient from './VGradient';
import VControlPanel from './VControlPanel';
import VContent from './VContent';
import VShape from './VShape';

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

  // Generate unique instance ID for this component
  const instanceId = useRef(`v-${Math.random().toString(36).substr(2, 9)}`).current;

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-8 shadow-2xl border border-gray-700/50">
      <div className="relative w-full h-96 mb-8 overflow-hidden rounded-lg">


        {/* SVG Container */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          className="absolute inset-0"
        >
          <VGradient result={result} instanceId={instanceId} />


          {/* Dynamic V trails with motion */}
          <VShape
            result={result}
            dotXSpring={dotXSpring}
            dotYSpring={dotYSpring}
            centerX={centerX}
            floorY={floorY}
            energyPulse={energyPulse}
            trailOpacity={trailOpacity}
            instanceId={instanceId} // Pass instanceId to VShape too
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
        <VContent 
          result={result}
          showVContent={showVContent}
          />
      </div>

      {/* Enhanced Control Buttons */}
      <VControlPanel
        isAnimating={isAnimating}
        setIsAnimating={setIsAnimating}
        setResult={setResult}
        setShowVContent={setShowVContent}
        dotX={dotX}
        dotY={dotY}
        fillProgress={fillProgress}
        trailOpacity={trailOpacity}
        centerX={centerX}
        floorY={floorY}
        leftX={leftX}
        rightX={rightX}
        dotYPos={dotYPos}
        spawnParticles={spawnParticles}
        setShowImpact={setShowImpact}
        setEnergyPulse={setEnergyPulse}
        />
    </div>
  );
};

export default VGesture;