import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, FileText } from "lucide-react"
import { Label } from "recharts"
import { ResearchRequest } from "./types";

type Props = {
    formData: ResearchRequest;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
    handleChange: (field: 'statement', value: string) => void;
    handleBlur: (field: 'statement') => void;
}

const ResearchFormStatement = ({formData, handleChange, handleBlur, errors, touched}: Props) => {
    const { colors, isDark } = useLayoutTheme();
    const characterCount = formData.statement.length;
    const maxCharacters = 1000;
    return <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
    >
        <Label
            className="flex items-center gap-2 text-lg font-semibold"
            style={{ color: colors.foreground }}
        >
            <FileText className="h-5 w-5 text-blue-500" />
            Statement to Fact-Check *
        </Label>
        <div className="relative">
            <textarea
                id="statement"
                placeholder="Enter the statement you want to fact-check... (e.g., 'The unemployment rate has decreased by 5% this year')"
                value={formData.statement}
                onChange={(e) => handleChange('statement', e.target.value)}
                onBlur={() => handleBlur('statement')}
                className="w-full outline-none min-h-32 p-4 rounded-xl border-2 transition-all duration-300 resize-none text-base leading-relaxed"
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
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <span
                    className={`text-sm font-medium ${characterCount > maxCharacters * 0.9 ? 'text-amber-500' : 'text-slate-500'
                        }`}
                >
                    {characterCount}/{maxCharacters}
                </span>
            </div>
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