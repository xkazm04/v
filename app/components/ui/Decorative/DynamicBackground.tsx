import { useState, useEffect } from "react";
import { FakeStamp } from "../../icons/stamps";
import { motion } from "framer-motion";

type Props = {
    config: {
        color: string;
        bgGradient: string;
        stampOpacity: string;
    };
    currentTheme: 'light' | 'dark';
    setIsVisible?: (visible: boolean) => void;
}

const DynamicBackground = ({ config, currentTheme, setIsVisible }: Props) => {
    const [particlePositions, setParticlePositions] = useState<Array<{ x: number, y: number, delay: number }>>([]);

    useEffect(() => {
        const particles = Array.from({ length: 20 }, (_, i) => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            delay: Math.random() * 5
        }));
        setParticlePositions(particles);

        // Trigger entrance animation
        const timer = setTimeout(() => setIsVisible?.(true), 100);
        return () => clearTimeout(timer);
    }, []);
    return <div className="absolute inset-0">
        {/* Base gradient */}
        {currentTheme === 'dark' && <>
            <div
                className="absolute inset-0"
                style={{
                    background: config.bgGradient
                }}
            />
            </>
        }

        {/* Stamp background */}
        <div
            className="absolute inset-0 flex items-center justify-end"
            style={{ opacity: config.stampOpacity }}
        >
            <FakeStamp width={800} />
        </div>

        {/* Floating particles */}
        {particlePositions.map((particle, index) => (
            <motion.div
                key={index}
                className="absolute w-1 h-1 rounded-full"
                style={{
                    left: `${particle.x}%`,
                    top: `${particle.y}%`,
                    backgroundColor: config.color,
                    opacity: currentTheme === 'light' ? 0.4 : 0.6
                }}
                animate={{
                    y: [-10, 10, -10],
                    opacity: currentTheme === 'light'
                        ? [0.1, 0.4, 0.1]
                        : [0.2, 0.8, 0.2],
                    scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: particle.delay,
                    ease: "easeInOut"
                }}
            />
        ))}

        {/* Large accent circles */}
        <motion.div
            className="absolute -top-20 -right-20 w-40 h-40 rounded-full"
            style={{
                background: `radial-gradient(circle, ${config.color}${currentTheme === 'light' ? '15' : '20'}, transparent 70%)`
            }}
            animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
            }}
            transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
            }}
        />

        <motion.div
            className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full"
            style={{
                background: `radial-gradient(circle, ${config.color}${currentTheme === 'light' ? '10' : '15'}, transparent 60%)`
            }}
            animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0]
            }}
            transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
            }}
        />
    </div>
}

export default DynamicBackground;