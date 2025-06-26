import { motion } from "framer-motion"

export const getStampText = (status: string) => {
  switch (status) {
    case 'FALSE': return 'LIE';
    case 'MISLEADING': return 'MANIPULATION';
    case 'PARTIALLY_TRUE': return 'PARTIAL';
    case 'TRUE': return 'VERIFIED';
    case 'UNVERIFIABLE': return 'UNCLEAR';
    default: return 'CHECKED';
  }
};

type Props = {
  config: {
    color: string;
    bgColor?: string;
    borderColor?: string;
    icon?: React.ComponentType<any>;
  };
  stampText: string;
}

const StampText = ({ config, stampText }: Props) => {
  return (
    <>
      <motion.div
        initial={{
          scale: 2.5,
          opacity: 0,
          rotate: -15
        }}
        animate={{
          scale: 1,
          opacity: 0.4,
          rotate: -12
        }}
        transition={{
          duration: 1.5,
          ease: "easeOut",
          delay: 0.3
        }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{
          contain: 'layout style paint',
          willChange: 'transform, opacity'
        }}
      >
        <div
          className="font-black tracking-tighter transform"
          style={{
            fontSize: 'clamp(80px, 12vw, 120px)', 
            color: config.color,
            textShadow: `0 0 40px ${config.color}20`,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 900,
            letterSpacing: '-0.05em',
            lineHeight: 0.8,
            WebkitTextStroke: `1px ${config.color}10`,
            textTransform: 'uppercase',
            textRendering: 'optimizeSpeed',
            fontSmooth: 'never',
            WebkitFontSmoothing: 'none'
          }}
        >
          {stampText}
        </div>
      </motion.div>
      <motion.div
        initial={{
          scale: 1.8,
          opacity: 0,
          rotate: -15
        }}
        animate={{
          scale: 1,
          opacity: 0.08,
          rotate: -12
        }}
        transition={{
          duration: 1.2,
          ease: "easeOut",
          delay: 0.6
        }}
        className="absolute inset-8 border-2 border-dashed pointer-events-none rounded-lg"
        style={{
          borderColor: config.color,
          contain: 'layout style',
          willChange: 'transform, opacity'
        }}
      />
    </>
  );
};

export default StampText;