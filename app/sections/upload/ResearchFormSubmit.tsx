import { Button } from "@/app/components/ui/button"
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { motion } from "framer-motion"
import { Loader2, Search } from "lucide-react"
import { ResearchRequest } from "./types";

type Props = {
    formData: ResearchRequest;
    isLoading: boolean;
}

const ResearchFormSubmit = ({formData, isLoading}: Props) => {
    const { colors, isDark } = useLayoutTheme();
    return <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="pt-4"
    >
        <Button
            type="submit"
            disabled={!formData.statement.trim() || isLoading}
            className="w-full h-14 text-lg font-semibold rounded-xl transition-all duration-300 relative overflow-hidden group"
            style={{
                background: !formData.statement.trim() || isLoading
                    ? isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.5)'
                    : `linear-gradient(135deg, 
                        rgba(59, 130, 246, 0.9) 0%,
                        rgba(147, 51, 234, 0.9) 50%,
                        rgba(168, 85, 247, 0.9) 100%
                      )`,
                border: 'none',
                color: !formData.statement.trim() || isLoading
                    ? colors.mutedForeground
                    : 'white',
                boxShadow: !formData.statement.trim() || isLoading
                    ? 'none'
                    : '0 10px 30px -5px rgba(59, 130, 246, 0.4)',
                cursor: !formData.statement.trim() || isLoading ? 'not-allowed' : 'pointer'
            }}
        >
            {/* Animated Background */}
            {formData.statement.trim() && !isLoading && (
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        background: `linear-gradient(135deg, 
                        rgba(59, 130, 246, 1) 0%,
                        rgba(147, 51, 234, 1) 50%,
                        rgba(168, 85, 247, 1) 100%
                      )`
                    }}
                />
            )}

            <div className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                    <>
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Analyzing Statement...</span>
                    </>
                ) : (
                    <>
                        <Search className="h-6 w-6" />
                        <span>Start Fact-Check Research</span>
                    </>
                )}
            </div>
        </Button>
    </motion.div>
}

export default ResearchFormSubmit