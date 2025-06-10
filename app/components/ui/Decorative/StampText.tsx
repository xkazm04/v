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

const StampText = ({config, stampText}: Props) => {
    return <>
        {/* Massive Stamp Background */}
        <motion.div
            initial={{
                scale: 3,
                opacity: 0.8,
                rotate: -15,
                x: 50,
                y: -20
            }}
            animate={{
                scale: 1.2,
                opacity: 0.03,
                rotate: -12,
                x: 20,
                y: -10
            }}
            transition={{
                duration: 2,
                ease: "easeOut",
                delay: 0.3
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        >
            <div
                className="text-[120px] font-black tracking-tighter transform select-none"
                style={{
                    color: config.color,
                    textShadow: `0 0 40px ${config.color}30`,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontWeight: 900,
                    letterSpacing: '-0.05em',
                    lineHeight: 0.8,
                    WebkitTextStroke: `2px ${config.color}15`,
                    textTransform: 'uppercase'
                }}
            >
                {stampText}
            </div>
        </motion.div>

        {/* Subtle Stamp Border Effect */}
        <motion.div
            initial={{
                scale: 2,
                opacity: 0,
                rotate: -15
            }}
            animate={{
                scale: 1.1,
                opacity: 0.12,
                rotate: -12
            }}
            transition={{
                duration: 2,
                ease: "easeOut",
                delay: 0.5
            }}
            className="absolute inset-4 border-4 border-dashed pointer-events-none z-0 rounded-lg"
            style={{
                borderColor: config.color,
                filter: 'blur(1px)'
            }}
        />
    </>
}

export default StampText;