import { motion, MotionValue } from "framer-motion"
import { Check } from "lucide-react";
import { X } from "lucide-react";
import { useRef } from "react";

type Props = {
    isAnimating: boolean;
    setIsAnimating: (value: boolean) => void;
    setResult: (value: 'true' | 'false' | null) => void;
    setShowVContent: (value: boolean) => void;
    setShowImpact: (value: boolean) => void;
    dotX: MotionValue<number>;
    dotY: MotionValue<number>;
    fillProgress: MotionValue<number>;
    spawnParticles: (x: number, y: number, count: number, size: number) => void;
    trailOpacity: MotionValue<number>;
    leftX: number;
    rightX: number;
    centerX: number;
    floorY: number;
    dotYPos: number;
    setEnergyPulse: (value: number) => void;
}


const VControlPanel = ({ isAnimating, setIsAnimating, setResult, setShowVContent, setShowImpact, dotX, dotY, fillProgress, spawnParticles, trailOpacity, leftX, rightX, centerX, floorY, dotYPos, setEnergyPulse }: Props) => {
    const particleIntervalRef = useRef<NodeJS.Timeout>();
    const triggerGesture = (truthValue: 'true' | 'false') => {
        if (isAnimating) return;

        setIsAnimating(true);
        setResult(truthValue);
        setShowVContent(false);
        setShowImpact(false);
        setEnergyPulse(0);

        // Enhanced trail visibility
        trailOpacity.set(0.8);

        // Phase 1: Dramatic sweep with particle trail
        const sweepDuration = 800;
        dotX.set(rightX);
        dotY.set(dotYPos);
        fillProgress.set(1);

        // Continuous particle emission during sweep
        particleIntervalRef.current = setInterval(() => {
            if (dotX.get() > leftX + 10) {
                spawnParticles(dotX.get(), dotY.get(), 3, 0.6);
            }
        }, 50);

        // Phase 2: Impact at center with explosion
        setTimeout(() => {
            if (particleIntervalRef.current) {
                clearInterval(particleIntervalRef.current);
            }

            setShowImpact(true);
            setEnergyPulse(1);

            // Major particle explosion at center
            spawnParticles(centerX, (dotYPos + floorY) / 2, 25, 2);

            // Energy ripples
            setTimeout(() => setEnergyPulse(2), 100);
            setTimeout(() => setEnergyPulse(3), 200);

        }, sweepDuration * 0.7);

        // Phase 3: V-shape reveal with cosmic effect
        setTimeout(() => {
            setShowVContent(true);
            trailOpacity.set(1);

            // Create cosmic particle burst
            spawnParticles(centerX, centerX, 30, 1.5);

            // Secondary ripple effects
            setTimeout(() => spawnParticles(leftX, dotYPos, 10, 1), 100);
            setTimeout(() => spawnParticles(rightX, dotYPos, 10, 1), 200);

        }, sweepDuration);

        // Phase 4: Energy sustain
        setTimeout(() => {
            setEnergyPulse(4);
        }, sweepDuration + 300);

        // Phase 5: Fade out with reverse sweep
        setTimeout(() => {
            setShowVContent(false);
            setShowImpact(false);
            trailOpacity.set(0.4);

            // Reverse sweep
            dotX.set(leftX);
            fillProgress.set(0);

        }, sweepDuration + 800);

        // Phase 6: Complete reset with final particle burst
        setTimeout(() => {
            spawnParticles(leftX, dotYPos, 15, 1);
            setResult(null);
            trailOpacity.set(0.3);
            setEnergyPulse(0);
            setIsAnimating(false);
        }, sweepDuration + 1300);
    };

    return <div className="flex gap-6 justify-center">
        <motion.button
            onClick={() => triggerGesture('true')}
            disabled={isAnimating}
            className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
                boxShadow: isAnimating ? 'none' : '0 8px 25px rgba(16, 185, 129, 0.3)'
            }}
        >
            <Check size={20} />
            <span>Truth</span>
            <motion.div
                className="absolute inset-0 rounded-xl bg-white/20"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
            />
        </motion.button>

        <motion.button
            onClick={() => triggerGesture('false')}
            disabled={isAnimating}
            className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
                boxShadow: isAnimating ? 'none' : '0 8px 25px rgba(239, 68, 68, 0.3)'
            }}
        >
            <X size={20} />
            <span>False</span>
            <motion.div
                className="absolute inset-0 rounded-xl bg-white/20"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
            />
        </motion.button>
    </div>
}

export default VControlPanel;