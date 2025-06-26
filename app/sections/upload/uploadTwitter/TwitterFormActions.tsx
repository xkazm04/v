import { contentVariants } from '@/app/components/animations/variants/placeholderVariants';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import AnalyzeButton from '@/app/components/ui/Buttons/AnalyzeButton';
import { TwitterAnalysisRequest, PredefinedTweet } from '@/app/types/research';
type Props = {
    mode: 'url' | 'predefined';
    formData: TwitterAnalysisRequest;
    selectedTweet: PredefinedTweet | null; 
    resetForm: () => void;
    onSubmit: () => Promise<void>;
    isLoading: boolean;
    hasValidData: boolean;
}

const TwitterFormActions = ({ 
    mode, 
    formData, 
    selectedTweet, 
    resetForm, 
    onSubmit,
    isLoading,
    hasValidData 
}: Props) => {
    const { colors, isDark } = useLayoutTheme();

    const handleSubmit = async () => {
        try {
            await onSubmit();
        } catch (error) {
            console.error('Failed to submit:', error);
        }
    };
    const isDisabled = isLoading || !hasValidData;

    return (
        <motion.div
            variants={contentVariants}
            className="flex flex-col sm:flex-row gap-3"
        >
            <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={isDisabled}
                className="flex-1 h-12 sm:h-14 rounded-xl font-semibold text-base transition-all duration-300 relative overflow-hidden group border-0 flex items-center justify-center gap-2 sm:gap-3"
                style={{
                    background: isDisabled
                        ? isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.5)'
                        : `linear-gradient(135deg, 
                          rgba(29, 161, 242, 0.9) 0%,
                          rgba(56, 189, 248, 0.9) 50%,
                          rgba(14, 165, 233, 0.9) 100%
                        )`,
                    color: isDisabled
                        ? colors.mutedForeground
                        : 'white',
                    cursor: isDisabled
                        ? 'not-allowed'
                        : 'pointer'
                }}
                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
            >
                <AnalyzeButton isLoading={isLoading} />
            </motion.button>

            {(isLoading || formData.tweet_url || selectedTweet) && (
                <motion.button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 h-12 sm:h-14 rounded-xl border-2 font-medium transition-all duration-300 flex items-center justify-center gap-2"
                    style={{
                        borderColor: isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.5)',
                        background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                        color: colors.foreground
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <RotateCcw className="h-4 w-4" />
                    <span className="hidden sm:inline">Reset</span>
                </motion.button>
            )}
        </motion.div>
    );
};

export default TwitterFormActions;