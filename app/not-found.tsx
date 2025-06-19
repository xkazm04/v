'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';
import { VintageVerdictStamp } from '@/app/components/news/VintageVerdictStamp';
import Link from 'next/link';
import Image from 'next/image';
import { Home, ArrowLeft, Newspaper, Search, Clock } from 'lucide-react';

// Vintage newspaper background for light mode
const VintageNewsBackground = memo(() => (
  <div 
    className="fixed inset-0 opacity-15 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: `url('/background/news_bg_1.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}
  />
));

VintageNewsBackground.displayName = 'VintageNewsBackground';

// Vintage paper texture overlay
const VintagePaperOverlay = memo(() => (
  <div className="fixed inset-0 pointer-events-none">
    {/* Paper texture */}
    <div 
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(139, 69, 19, 0.03) 2px, transparent 2px),
          radial-gradient(circle at 75% 75%, rgba(139, 69, 19, 0.02) 1px, transparent 1px),
          linear-gradient(45deg, transparent 40%, rgba(139, 69, 19, 0.01) 50%, transparent 60%)
        `,
        backgroundSize: '50px 50px, 25px 25px, 100px 100px'
      }}
    />
    
    {/* Aged paper stains */}
    <div 
      className="absolute top-20 left-10 w-32 h-24 rounded-full opacity-10"
      style={{
        background: 'radial-gradient(ellipse, rgba(139, 69, 19, 0.3), transparent 70%)',
        transform: 'rotate(-15deg)'
      }}
    />
    <div 
      className="absolute bottom-32 right-16 w-20 h-16 rounded-full opacity-8"
      style={{
        background: 'radial-gradient(ellipse, rgba(139, 69, 19, 0.2), transparent 60%)',
        transform: 'rotate(25deg)'
      }}
    />
  </div>
));

VintagePaperOverlay.displayName = 'VintagePaperOverlay';

export default function NotFound() {
  const { isDark, vintage } = useLayoutTheme();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      {isDark ? (
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      ) : (
        <>
          <VintageNewsBackground />
          <VintagePaperOverlay />
          <div className="fixed inset-0 bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-yellow-50/80" />
        </>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          {/* Vintage Newspaper Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8"
          >
            <div className={`
              inline-block p-6 border-4 
              ${isDark 
                ? 'border-slate-600 bg-slate-800/50' 
                : 'border-amber-800 bg-vintage-paper/80'
              }
              transform -rotate-1
            `}>
              <div className="flex items-center justify-center gap-4 mb-4">
                <Clock className={`w-6 h-6 ${isDark ? 'text-slate-400' : 'text-amber-800'}`} />
                <h1 className={`
                  text-2xl font-bold tracking-wide
                  ${isDark ? 'text-slate-200' : vintage.ink}
                  font-serif
                `}>
                  THE DAILY TRUTH
                </h1>
                <Newspaper className={`w-6 h-6 ${isDark ? 'text-slate-400' : 'text-amber-800'}`} />
              </div>
              <div className={`
                text-xs tracking-[0.2em] uppercase
                ${isDark ? 'text-slate-500' : vintage.faded}
                border-t border-b py-1
                ${isDark ? 'border-slate-600' : 'border-amber-300'}
              `}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </motion.div>

          {/* Large 404 with vintage style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, type: "spring", stiffness: 100 }}
            className="mb-8 relative"
          >
            <h2 className={`
              text-8xl md:text-9xl font-bold
              ${isDark 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-900 to-amber-700'
              }
              font-serif tracking-tight
              drop-shadow-2xl
            `}>
              404
            </h2>
            
            {/* Vintage stamp overlay */}
            <motion.div
              initial={{ opacity: 0, rotate: -45, scale: 0 }}
              animate={{ opacity: 1, rotate: -15, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute top-4 right-4"
            >
              <VintageVerdictStamp
                status="UNVERIFIABLE"
                size="lg"
                animated={true}
              />
            </motion.div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-12"
          >
            <h3 className={`
              text-3xl md:text-4xl font-bold mb-4
              ${isDark ? 'text-white' : vintage.ink}
              font-serif leading-tight
            `}>
              BREAKING: Page Goes Missing!
            </h3>
            <p className={`
              text-lg md:text-xl max-w-2xl mx-auto leading-relaxed
              ${isDark ? 'text-slate-300' : vintage.faded}
            `}>
              Our investigative team has thoroughly searched the archives, but this page appears to have vanished into the digital ether. 
              Don't worry—this mystery won't remain unsolved for long.
            </p>
          </motion.div>

          {/* Home Button Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex justify-center"
          >
            <Link href="/" className="group">
              <GlassContainer
                style={isDark ? 'crystal' : 'frosted'}
                border={isDark ? 'glow' : 'visible'}
                rounded="xl"
                shadow="xl"
                className={`
                  p-8 max-w-sm cursor-pointer transition-all duration-300
                  group-hover:scale-105 group-hover:shadow-2xl
                  ${isDark 
                    ? 'bg-gradient-to-br from-slate-800/80 to-slate-700/80 border-purple-500/30' 
                    : 'bg-gradient-to-br from-white/80 to-amber-50/80 border-amber-300/50'
                  }
                `}
              >
                <div className="text-center">
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`
                      inline-flex items-center justify-center w-16 h-16 rounded-full mb-4
                      ${isDark 
                        ? 'bg-purple-600/20 text-purple-400' 
                        : 'bg-amber-200/50 text-amber-700'
                      }
                      transition-all duration-300
                    `}
                  >
                    <Home className="w-8 h-8" />
                  </motion.div>
                  
                  {/* Title */}
                  <h4 className={`
                    text-xl font-bold mb-2
                    ${isDark ? 'text-white' : vintage.ink}
                    group-hover:${isDark ? 'text-purple-300' : 'text-amber-800'}
                    transition-colors duration-300
                  `}>
                    Return to Homepage
                  </h4>
                  
                  {/* Description */}
                  <p className={`
                    text-sm leading-relaxed mb-4
                    ${isDark ? 'text-slate-400' : vintage.faded}
                  `}>
                    Head back to our main newsroom where all the verified stories await your investigation.
                  </p>
                  
                  {/* Button */}
                  <motion.div
                    whileHover={{ x: 5 }}
                    className={`
                      inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                      ${isDark 
                        ? 'bg-purple-600 text-white group-hover:bg-purple-500' 
                        : 'bg-amber-600 text-white group-hover:bg-amber-700'
                      }
                      transition-all duration-300
                    `}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Take Me Home</span>
                  </motion.div>
                </div>
              </GlassContainer>
            </Link>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="mt-16"
          >
            <div className={`
              text-sm
              ${isDark ? 'text-slate-500' : vintage.faded}
              font-serif italic
            `}>
              "The truth may be elusive, but it's never truly lost." - The Daily Truth Editorial Team
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating elements for extra ambiance */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 2, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-20 opacity-30"
      >
        <Search className={`w-8 h-8 ${isDark ? 'text-slate-600' : 'text-amber-400'}`} />
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, -3, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-32 right-24 opacity-20"
      >
        <Newspaper className={`w-12 h-12 ${isDark ? 'text-slate-600' : 'text-amber-400'}`} />
      </motion.div>
    </div>
  );
}