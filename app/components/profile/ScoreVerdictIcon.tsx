import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
    scoreColors: {
        primary: string;
        secondary: string;
        background: string;
    };
    displayScore: number; 
    index: number; 
}

const ScoreVerdictIcon = ({scoreColors, displayScore, index}: Props) => {
    const circumference = 2 * Math.PI * 20; // r=20 for the ring

    return (
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Glow Effect */}
        <motion.div 
          className="absolute inset-0 rounded-full blur-lg"
          style={{ backgroundColor: scoreColors.primary }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Main Icon Container */}
        <div 
          className="relative w-12 h-12 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center shadow-xl z-10"
          style={{ backgroundColor: scoreColors.background }}
        >
          {/* Logo/Icon */}
          <Image
            src="/logos/logo_spray_white.png"
            alt="Verdict"
            width={24}
            height={24}
            className="drop-shadow-lg"
            style={{ filter: `hue-rotate(${displayScore >= 70 ? '120deg' : displayScore >= 40 ? '60deg' : '0deg'})` }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          
          {/* Score Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
            {/* Background Ring */}
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
            />
            {/* Progress Ring */}
            <motion.circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke={scoreColors.primary}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ 
                strokeDashoffset: circumference * (1 - displayScore / 100)
              }}
              transition={{ 
                delay: index * 0.1 + 0.5, 
                duration: 1.2, 
                ease: "easeOut" 
              }}
            />
          </svg>
        </div>

        {/* Score Percentage */}
        <motion.div
          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-bold backdrop-blur-sm"
          style={{ 
            background: scoreColors.background,
            color: scoreColors.primary,
            border: `1px solid ${scoreColors.secondary}`
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 + 0.8, duration: 0.4 }}
        >
          {displayScore}%
        </motion.div>
      </div>
    );
  };

  export default ScoreVerdictIcon;