 import { motion } from 'framer-motion';
 const DashProgressBar = ({ value, color, isDark }: { value: number; color: string; isDark: boolean }) => (
    <div className="relative h-6 rounded-md overflow-hidden"
      style={{ 
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      }}
    >
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 3px,
            ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 3px,
            ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 6px
          )`
        }}
      />
      
      {/* Progress fill */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full"
        style={{ 
          background: `linear-gradient(90deg, ${color}, ${color}dd)`
        }}
      />
      
      {/* Overlay value */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-white drop-shadow">
          {value}%
        </span>
      </div>
    </div>
  );

export default DashProgressBar;