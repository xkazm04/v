'use client';

import { Button } from "@/app/components/ui/button";
import { motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import { ResearchRequest } from "./types";

type Props = {
    formData: ResearchRequest;
    isLoading: boolean;
}

const ResearchFormSubmit = ({ formData, isLoading }: Props) => {
    const isDisabled = !formData.statement.trim() || isLoading;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="pt-2 border border-gray-400/20 rounded-lg"
        >
            <motion.div
                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
            >
                <Button
                    type="submit"
                    disabled={isDisabled}
                    className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold rounded-xl transition-all duration-300 relative overflow-hidden group border-0"
                    style={{
                        boxShadow: isDisabled
                            ? 'none'
                            : '0 8px 25px -8px rgba(59, 130, 246, 0.5)',
                        cursor: isDisabled ? 'not-allowed' : 'pointer'
                    }}
                >
                    {/* Enhanced Background Animation */}
                    {!isDisabled && (
                        <>
                            <motion.div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                            
                            {/* Sparkle effect */}
                            <motion.div
                                className="absolute inset-0 pointer-events-none"
                                animate={{
                                    background: [
                                        'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                                        'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                                        'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)'
                                    ]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </>
                    )}

                    <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                        {isLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
                                <span className="hidden sm:inline">Analyzing Statement...</span>
                                <span className="sm:hidden">Analyzing...</span>
                            </>
                        ) : (
                            <>
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ 
                                        duration: 8, 
                                        repeat: Infinity, 
                                        ease: "linear"
                                    }}
                                >
                                    <Search className="h-5 w-5 sm:h-6 sm:w-6" />
                                </motion.div>
                                <span className="hidden sm:inline">Start Fact-Check Analysis</span>
                                <span className="sm:hidden">Start Analysis</span>
                            </>
                        )}
                    </div>
                </Button>
            </motion.div>
        </motion.div>
    );
};

export default ResearchFormSubmit;