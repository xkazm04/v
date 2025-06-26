'use client';

import { Button } from "@/app/components/ui/button";
import { motion } from "framer-motion";
import { ResearchRequest } from "../types";
import AnalyzeButton from "@/app/components/ui/Buttons/AnalyzeButton";

type Props = {
    formData: ResearchRequest;
    isLoading: boolean;
    hasError?: boolean;
}

const ResearchFormSubmit = ({ formData, isLoading, hasError = false }: Props) => {
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
                animate={hasError ? { 
                    x: [-10, 10, -10, 10, 0],
                    transition: { duration: 0.4 }
                } : {}}
            >
                <Button
                    type="submit"
                    disabled={isDisabled}
                    className={`w-full h-12 sm:h-14 text-base sm:text-lg font-semibold rounded-xl transition-all duration-300 relative overflow-hidden group border-0 ${
                        hasError ? 'bg-red-500 hover:bg-red-600' : ''
                    }`}
                    style={{
                        boxShadow: isDisabled
                            ? 'none'
                            : hasError
                            ? '0 8px 25px -8px rgba(239, 68, 68, 0.5)'
                            : '0 8px 25px -8px rgba(59, 130, 246, 0.5)',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        background: hasError 
                            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                            : undefined
                    }}
                >
                    {/* Enhanced Background Animation */}
                    {!isDisabled && !hasError && (
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

                    <AnalyzeButton isLoading={isLoading} hasError={hasError} />
                </Button>
            </motion.div>
        </motion.div>
    );
};

export default ResearchFormSubmit;