import { motion } from 'framer-motion';
import { getStatusTranslation, type SupportedLanguage } from '@/app/helpers/factCheck';
import { useUserPreferences } from '@/app/hooks/use-user-preferences';

type Props = {
    isInView: boolean;
    status: string;
    confidence: number;
    colors: {
        badgeClasses: string;
        gradientFrom: string;
        gradientVia: string;
        gradientTo: string;
    };
}

const ResultOverviewHeaderContent = ({ isInView, confidence, colors, status }: Props) => {
    const { preferences } = useUserPreferences();
    
    // Get user language preference, default to English
    const userLanguage = (preferences.language || 'en') as SupportedLanguage;
    
    // Ensure the language is supported, fallback to English
    const supportedLanguage: SupportedLanguage = ['en', 'es', 'cs'].includes(userLanguage) 
        ? userLanguage 
        : 'en';

    return (
        <div className="relative z-10 h-full flex items-center pl-32 pr-6">
            <div className="flex-1 min-w-0">
                {/* Verdict Label */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-px bg-gradient-to-r from-white/40 to-transparent" />
                    </div>
                </motion.div>

                {/* Main Verdict Text */}
                <motion.h1
                    className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
                >
                    {getStatusTranslation(status, supportedLanguage)}
                </motion.h1>

                {/* Confidence Score */}
                <motion.div
                    className="flex items-center gap-3 mt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                >
                    <div className="text-xs font-medium text-white/80">
                        Confidence: {confidence}%
                    </div>
                    <div className="flex-1 max-w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white/80 rounded-full"
                            initial={{ width: 0 }}
                            animate={isInView ? { width: `${confidence}%` } : { width: 0 }}
                            transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
                        />
                    </div>
                </motion.div>
            </div>

            {/* Status Badge */}
            <motion.div
                className="flex-shrink-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 1, duration: 0.6 }}
            >
                <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${colors.badgeClasses} backdrop-blur-sm border shadow-lg`}>
                    {getStatusTranslation(status, supportedLanguage)}
                </div>
            </motion.div>
        </div>
    );
}

export default ResultOverviewHeaderContent;