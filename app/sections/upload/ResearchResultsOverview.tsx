import { motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import ResultOverviewContent from './Result/ResultOverviewContent';
import ResultOverviewMetadata from './Result/ResultOverviewMetadata';
import ResultOverviewHeader from './Result/ResultOverviewHeader';
import { LLMResearchResponse } from '@/app/types/research';
import StampText from '@/app/components/ui/Decorative/StampText';
import { getStatusTranslation } from '@/app/helpers/factCheck';

type Props = {
    isLoading: boolean;
    displayResult: LLMResearchResponse
}

const config = {
  color: '#3B82F6', 
  bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
  stampOpacity: '0.1'
};


const ResearchResultsOverview = ({ isLoading, displayResult }: Props) => {
    const { colors, isDark } = useLayoutTheme();
    return (
        <div className="space-y-6">
            {/* Main Content Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                className="rounded-3xl border-2 overflow-hidden shadow-xl"
                style={{
                    background: isDark
                        ? `linear-gradient(135deg, 
                            rgba(15, 23, 42, 0.95) 0%,
                            rgba(30, 41, 59, 0.98) 50%,
                            rgba(51, 65, 85, 0.95) 100%
                          )`
                        : `linear-gradient(135deg, 
                            rgba(255, 255, 255, 0.95) 0%,
                            rgba(248, 250, 252, 0.98) 50%,
                            rgba(241, 245, 249, 0.95) 100%
                          )`,
                    border: `2px solid ${isDark ? colors.border : 'rgba(226, 232, 240, 0.6)'}`,
                    boxShadow: isDark
                        ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        : '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
                }}
            >
                {/* Verdict Header */}
                <ResultOverviewHeader
                    isLoading={isLoading}
                    displayResult={displayResult}
                />

                <StampText
                    config={config}
                    stampText={getStatusTranslation(displayResult.status)}
                />

                {/* Content Sections */}
                <ResultOverviewContent
                    isLoading={isLoading}
                    displayResult={displayResult}
                />
            </motion.div>

            <ResultOverviewMetadata
                displayResult={displayResult}
            />
        </div>
    );
}

export default ResearchResultsOverview;