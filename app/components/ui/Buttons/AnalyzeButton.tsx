import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";

const AnalyzeButton = ({isLoading}: {isLoading: boolean}) => {
    return <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
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
                <span className="">Analyze</span>
            </>
        )}
    </div>
}

export default AnalyzeButton;