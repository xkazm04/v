import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle } from "lucide-react"
import { ResearchRequest } from "./types";
import { Label } from "@radix-ui/react-label";
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
    return <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
    >
        <div className="relative">
            <div
                className="flex items-center gap-2 text-lg font-semibold py-2 text-gray-100"
                style={{ color: colors.foreground }}
            >
                Statement*
            </div>
            <div className="absolute top-2 right-0">
                <div className="flex items-end justify-end space-x-2">
                    <Label htmlFor="airplane-mode">Predefined</Label>
                    <Switch
                        value={mode}
                        onCheckedChange={() => setMode(mode === "predefined" ? "custom" : "predefined")}
                        id="airplane-mode" />
                </div>
            </div>
            {mode === "custom" && <textarea
                id="statement"
                placeholder="Enter the statement you want to analyze..."
                value={formData.statement}
                onChange={(e) => handleChange('statement', e.target.value)}
                onBlur={() => handleBlur('statement')}
                className="w-full h-16 overflow-hidden outline-none p-4 rounded-xl border-2 transition-all duration-300 resize-none text-base leading-relaxed"
                style={{
                    background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                    border: `2px solid ${errors.statement && touched.statement
                        ? '#ef4444'
                        : formData.statement
                            ? isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)'
                            : isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.5)'
                        }`,
                    color: colors.foreground,
                    boxShadow: formData.statement
                        ? isDark
                            ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
                            : '0 0 0 3px rgba(59, 130, 246, 0.05)'
                        : 'none'
                }}
                maxLength={maxCharacters}
                required
            />}
            {mode === "predefined" &&
                <div
                    className="w-full outline-none h-16 p-4 rounded-xl border-2 transition-all duration-300 
                resize-none text-base leading-relaxed"
                    style={{
                        background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                        border: `2px solid ${errors.statement && touched.statement
                            ? '#ef4444'
                            : formData.statement
                                ? isDark ? 'rgba(59, 130, 246, 0.5)' : 'rgba(59, 130, 246, 0.3)'
                                : isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.5)'
                            }`,
                        color: colors.foreground,
                        boxShadow: formData.statement
                            ? isDark
                                ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
                                : '0 0 0 3px rgba(59, 130, 246, 0.05)'
                            : 'none'
                    }}>{formData.statement}</div>
            }
        </div>
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
    </motion.div>

}

export default ResearchFormStatement