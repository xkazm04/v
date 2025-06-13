"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useTheme } from "next-themes"; 
import FeedHeaderContent from "./FeedHeaderContent";
import DynamicBackground from "@/app/components/ui/Decorative/DynamicBackground";
import { GlassContainer } from "@/app/components/ui/containers/GlassContainer";
import { statusColorConfig } from "@/app/constants/colors";
import StampText from "@/app/components/ui/Decorative/StampText";

interface StatementOfDayProps {
    className?: string;
}

// Mock statement data
const mockStatement = {
    id: "statement-of-day",
    text: "Climate change is primarily caused by solar radiation variations, not human activity",
    verdict: "This statement is FALSE. Scientific consensus shows that current climate change is primarily driven by human activities, particularly greenhouse gas emissions.",
    status: "FALSE" as const,
    impact_score: 9.2,
    date: new Date().toISOString(),
    source: "Social Media Post",
    reach: "2.3M views"
};

// Enhanced animation variants
const containerVariants = {
    hidden: { 
        opacity: 0,
        scale: 0.95,
        y: 20
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

const FeedHeader = ({ className = "" }: StatementOfDayProps) => {
    const { theme } = useTheme();
    const [isVisible, setIsVisible] = useState(false);
    const currentTheme = theme === 'light' ? 'light' : 'dark';
    const config = statusColorConfig[currentTheme][mockStatement.status];

    // Theme-aware text colors
    const textColors = {
        primary: currentTheme === 'light' ? 'text-slate-800' : 'text-white',
        secondary: currentTheme === 'light' ? 'text-slate-600' : 'text-slate-200',
        tertiary: currentTheme === 'light' ? 'text-slate-500' : 'text-slate-300',
        border: currentTheme === 'light' ? 'border-slate-200/40' : 'border-white/10'
    };

    return (
        <div className={`relative max-w-[1600px] ${className}`}>
            {/* Background Layer */}
            <div className="absolute inset-0 -z-10">
                <DynamicBackground
                    config={{
                        bgGradient: config.bgGradient,
                        color: config.color,
                        stampOpacity: config.stampOpacity
                    }}
                    currentTheme={currentTheme}
                    setIsVisible={setIsVisible}
                />
            </div>

            {/* Glassy Container */}
            <GlassContainer
                variants={containerVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                style="frosted"
                border="glow"
                rounded="3xl"
                shadow="glow"
                theme={currentTheme}
                overlay={true}
                overlayOpacity={currentTheme === 'light' ? 0.15 : 0.08}
                className="h-full relative"
            >
                {/* Enhanced inner glow effect */}
                <div 
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{
                        background: currentTheme === 'light'
                            ? `radial-gradient(circle at 50% 50%, 
                                rgba(255,255,255,0.3) 0%, 
                                rgba(255,255,255,0.1) 30%, 
                                transparent 70%
                              )`
                            : `radial-gradient(circle at 50% 50%, 
                                rgba(255,255,255,0.1) 0%, 
                                rgba(255,255,255,0.05) 30%, 
                                transparent 70%
                              )`
                    }}
                />

                {/* Status stamp - only visible in light theme */}
                {currentTheme === 'light' && (
                    <StampText 
                        stampText={config.label}
                        config={config}
                    />
                )}

                {/* Main Content */}
                <FeedHeaderContent
                    config={config}
                    currentTheme={currentTheme}
                    textColors={textColors}
                    mockStatement={mockStatement}
                />

                {/* Enhanced readability overlay */}
                <div
                    className="absolute inset-0 pointer-events-none rounded-3xl"
                    style={{
                        background: currentTheme === 'light'
                            ? `linear-gradient(135deg, 
                                rgba(255,255,255,0.1) 0%, 
                                transparent 50%, 
                                rgba(0,0,0,0.05) 100%
                              )`
                            : `linear-gradient(135deg, 
                                rgba(255,255,255,0.05) 0%, 
                                transparent 50%, 
                                rgba(0,0,0,0.20) 100%
                              )`
                    }}
                />

                {/* Floating particles effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-white/20 rounded-full"
                            style={{
                                left: `${20 + i * 15}%`,
                                top: `${30 + i * 10}%`,
                            }}
                            animate={{
                                y: [-10, 10, -10],
                                opacity: [0.2, 0.5, 0.2],
                                scale: [0.8, 1.2, 0.8],
                            }}
                            transition={{
                                duration: 3 + i * 0.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.3,
                            }}
                        />
                    ))}
                </div>
            </GlassContainer>
        </div>
    );
};

export default FeedHeader;