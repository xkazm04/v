import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { WorldIconSetting } from "@/app/components/icons/nav/WorldIcons";

const CountryFlagBackground = ({ flagSvg, alt, isSelected, isHovered, isWorldwide = false }: { 
  flagSvg: string; 
  alt: string; 
  isSelected: boolean;
  isHovered: boolean;
  isWorldwide?: boolean;
}) => {
  const [imageError, setImageError] = useState(false);
  
  if (imageError) {
    return null;
  }

  if (isWorldwide || alt.toLowerCase().includes('world') || flagSvg.includes('world.svg')) {
    <WorldIconSetting
      isSelected={isSelected}
      isHovered={isHovered}
      />
  }
  
  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden rounded-xl"
      animate={{
        opacity: isSelected ? 0.7 : isHovered ? 0.7 : 0.15
      }}
      transition={{ duration: 0.3 }}
    >
      <Image
        src={flagSvg}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setImageError(true)}
      />
      <div 
        className="absolute inset-0 bg-gradient-to-br rounded-xl"
        style={{
          background: isSelected 
            ? 'linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1), rgba(0,0,0,0.3))'
            : 'linear-gradient(135deg, rgba(0,0,0,0.2), rgba(0,0,0,0.05), rgba(0,0,0,0.2))'
        }}
      />
    </motion.div>
  );
};

export default CountryFlagBackground;