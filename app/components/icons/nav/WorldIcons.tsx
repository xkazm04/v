import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { cn } from "@/app/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";
export const WorldIconSide = ({ isActive, isHovered, isCollapsed }: { 
    isActive: boolean; 
    isHovered: boolean; 
    isCollapsed: boolean;
}) => {
    

    return (
        <div className={cn(
            'relative w-full h-full flex items-center justify-center',
            isCollapsed ? 'p-1' : 'p-2'
        )}>
                <div className="relative w-full h-full">
                    <Image
                        src="/flags/world.svg"
                        alt="World"
                        width={200}
                        height={30}
                        className={cn(
                            "transition-all duration-300",
                            isActive && "drop-shadow-lg",
                            isHovered && "drop-shadow-md"
                        )}
                    />
                </div>
        </div>
    );
};

type Props = {
    isSelected: boolean;
    isHovered: boolean;
}

export const WorldIconSetting = ({isSelected, isHovered}: Props) => {
    const { isDark } = useLayoutTheme();
        return (
      <motion.div 
        className="absolute inset-0 overflow-hidden rounded-xl"
        animate={{
          opacity: isSelected ? 0.8 : isHovered ? 0.7 : 0.4
        }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <div className="relative w-full h-full">
            <motion.div 
              className="absolute inset-0 rounded-xl"
              animate={{
                background: isSelected || isHovered
                  ? 'radial-gradient(circle at center, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.05) 65%, transparent 80%)'
                  : 'radial-gradient(circle at center, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.03) 65%, transparent 80%)'
              }}
              transition={{ duration: 0.3 }}
              style={{ filter: 'blur(1.5px)' }}
            />
            
            {/* World SVG */}
            <Image
              src="/flags/world.svg"
              alt={"World"}
              fill
              className="object-cover relative z-10"
              style={{
                filter: isSelected 
                  ? 'brightness(1.2) contrast(1.1)' 
                  : isHovered 
                    ? 'brightness(1.1) contrast(1.05)'
                    : 'brightness(1) contrast(1)'
              }}
            />
            
            {isSelected && (
              <motion.div
                className="absolute inset-0 rounded-xl"
                animate={{
                  background: 'radial-gradient(circle at center, transparent 30%, rgba(59, 130, 246, 0.15) 50%, rgba(59, 130, 246, 0.05) 70%, transparent 90%)'
                }}
                style={{ 
                  filter: 'blur(2px)',
                  animation: 'pulse 3s ease-in-out infinite'
                }}
              />
            )}
          </div>
        ) : (
          <div className="relative w-full h-full">
            <Image
              src="/flags/world.svg"
              alt={"World"}
              fill
              className="object-cover"
              style={{
                filter: isSelected 
                  ? 'brightness(1.1) contrast(1.1) drop-shadow(0 0 12px rgba(59, 130, 246, 0.4))' 
                  : isHovered 
                    ? 'brightness(1.05) contrast(1.05) drop-shadow(0 0 8px rgba(59, 130, 246, 0.2))'
                    : 'brightness(1) contrast(1)'
              }}
            />
          </div>
        )}
        
        <div 
          className="absolute inset-0 bg-gradient-to-br rounded-xl"
          style={{
            background: isSelected 
              ? isDark
                ? 'linear-gradient(135deg, rgba(0,0,0,0.2), rgba(0,0,0,0.05), rgba(0,0,0,0.2))'
                : 'linear-gradient(135deg, rgba(0,0,0,0.25), rgba(0,0,0,0.08), rgba(0,0,0,0.25))'
              : isDark
                ? 'linear-gradient(135deg, rgba(0,0,0,0.15), rgba(0,0,0,0.03), rgba(0,0,0,0.15))'
                : 'linear-gradient(135deg, rgba(0,0,0,0.2), rgba(0,0,0,0.05), rgba(0,0,0,0.2))'
          }}
        />
      </motion.div>
    );
}