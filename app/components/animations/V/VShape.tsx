import { motion } from 'framer-motion';
import { getGlowColor } from './VGesture';

interface VShapeProps {
  result: any;
  dotXSpring: any;
  dotYSpring: any;
  centerX: number;
  floorY: number;
  energyPulse: number;
  trailOpacity: any;
  instanceId: string;
}

const VShape = ({ 
  result, 
  dotXSpring, 
  dotYSpring, 
  centerX, 
  floorY, 
  energyPulse, 
  trailOpacity,
  instanceId 
}: VShapeProps) => {
  return (
    <>
      {/* Energy field background */}
      {energyPulse > 0 && (
        <motion.polygon
          points={`20,15 ${centerX},${floorY} 80,15`}
          fill={`url(#vFillPattern-${instanceId})`}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0.3],
            filter: [
              `drop-shadow(0 0 0px ${getGlowColor(result)})`,
              `drop-shadow(0 0 30px ${getGlowColor(result)})`,
              `drop-shadow(0 0 15px ${getGlowColor(result)})`
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
        stroke={`url(#centerGlow-${instanceId})`}
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
        strokeWidth="3"
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
        r="3"
        fill={getGlowColor(result)}
        animate={energyPulse > 0 ? {
          r: [3, 6, 3],
          opacity: [1, 0.6, 1]
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
        r="5"
        fill={`url(#dotGlow-${instanceId})`}
        style={{
          filter: `drop-shadow(0 0 15px ${getGlowColor(result)})`,
        }}
      />
    </>
  );
};

export default VShape;