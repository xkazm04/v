'use client';

import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Settings, User, Globe, MapPin, CheckCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { Label } from '@/app/components/ui/label';
import { VideoProcessingRequest } from "@/app/types/processing";

type Props = {
    handleInputChange: (field: keyof VideoProcessingRequest, value: string | boolean) => void;
    formData: VideoProcessingRequest;
    isProcessing: boolean;
}

const fieldVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

const YtFormAdvanced = ({ handleInputChange, formData, isProcessing }: Props) => {
    const { colors, isDark } = useLayoutTheme();
    const [isExpanded, setIsExpanded] = useState(false);

    const inputStyle = () => ({
        background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
        color: colors.foreground,
        borderColor: isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.5)',
    });

    const selectStyle = () => ({
        background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
        color: colors.foreground,
        borderColor: isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.5)',
    });

    return (
        <motion.div
            variants={fieldVariants}
            className="space-y-4"
        >
            {/* Advanced Options Toggle */}
            <motion.button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 group"
                style={{
                    borderColor: isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.5)',
                    background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                <div className="flex items-center gap-3">
                    <motion.div
                        className="p-2 rounded-lg"
                        style={{
                            background: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)'
                        }}
                        whileHover={{ scale: 1.1 }}
                    >
                        <Settings className="h-4 w-4 text-indigo-500" />
                    </motion.div>
                    <span className="font-semibold" style={{ color: colors.foreground }}>
                        Advanced Options
                    </span>
                </div>
                
                <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronRight className="h-5 w-5" style={{ color: colors.mutedForeground }} />
                </motion.div>
            </motion.button>

            {/* Expanded Content */}
            <motion.div
                initial={false}
                animate={{
                    height: isExpanded ? "auto" : 0,
                    opacity: isExpanded ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
            >
                <motion.div
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1,
                                delayChildren: 0.1
                            }
                        }
                    }}
                    initial="hidden"
                    animate={isExpanded ? "visible" : "hidden"}
                    className="space-y-6 pt-4"
                >
                    {/* Speaker Name and Language */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                        <motion.div
                            variants={fieldVariants}
                            className="space-y-3"
                        >
                            <Label
                                htmlFor="speaker_name"
                                className="flex items-center gap-2 text-sm sm:text-base font-semibold"
                                style={{ color: colors.foreground }}
                            >
                                <User className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                <span>Speaker Name</span>
                            </Label>
                            <input
                                id="speaker_name"
                                type="text"
                                value={formData.speaker_name}
                                onChange={(e) => handleInputChange('speaker_name', e.target.value)}
                                placeholder="e.g., John Politician"
                                className="w-full outline-none h-12 sm:h-14 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 text-sm sm:text-base"
                                style={inputStyle()}
                                disabled={isProcessing}
                            />
                        </motion.div>

                        <motion.div
                            variants={fieldVariants}
                            className="space-y-3"
                        >
                            <Label
                                htmlFor="language_code"
                                className="flex items-center gap-2 text-sm sm:text-base font-semibold"
                                style={{ color: colors.foreground }}
                            >
                                <Globe className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span>Language</span>
                            </Label>
                            <select
                                id="language_code"
                                value={formData.language_code}
                                onChange={(e) => handleInputChange('language_code', e.target.value)}
                                className="w-full outline-none h-12 sm:h-14 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 text-sm sm:text-base appearance-none cursor-pointer"
                                style={selectStyle()}
                                disabled={isProcessing}
                            >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="it">Italian</option>
                            </select>
                        </motion.div>
                    </div>

                    {/* Context */}
                    <motion.div
                        variants={fieldVariants}
                        className="space-y-3"
                    >
                        <Label
                            htmlFor="context"
                            className="flex items-center gap-2 text-sm sm:text-base font-semibold"
                            style={{ color: colors.foreground }}
                        >
                            <MapPin className="h-4 w-4 text-purple-500 flex-shrink-0" />
                            <span>Context</span>
                        </Label>
                        <input
                            id="context"
                            type="text"
                            value={formData.context}
                            onChange={(e) => handleInputChange('context', e.target.value)}
                            placeholder="e.g., Campaign rally, TV interview"
                            className="w-full outline-none h-12 sm:h-14 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 text-sm sm:text-base"
                            style={inputStyle()}
                            disabled={isProcessing}
                        />
                    </motion.div>

                    {/* Processing Options */}
                    <motion.div
                        variants={fieldVariants}
                        className="space-y-4"
                    >
                        <h4 className="font-semibold text-sm" style={{ color: colors.foreground }}>
                            Processing Options
                        </h4>
                        
                        <div className="space-y-3">
                            {/* Research Statements */}
                            <motion.label
                                className="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 group"
                                style={{
                                    borderColor: formData.research_statements 
                                        ? isDark ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.3)'
                                        : isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.4)',
                                    background: formData.research_statements
                                        ? isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)'
                                        : 'transparent'
                                }}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={formData.research_statements}
                                        onChange={(e) => handleInputChange('research_statements', e.target.checked)}
                                        className="sr-only"
                                        disabled={isProcessing}
                                    />
                                    <div 
                                        className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
                                        style={{
                                            borderColor: formData.research_statements ? '#22c55e' : isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.8)',
                                            background: formData.research_statements ? '#22c55e' : 'transparent'
                                        }}
                                    >
                                        {formData.research_statements && (
                                            <CheckCircle className="h-3 w-3 text-white" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-sm font-medium" style={{ color: colors.foreground }}>
                                        Research statements for fact-checking
                                    </span>
                                </div>
                            </motion.label>

                            {/* Cleanup Audio */}
                            <motion.label
                                className="flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 group"
                                style={{
                                    borderColor: formData.cleanup_audio 
                                        ? isDark ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.3)'
                                        : isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.4)',
                                    background: formData.cleanup_audio
                                        ? isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)'
                                        : 'transparent'
                                }}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={formData.cleanup_audio}
                                        onChange={(e) => handleInputChange('cleanup_audio', e.target.checked)}
                                        className="sr-only"
                                        disabled={isProcessing}
                                    />
                                    <div 
                                        className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200"
                                        style={{
                                            borderColor: formData.cleanup_audio ? '#ef4444' : isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.8)',
                                            background: formData.cleanup_audio ? '#ef4444' : 'transparent'
                                        }}
                                    >
                                        {formData.cleanup_audio && (
                                            <Trash2 className="h-3 w-3 text-white" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                    <span className="text-sm font-medium" style={{ color: colors.foreground }}>
                                        Clean up temporary audio files
                                    </span>
                                </div>
                            </motion.label>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default YtFormAdvanced;