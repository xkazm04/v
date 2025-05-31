import { AnimatePresence, motion } from "framer-motion"
import { getGlowColor } from "./VGesture"
import { Check, Sparkles, X } from "lucide-react"

  const vContentVariants = {
    hidden: { 
      scale: 0, 
      opacity: 0, 
      rotateY: -90,
      z: -100
    },
    visible: { 
      scale: [0, 1.3, 1], 
      opacity: [0, 1, 1],
      rotateY: [90, 0, 0],
      z: [100, 0, 0],
      transition: { 
        duration: 0.8,
        times: [0, 0.6, 1],
        ease: "backOut"
      }
    },
    exit: {
      scale: 0,
      opacity: 0,
      rotateY: 90,
      transition: { duration: 0.4 }
    }
  };

type Props = {
    result: 'true' | 'false' | null;
    showVContent: boolean;
}

const VContent = ({result, showVContent}: Props) => {
    return <AnimatePresence>
        {showVContent && (
            <motion.div
                className="absolute left-1/2 top-1/2"
                style={{
                    transform: 'translate(-50%, -50%)',
                    perspective: '1000px'
                }}
                variants={vContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <motion.div
                    className="relative rounded-full p-6 backdrop-blur-sm"
                    style={{
                        backgroundColor: `${getGlowColor(result)}20`,
                        border: `3px solid ${getGlowColor(result)}60`,
                        boxShadow: `
                    0 0 40px ${getGlowColor(result)}60, 
                    inset 0 0 30px ${getGlowColor(result)}20,
                    0 0 80px ${getGlowColor(result)}40
                  `,
                    }}
                    animate={{
                        boxShadow: [
                            `0 0 40px ${getGlowColor(result)}60, inset 0 0 30px ${getGlowColor(result)}20`,
                            `0 0 60px ${getGlowColor(result)}80, inset 0 0 40px ${getGlowColor(result)}30`,
                            `0 0 40px ${getGlowColor(result)}60, inset 0 0 30px ${getGlowColor(result)}20`
                        ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                        {result === 'true' ? (
                            <Check size={32} color={getGlowColor(result)} strokeWidth={3} />
                        ) : (
                            <X size={32} color={getGlowColor(result)} strokeWidth={3} />
                        )}
                    </motion.div>

                    {/* Floating sparkles */}
                    <Sparkles
                        className="absolute -top-2 -right-2 animate-pulse"
                        size={16}
                        color={getGlowColor(result)}
                    />
                    <Sparkles
                        className="absolute -bottom-2 -left-2 animate-pulse"
                        size={12}
                        color={getGlowColor(result)}
                        style={{ animationDelay: '0.5s' }}
                    />
                </motion.div>

                {/* Expanding energy rings */}
                {[1, 2, 3].map(i => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border-2"
                        style={{
                            borderColor: `${getGlowColor(result)}30`,
                            scale: 1 + i * 0.3
                        }}
                        animate={{
                            scale: [1 + i * 0.3, 2 + i * 0.5],
                            opacity: [0.6, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "easeOut"
                        }}
                    />
                ))}
            </motion.div>
        )}
    </AnimatePresence>
}

export default VContent