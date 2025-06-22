import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

const CountryFlagBackground = ({ flagSvg, alt, isSelected, isHovered }: { 
  flagSvg: string; 
  alt: string; 
  isSelected: boolean;
  isHovered: boolean;
}) => {
  const [imageError, setImageError] = useState(false);
  
  if (imageError) {
    return null;
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
      {/* Overlay gradient for better text readability */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"
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