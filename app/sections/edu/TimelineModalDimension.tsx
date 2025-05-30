import { motion, AnimatePresence } from "framer-motion";
import { dimensionConfig } from "./TimelineModalDimensions";

type Props = {
    event: {
        id: string;
        text_1?: string;
        text_2?: string;
        text_3?: string;
        text_4?: string;
    };
    panelColors: {
        bg: string;
        border: string;
        text: string;
        accent: string;
    }[];
}

const TimelineModalDimension = ({ 
    dimension, 
    panelColor, 
    index, 
    text, 
    isActive, 
    onHover,
    onLeave
}: {
    dimension: typeof dimensionConfig[0];
    panelColor: Props['panelColors'][0];
    index: number;
    text: string;
    isActive: boolean;
    onHover: () => void;
    onLeave: () => void;
}) => {
    return (
        <motion.div
            className={`relative px-6 py-10 rounded-xl border-2 transition-all duration-500 cursor-pointer group overflow-hidden ${
                isActive 
                    ? `${panelColor.bg} ${panelColor.border} shadow-2xl scale-[1.02]` 
                    : `bg-card/50 border-border/30 hover:${panelColor.bg} hover:${panelColor.border} hover:shadow-lg`
            }`}
            initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            animate={{ 
                opacity: 1, 
                scale: isActive ? 1.02 : 1, 
                rotateY: 0,
                y: isActive ? -4 : 0
            }}
            transition={{ 
                delay: 0.2 + index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 30
            }}
            whileHover={{ 
                y: -6,
                scale: 1.03,
                transition: { duration: 0.2 }
            }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
        >
            {/* Animated background gradient */}
            <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${panelColor.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                animate={{
                    background: isActive 
                        ? `linear-gradient(135deg, hsl(var(--${panelColor.accent.replace('bg-', '')})/0.1), hsl(var(--${panelColor.accent.replace('bg-', '')})/0.05))`
                        : undefined
                }}
            />
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute w-1 h-1 ${panelColor.accent} rounded-full opacity-20`}
                        style={{
                            left: `${20 + i * 30}%`,
                            top: `${30 + i * 20}%`,
                        }}
                        animate={{
                            y: isActive ? [-5, 5, -5] : [0],
                            opacity: isActive ? [0.2, 0.6, 0.2] : [0.1],
                            scale: isActive ? [0.8, 1.2, 0.8] : [0.8],
                        }}
                        transition={{
                            duration: 2 + i * 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.3,
                        }}
                    />
                ))}
            </div>

            {/* Icon and status indicator */}
            <div className={`absolute ${dimension.position.dot} flex items-center gap-2`}>
                <motion.div
                    className="text-lg"
                    animate={{
                        scale: isActive ? [1, 1.2, 1] : [1],
                        rotate: isActive ? [0, 10, -10, 0] : [0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: isActive ? Infinity : 0,
                        ease: "easeInOut"
                    }}
                >
                    {dimension.icon}
                </motion.div>
                <motion.div 
                    className={`w-3 h-3 rounded-full ${panelColor.accent} shadow-lg`}
                    animate={{
                        scale: isActive ? [1, 1.3, 1] : [1],
                        opacity: isActive ? [0.6, 1, 0.6] : [0.4],
                        boxShadow: isActive 
                            ? ['0 0 0 0 hsl(var(--primary)/0.4)', '0 0 0 8px hsl(var(--primary)/0)', '0 0 0 0 hsl(var(--primary)/0.4)']
                            : ['0 0 0 0 hsl(var(--primary)/0)']
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: isActive ? Infinity : 0,
                        ease: "easeOut"
                    }}
                />
            </div>


            {/* Header section */}
            <div className="relative z-10 mb-4">
                <motion.h4 
                    className={`font-bold text-lg mb-1 transition-colors duration-300 ${
                        isActive ? panelColor.text : 'text-foreground group-hover:' + panelColor.text
                    }`}
                    animate={{
                        scale: isActive ? 1.05 : 1,
                    }}
                >
                    {dimension.title}
                </motion.h4>
                <p className="text-xs text-muted-foreground font-medium opacity-75">
                    {dimension.subtitle}
                </p>
            </div>

            {/* Content with typewriter effect for active card */}
            <motion.div className="relative z-10">
                <AnimatePresence mode="wait">
                        <motion.p
                            key="active-text"
                            className={`text-muted-foreground hover:text-foreground font-medium leading-relaxed text-sm`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {text}
                        </motion.p>
                </AnimatePresence>
            </motion.div>

            {/* Hover indicator line */}
            <motion.div
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 bg-gradient-to-b text-foreground rounded-full shadow-lg`}
                animate={{ 
                    height: isActive ? '80%' : '0%',
                    opacity: isActive ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Interactive corners */}
            <motion.div
                className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 ${panelColor.border} opacity-0 group-hover:opacity-60 transition-opacity duration-300`}
                animate={{
                    scale: isActive ? 1.2 : 1,
                    opacity: isActive ? 0.8 : 0
                }}
            />
            <motion.div
                className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 ${panelColor.border} opacity-0 group-hover:opacity-60 transition-opacity duration-300`}
                animate={{
                    scale: isActive ? 1.2 : 1,
                    opacity: isActive ? 0.8 : 0
                }}
            />
        </motion.div>
    );
};

export default TimelineModalDimension;