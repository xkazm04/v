"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useTheme } from "next-themes"; 
import FeedHeaderContent from "./FeedHeaderContent";
import DynamicBackground from "@/app/components/ui/Decorative/DynamicBackground";
import { statusColorConfig } from "@/app/constants/colors";
import StampText from "@/app/components/ui/Decorative/StampText";
interface StatementOfDayProps {
    className?: string;
}

// Mock statement data - in real app, this would come from your API
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

const FeedHeader = ({ className = "" }: StatementOfDayProps) => {
    const { theme } = useTheme();
    const [isVisible, setIsVisible] = useState(false);
    const currentTheme = theme === 'light' ? 'light' : 'dark';
    const config = statusColorConfig[currentTheme][mockStatement.status];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 1,
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    // Theme-aware text colors
    const textColors = {
        primary: currentTheme === 'light' ? 'text-slate-800' : 'text-white',
        secondary: currentTheme === 'light' ? 'text-slate-600' : 'text-slate-200',
        tertiary: currentTheme === 'light' ? 'text-slate-500' : 'text-slate-300',
        border: currentTheme === 'light' ? 'border-slate-200/40' : 'border-white/10'
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className={`relative overflow-hidden rounded-3xl max-w-[1600px] min-h-[400px] ${className}`}
        >
            {/* Dynamic Background with Animated Pattern */}
            <DynamicBackground
                config={{
                    bgGradient: config.bgGradient,
                    color: config.color,
                    stampOpacity: config.stampOpacity
                }}
                currentTheme={currentTheme}
                setIsVisible={setIsVisible}
            />
                      

            {currentTheme === 'light' && <StampText 
              stampText={config.label}
              config={config}
              />}
            {/* Content */}
            <FeedHeaderContent
                config={config}
                currentTheme={currentTheme}
                itemVariants={itemVariants}
                textColors={textColors}
                mockStatement={mockStatement}
            />

            {/* Subtle overlay for text readability */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: currentTheme === 'light'
                        ? 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.05))'
                        : 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.20))'
                }}
            />
        </motion.div>
    );
};

export default FeedHeader;