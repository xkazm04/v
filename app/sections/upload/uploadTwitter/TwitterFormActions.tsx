import { contentVariants } from '@/app/components/animations/variants/placeholderVariants';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useTwitterResearch } from '@/app/hooks/useTwitterResearch';
import { motion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import { TwitterAnalysisRequest } from './TwitterForm';

type Props = {
    mode: 'url' | 'predefined';
    xService: any; 
    formData: TwitterAnalysisRequest;
    selectedTweet: any; 
    resetForm: () => void;
    setError: (error: string) => void;
    setTouched: (touched: boolean) => void;
    validateUrl: (url: string) => string;
}
const TwitterFormActions = ({ mode, xService, formData, selectedTweet, resetForm, setError, setTouched, validateUrl }: Props) => {
    const { colors, isDark } = useLayoutTheme();
    const { researchTweet, isResearching } = useTwitterResearch();

    const startResearch = async () => {
        const currentUrl = mode === 'predefined' ? selectedTweet?.url : formData.tweet_url;

        if (!currentUrl) {
            setError(mode === 'predefined' ? 'Please select a tweet' : 'Twitter URL is required');
            setTouched(true);
            return;
        }

        if (mode === 'url') {
            const validationError = validateUrl(currentUrl);
            if (validationError) {
                setError(validationError);
                setTouched(true);
                return;
            }
        }

        try {
            const request: TwitterAnalysisRequest = {
                tweet_url: currentUrl,
                additional_context: formData.additional_context,
                country: formData.country
            };

            const result = await researchTweet(request);
            console.log('Research result:', result);
            alert(`Research completed!\nProcessing time: ${result.processing_time_seconds}s\nMethod: ${result.research_method}`);

        } catch (error) {
            console.error('Failed to research tweet:', error);
        }
    };

    return <motion.div
        variants={contentVariants}
        className="flex flex-col sm:flex-row gap-3"
    >
        <motion.button
            type="button"
            onClick={startResearch}
            disabled={isResearching || (mode === 'url' && (!formData.tweet_url.trim() || !xService.validateTwitterUrl(formData.tweet_url))) || (mode === 'predefined' && !selectedTweet)}
            className="flex-1 h-12 sm:h-14 rounded-xl font-semibold text-base transition-all duration-300 relative overflow-hidden group border-0 flex items-center justify-center gap-2 sm:gap-3"
            style={{
                background: isResearching || (mode === 'url' && (!formData.tweet_url.trim() || !xService.validateTwitterUrl(formData.tweet_url))) || (mode === 'predefined' && !selectedTweet)
                    ? isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.5)'
                    : `linear-gradient(135deg, 
                      rgba(29, 161, 242, 0.9) 0%,
                      rgba(56, 189, 248, 0.9) 50%,
                      rgba(14, 165, 233, 0.9) 100%
                    )`,
                color: isResearching || (mode === 'url' && (!formData.tweet_url.trim() || !xService.validateTwitterUrl(formData.tweet_url))) || (mode === 'predefined' && !selectedTweet)
                    ? colors.mutedForeground
                    : 'white',
                cursor: isResearching || (mode === 'url' && (!formData.tweet_url.trim() || !xService.validateTwitterUrl(formData.tweet_url))) || (mode === 'predefined' && !selectedTweet)
                    ? 'not-allowed'
                    : 'pointer'
            }}
            whileHover={!(isResearching || (mode === 'url' && (!formData.tweet_url.trim() || !xService.validateTwitterUrl(formData.tweet_url))) || (mode === 'predefined' && !selectedTweet)) ? { scale: 1.02 } : {}}
            whileTap={!(isResearching || (mode === 'url' && (!formData.tweet_url.trim() || !xService.validateTwitterUrl(formData.tweet_url))) || (mode === 'predefined' && !selectedTweet)) ? { scale: 0.98 } : {}}
        >
            {isResearching ? (
                <>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                        <Play className="h-5 w-5" />
                    </motion.div>
                    <span className="hidden sm:inline">Researching...</span>
                    <span className="sm:hidden">Researching...</span>
                </>
            ) : (
                <>
                    <Play className="h-5 w-5" />
                    <span className="hidden sm:inline">Research Tweet</span>
                    <span className="sm:hidden">Research</span>
                </>
            )}
        </motion.button>

        {(isResearching || formData.tweet_url || selectedTweet) && (
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
}

export default TwitterFormActions;