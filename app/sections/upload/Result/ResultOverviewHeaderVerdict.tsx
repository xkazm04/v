
import Image from 'next/image';
import { motion } from 'framer-motion';

type Props = {
    isInView: boolean;
    colors: {
        glowColor: string;
    };
    confidence: number;
}

const ResultOverviewHeaderVerdict = ({isInView, colors, confidence}: Props) => {
    return <>
        <motion.div
            className="absolute -top-8 -bottom-8 left-6 w-24 flex items-center justify-center z-20"
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={isInView ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0, rotate: -180, opacity: 0 }}
            transition={{
                delay: 0.2,
                duration: 0.8,
                type: "spring",
                stiffness: 100,
                damping: 10
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
        >
            <div className="relative">
                {/* Icon Glow Background */}
                <motion.div
                    className="absolute inset-0 rounded-full blur-xl"
                    style={{ backgroundColor: colors.glowColor }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 0.8, 0.6]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Main Icon Container */}
                <div className="relative w-20 h-20 bg-white/10 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center shadow-2xl">
                    <Image
                        src="/logos/logo_spray_white.png"
                        alt="Verdict Icon"
                        width={48}
                        height={48}
                        className="drop-shadow-lg"
                        onError={(e) => {
                            // Fallback if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />

                    {/* Confidence Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="2"
                        />
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="rgba(255,255,255,0.8)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 45}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                            animate={isInView ? {
                                strokeDashoffset: 2 * Math.PI * 45 * (1 - confidence / 100)
                            } : { strokeDashoffset: 2 * Math.PI * 45 }}
                            transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                        />
                    </svg>
                </div>
            </div>
        </motion.div>
    </>
}

export default ResultOverviewHeaderVerdict;