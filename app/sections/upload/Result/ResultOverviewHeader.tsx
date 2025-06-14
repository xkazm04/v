'use client';

import { getStatusColors, getStatusTranslation } from '@/app/helpers/factCheck';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { StatusType } from '@/app/types/research';


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
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* Main Gradient Background */}
                    <div 
                        className="absolute inset-0 opacity-90"
                        style={{
                            background: `linear-gradient(to right, ${colors.gradientFrom}, ${colors.gradientVia}, ${colors.gradientTo})`
                        }}
                    />
                    
                    {/* Animated Overlay Pattern */}
                    <motion.div 
                        className="absolute inset-0 opacity-20"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 0.2 } : { opacity: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <div 
                            className="absolute inset-0 floating-pattern"
                            style={{
                                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 1px, transparent 1px)`,
                                backgroundSize: '24px 24px'
                            }}
                        />
                    </motion.div>

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

                {/* Content Area */}
                <div className="relative z-10 h-full flex items-center pl-32 pr-6">
                    <div className="flex-1 min-w-0">
                        {/* Verdict Label */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-white/90 uppercase tracking-widest">
                                    Analysis Verdict
                                </span>
                                <div className="flex-1 h-px bg-gradient-to-r from-white/40 to-transparent" />
                            </div>
                        </motion.div>

                        {/* Main Verdict Text */}
                        <motion.h1 
                            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight"
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
                        >
                            {getStatusTranslation(status)}
                        </motion.h1>

                        {/* Confidence Score */}
                        <motion.div
                            className="flex items-center gap-3 mt-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            <div className="text-xs font-medium text-white/80">
                                Confidence: {confidence}%
                            </div>
                            <div className="flex-1 max-w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-white/80 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={isInView ? { width: `${confidence}%` } : { width: 0 }}
                                    transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Status Badge */}
                    <motion.div
                        className="flex-shrink-0"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                        transition={{ delay: 1, duration: 0.6 }}
                    >
                        <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${colors.badgeClasses} backdrop-blur-sm border shadow-lg`}>
                            {status.replace('_', ' ').toUpperCase()}
                        </div>
                    </motion.div>
                </div>

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