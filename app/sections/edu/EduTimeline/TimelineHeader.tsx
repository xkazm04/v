'use client';
import { motion } from 'framer-motion';

interface TimelineHeaderProps {
  diagram: any;
  colors: any;
  isDark: boolean;
}

export default function TimelineHeader({ diagram, colors, isDark }: TimelineHeaderProps) {
  return (
    <div className="relative z-20 px-4 sm:px-8 py-16">
      <motion.div 
        className="text-center mb-16 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-4xl sm:text-6xl font-bold mb-8 tracking-tight"
          style={{ color: colors.primary }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          {diagram.title}
        </motion.h1>
        
        <motion.div
          className="w-24 h-1 mx-auto mb-8 rounded-full"
          style={{ backgroundColor: colors.primary }}
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
        
        <motion.p 
          className="text-xl sm:text-2xl leading-relaxed max-w-4xl mx-auto font-light"
          style={{ color: colors.colors?.muted || colors.foreground }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {diagram.question}
        </motion.p>
      </motion.div>

      {/* Enhanced Perspective Dimensions Legend */}
      <motion.div 
        className="flex flex-col lg:flex-row justify-center items-center gap-6 mb-20 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <motion.div 
          className="group flex items-center gap-4 px-8 py-4 rounded-2xl border-2 backdrop-blur-sm"
          style={{
            backgroundColor: colors.cardColors?.background || colors.background,
            borderColor: colors.border,
            boxShadow: isDark ? '0 8px 25px rgba(0, 0, 0, 0.3)' : '0 8px 25px rgba(0, 0, 0, 0.1)'
          }}
          whileHover={{ 
            scale: 1.05,
            y: -2,
            boxShadow: isDark ? '0 12px 35px rgba(0, 0, 0, 0.4)' : '0 12px 35px rgba(0, 0, 0, 0.15)'
          }}
        >
          <motion.div 
            className="w-6 h-6 rounded-full shadow-lg"
            style={{
              background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)'
            }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <div className="text-center">
            <h3 className="text-lg font-bold mb-1">{diagram.dimensionTopTitle}</h3>
            <p className="text-sm opacity-70">Multi-perspective analysis</p>
          </div>
        </motion.div>
        
        <div className="hidden lg:block w-16 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-30" />
        
        <motion.div 
          className="group flex items-center gap-4 px-8 py-4 rounded-2xl border-2 backdrop-blur-sm"
          style={{
            backgroundColor: colors.cardColors?.background || colors.background,
            borderColor: colors.border,
            boxShadow: isDark ? '0 8px 25px rgba(0, 0, 0, 0.3)' : '0 8px 25px rgba(0, 0, 0, 0.1)'
          }}
          whileHover={{ 
            scale: 1.05,
            y: -2,
            boxShadow: isDark ? '0 12px 35px rgba(0, 0, 0, 0.4)' : '0 12px 35px rgba(0, 0, 0, 0.15)'
          }}
        >
          <div className="text-center">
            <h3 className="text-lg font-bold mb-1">{diagram.dimensionBottomTitle}</h3>
            <p className="text-sm opacity-70">Contextual insights</p>
          </div>
          <motion.div 
            className="w-6 h-6 rounded-full shadow-lg"
            style={{
              background: 'linear-gradient(45deg, #f59e0b, #ef4444)'
            }}
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}