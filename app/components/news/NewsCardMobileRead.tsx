import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { cn } from '@/app/lib/utils';

interface MobileReadButtonProps {
  onMarkRead: () => void;
  className?: string;
}

const NewsCardMobileRead = memo(function MobileReadButton({
  onMarkRead,
  className = ''
}: MobileReadButtonProps) {
  const { colors, isDark } = useLayoutTheme();
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsPressed(true);
    
    // Add slight delay for visual feedback
    setTimeout(() => {
      onMarkRead();
    }, 150);
  };

  return (
    <motion.button
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={cn(
        "absolute right-2 top-1/2 transform -translate-y-1/2 z-30",
        "w-10 h-10 rounded-full flex items-center justify-center",
        "transition-all duration-200 touch-manipulation",
        "shadow-lg border-2",
        className
      )}
      style={{
        background: isDark 
          ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(34, 197, 94, 0.95) 0%, rgba(22, 163, 74, 0.95) 100%)',
        borderColor: isDark ? 'rgba(34, 197, 94, 0.6)' : 'rgba(22, 163, 74, 0.6)',
        boxShadow: `0 4px 12px rgba(34, 197, 94, 0.3), 0 0 0 1px ${colors.border}`
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: `0 6px 16px rgba(34, 197, 94, 0.4), 0 0 0 2px ${colors.border}`
      }}
      whileTap={{
        scale: 0.95
      }}
      animate={{
        scale: isPressed ? 0.9 : 1,
        background: isPressed 
          ? isDark 
            ? 'linear-gradient(135deg, rgba(22, 163, 74, 0.9) 0%, rgba(15, 118, 110, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(22, 163, 74, 0.95) 0%, rgba(15, 118, 110, 0.95) 100%)'
          : isDark 
            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.9) 100%)'
            : 'linear-gradient(135deg, rgba(34, 197, 94, 0.95) 0%, rgba(22, 163, 74, 0.95) 100%)'
      }}
      transition={{ duration: 0.1 }}
    >
      <motion.div
        animate={{
          rotate: isPressed ? 360 : 0,
          scale: isPressed ? 1.2 : 1
        }}
        transition={{ 
          duration: isPressed ? 0.3 : 0.1,
          ease: isPressed ? "easeOut" : "easeInOut"
        }}
      >
        <Check 
          className="w-5 h-5 text-white drop-shadow-sm" 
          strokeWidth={3}
        />
      </motion.div>

      {isPressed && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'rgba(255, 255, 255, 0.3)'
          }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </motion.button>
  );
});

export default NewsCardMobileRead;