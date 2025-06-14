import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, FileText } from "lucide-react"
import { ResearchRequest } from "../types";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";

type Props = {
    formData: ResearchRequest;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
    mode: 'predefined' | 'custom';
    setMode: (mode: 'predefined' | 'custom') => void;
    handleChange: (field: 'statement', value: string) => void;
    handleBlur: (field: 'statement') => void;
}

const ResearchFormStatement = ({ formData, handleChange, handleBlur, errors, touched, mode, setMode }: Props) => {
    const { colors, isDark } = useLayoutTheme();
    const maxCharacters = 1000;
    const characterCount = formData.statement.length;
    const isNearLimit = characterCount > maxCharacters * 0.8;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
        >
            {/* Header with Switch */}
            <div className="flex items-center justify-between">
                <Label
                    htmlFor="statement"
                    className="flex items-center gap-2 text-sm sm:text-base font-semibold"
                    style={{ color: colors.foreground }}
                >
                    <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span>Statement *</span>
                </Label>

                {/* Mode Switch */}
                <div className="flex items-center gap-3">
                    <Label 
                        htmlFor="statement-mode-switch" 
                        className="text-sm font-medium"
                        style={{ color: colors.mutedForeground }}
                    >
                        Custom
                    </Label>
                    <Switch
                        id="statement-mode-switch"
                        checked={mode === 'predefined'}
                        onCheckedChange={(checked) => setMode(checked ? 'predefined' : 'custom')}
                    />
                    <Label 
                        htmlFor="statement-mode-switch" 
                        className="text-sm font-medium"
                        style={{ color: colors.mutedForeground }}
                    >
                        Predefined
                    </Label>
                </div>
            </div>

            {/* Input/Display Area */}
            <div className="relative">
                {mode === "custom" ? (
                    <textarea
                        id="statement"
                        placeholder="Enter the statement you want to analyze..."
                        value={formData.statement}
                        onChange={(e) => handleChange('statement', e.target.value)}
                        onBlur={() => handleBlur('statement')}
                        className="w-full h-20 sm:h-24 overflow-hidden outline-none p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 resize-none text-sm sm:text-base leading-relaxed"
                        style={{
                            background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                            borderColor: errors.statement && touched.statement
                                ? '#ef4444'
                                : formData.statement
                                    ? isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)'
                                    : isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.5)',
                            color: colors.foreground,
                            boxShadow: formData.statement
                                ? isDark
                                    ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
                                    : '0 0 0 3px rgba(59, 130, 246, 0.05)'
                                : 'none'
                        }}
                        maxLength={maxCharacters}
                        required
                    />
                ) : (
                    <div
                        className="w-full outline-none h-20 sm:h-24 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 
                        text-sm sm:text-base leading-relaxed flex items-center"
                        style={{
                            background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                            borderColor: errors.statement && touched.statement
                                ? '#ef4444'
                                : formData.statement
                                    ? isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)'
                                    : isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.5)',
                            color: formData.statement ? colors.foreground : colors.mutedForeground,
                            boxShadow: formData.statement
                                ? isDark
                                    ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
                                    : '0 0 0 3px rgba(59, 130, 246, 0.05)'
                                : 'none'
                        }}
                    >
                        {formData.statement || "Select a statement from the examples below..."}
                    </div>
                )}

                {/* Character Count (only for custom mode) */}
                {mode === "custom" && (
                    <div className="absolute bottom-2 right-3 text-xs" 
                         style={{ 
                             color: isNearLimit ? '#f59e0b' : colors.mutedForeground 
                         }}>
                        {characterCount}/{maxCharacters}
                    </div>
                )}
            </div>

            {/* Error Message */}
            <AnimatePresence>
                {errors.statement && touched.statement && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 text-red-500 text-sm font-medium"
                    >
                        <AlertCircle className="h-4 w-4" />
                        {errors.statement}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mode Description */}
            <div 
                className="text-xs px-3 py-2 rounded-lg border 2xl:max-w-[50%] max-w-full"
                style={{
                    borderColor: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.4)',
                    background: isDark ? 'rgba(15, 23, 42, 0.3)' : 'rgba(248, 250, 252, 0.5)',
                    color: colors.mutedForeground
                }}
            >
                {mode === 'custom' 
                    ? "💭 Write your own statement to analyze for fact-checking"
                    : "📋 Choose from curated examples below to test fact-checking capabilities"
                }
            </div>
        </motion.div>
    );
}

export default ResearchFormStatement;