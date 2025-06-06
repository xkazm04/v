import { Input } from "@/app/components/ui/input";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { Label } from "@radix-ui/react-label";
import { motion } from "framer-motion"
import { Calendar, MapPin, User } from "lucide-react";
import { ResearchRequest } from "./types";

type Props = {
    formData: ResearchRequest;
    handleChange: (field: keyof Props['formData'], value: string) => void;
    handleBlur: (field: keyof Props['formData']) => void;
}

const ResearchFormContent = ({formData, handleChange, handleBlur}: Props) => {
    const { colors, isDark } = useLayoutTheme();
    return <>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid lg:grid-cols-2 gap-6"
        >
            {/* Source Input */}
            <div className="space-y-3">
                <Label
                    htmlFor="source"
                    className="flex items-center gap-2 text-base font-semibold"
                    style={{ color: colors.foreground }}
                >
                    <User className="h-4 w-4 text-emerald-500" />
                    Source
                </Label>
                <textarea
                    id="source"
                    placeholder="Who said this? (e.g., 'John Smith, CEO of XYZ Corp')"
                    value={formData.source}
                    onChange={(e) => handleChange('source', e.target.value)}
                    onBlur={() => handleBlur('source')}
                    className="w-full outline-none h-24 p-4 rounded-xl border-2 transition-all duration-300 resize-none text-sm"
                    style={{
                        background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                        border: `2px solid ${formData.source
                                ? isDark ? 'rgba(34, 197, 94, 0.5)' : 'rgba(34, 197, 94, 0.3)'
                                : isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.5)'
                            }`,
                        color: colors.foreground,
                        boxShadow: formData.source
                            ? isDark
                                ? '0 0 0 3px rgba(34, 197, 94, 0.1)'
                                : '0 0 0 3px rgba(34, 197, 94, 0.05)'
                            : 'none'
                    }}
                />
            </div>

            {/* Context Input */}
            <div className="space-y-3">
                <Label
                    htmlFor="context"
                    className="flex items-center gap-2 text-base font-semibold"
                    style={{ color: colors.foreground }}
                >
                    <MapPin className="h-4 w-4 text-purple-500" />
                    Context
                </Label>
                <textarea
                    id="context"
                    placeholder="When and where was this said? (e.g., 'During a press conference on March 15, 2024')"
                    value={formData.context}
                    onChange={(e) => handleChange('context', e.target.value)}
                    onBlur={() => handleBlur('context')}
                    className="w-full outline-none h-24 p-4 rounded-xl border-2 transition-all duration-300 resize-none text-sm"
                    style={{
                        background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                        border: `2px solid ${formData.context
                                ? isDark ? 'rgba(147, 51, 234, 0.5)' : 'rgba(147, 51, 234, 0.3)'
                                : isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.5)'
                            }`,
                        color: colors.foreground,
                        boxShadow: formData.context
                            ? isDark
                                ? '0 0 0 3px rgba(147, 51, 234, 0.1)'
                                : '0 0 0 3px rgba(147, 51, 234, 0.05)'
                            : 'none'
                    }}
                />
            </div>
        </motion.div>

        {/* Statement Date */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3 max-w-md"
        >
            <Label
                htmlFor="statement_date"
                className="flex items-center gap-2 text-base font-semibold"
                style={{ color: colors.foreground }}
            >
                <Calendar className="h-4 w-4 text-amber-500" />
                Statement Date
            </Label>
            <Input
                id="statement_date"
                type="date"
                value={formData.statement_date}
                onChange={(e) => handleChange('statement_date', e.target.value)}
                onBlur={() => handleBlur('statement_date')}
                className="h-12 outline-none px-4 text-base rounded-xl border-2 transition-all duration-300"
                style={{
                    background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                    border: `2px solid ${formData.statement_date
                            ? isDark ? 'rgba(245, 158, 11, 0.5)' : 'rgba(245, 158, 11, 0.3)'
                            : isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.5)'
                        }`,
                    color: colors.foreground,
                    boxShadow: formData.statement_date
                        ? isDark
                            ? '0 0 0 3px rgba(245, 158, 11, 0.1)'
                            : '0 0 0 3px rgba(245, 158, 11, 0.05)'
                        : 'none'
                }}
            />
        </motion.div>
    </>
}

export default ResearchFormContent;