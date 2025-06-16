'use client';
import { getStatusColors } from '@/app/helpers/factCheck';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { StatusType } from '@/app/types/research';
import ResultOverviewHeaderContent from './ResultOverviewHeaderContent';
import ResultOverviewHeaderVerdict from './ResultOverviewHeaderVerdict';


type Props = {
    isLoading: boolean;
    displayResult: {
        status: StatusType;
        confidence_score?: number | undefined | null;
    };
}

const ResultOverviewHeader = ({ isLoading, displayResult }: Props) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const status = displayResult?.status || 'unknown';
    const confidence = displayResult?.confidence_score || 75;

    const colors = getStatusColors(status);

    return (
        <>
            {/* Add the floating animation CSS */}
            <style jsx global>{`
                @keyframes floating {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(2deg); }
                }
                .floating-pattern {
                    animation: floating 20s ease-in-out infinite;
                }
            `}</style>

            <div 
                ref={ref}
                className="relative h-32 overflow-visible mb-4"
            >
                {/* Animated Background Container */}
                <motion.div 
                    className="absolute inset-0 rounded-2xl overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* Main Gradient Background */}
                    <div 
                        className="absolute inset-0 opacity-90"
                        style={{
                            background: `linear-gradient(to right, ${colors.gradientFrom}, ${colors.gradientVia}, ${colors.gradientTo})`
                        }}
                    />

                    {/* Shimmer Effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={isInView ? { x: '100%' } : { x: '-100%' }}
                        transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
                    />

                    {/* Border Glow */}
                    <div 
                        className="absolute inset-0 rounded-2xl border-2 shadow-2xl"
                        style={{
                            borderColor: colors.borderColor,
                            boxShadow: `0 25px 50px -12px ${colors.shadowColor}`
                        }}
                    />
                </motion.div>

                {/* Floating Verdict Icon */}
                <ResultOverviewHeaderVerdict
                    isInView={isInView}
                    colors={colors}
                    confidence={confidence}
                    />

                {/* Content Area */}
                <ResultOverviewHeaderContent
                    isInView={isInView}
                    colors={colors}
                    confidence={confidence}
                    status={status}
                />                 

                {/* Loading Overlay */}
                {isLoading && (
                    <motion.div 
                        className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center backdrop-blur-sm z-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="flex items-center gap-3 text-white">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span className="text-sm font-medium">Analyzing...</span>
                        </div>
                    </motion.div>
                )}
            </div>
        </>
    );
};

export default ResultOverviewHeader;