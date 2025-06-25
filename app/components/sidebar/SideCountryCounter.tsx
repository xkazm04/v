import { cn } from "@/app/lib/utils";
import { motion } from "framer-motion";
import { useNewsCountContext } from "./SideCat";

type Props = {
    isWorldwide: boolean | undefined;
    country: {
        code: string;
        name?: string;
    };
    isFilterActive?: boolean;
}

const SideCountryCounter = ({ isWorldwide, country, isFilterActive }: Props) => {
    const { getCountForCountry, loading, error } = useNewsCountContext();
    const count = getCountForCountry(country.code);

    const formatCount = (count: number): string => {
        if (count === 0) return '0';
        if (count < 1000) return count.toString();
        if (count < 10000) return `${(count / 1000).toFixed(1)}k`;
        if (count < 1000000) return `${Math.floor(count / 1000)}k`;
        return `${(count / 1000000).toFixed(1)}M`;
    };

    return (
        <div className="w-1/4 flex flex-col items-center justify-center">
            <span
                className={cn(
                    'text-sm font-bold tracking-wider',
                    isFilterActive
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-slate-600 dark:text-slate-400'
                )}
            >
                {isWorldwide ? '' : country.code.toUpperCase()}
            </span>

            <motion.div 
                className="mt-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                    opacity: loading ? 0.5 : 1, 
                    scale: loading ? 0.8 : 1 
                }}
                transition={{ duration: 0.2 }}
            >
                {loading ? (
                    <div className="w-6 h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                ) : error ? (
                    <span className="text-xs text-red-500">!</span>
                ) : (
                    <motion.span
                        className={cn(
                            'text-xs font-medium px-1.5 py-0.5 rounded-full',
                            isFilterActive
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        )}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                            type: "spring", 
                            stiffness: 500, 
                            damping: 25,
                            delay: 0.1 
                        }}
                        whileHover={{ scale: 1.05 }}
                    >
                        {formatCount(count)}
                    </motion.span>
                )}
            </motion.div>
        </div>
    );
};

export default SideCountryCounter;