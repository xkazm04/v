import { motion } from "framer-motion";
import { Search, Loader2, AlertCircle } from "lucide-react";

const AnalyzeButton = ({ isLoading, hasError = false }: { isLoading: boolean, hasError?: boolean }) => {
    return (
        <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
            {isLoading ? (
                <>
                    <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
                    <span className="hidden sm:inline">Analyzing Statement...</span>
                    <span className="sm:hidden">Analyzing...</span>
                </>
            ) : hasError ? (
                <>
                    <motion.div
                        animate={{
                            rotate: [0, -10, 10, -10, 10, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 0.6,
                            ease: "easeInOut"
                        }}
                    >
                        <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                    </motion.div>
                    <span className="hidden sm:inline">Try Again</span>
                    <span className="sm:hidden">Retry</span>
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
                    <span className="">Analyze</span>
                </>
            )}
        </div>
    );
}

export default AnalyzeButton;