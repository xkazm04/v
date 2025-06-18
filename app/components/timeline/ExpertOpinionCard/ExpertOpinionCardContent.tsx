import { ExpertTimelineConfigType } from '@/app/constants/experts';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { useViewport } from '@/app/hooks/useViewport';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

type Props = {
    opinion: string;
    expertConfig: ExpertTimelineConfigType;
    isSecondaryLayout?: boolean;
}

const ExpertOpinionCardContent = ({opinion, expertConfig, isSecondaryLayout}: Props) => {
    const { isDark } = useLayoutTheme();
    const { isMobile, isTablet } = useViewport();
    return <motion.div
        className={`rounded-lg border mb-4 ${isSecondaryLayout ? 'text-center' : 'text-left' // Always left-align content text
            }`}
        style={{
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(248, 250, 252, 0.55)',
            borderColor: expertConfig.color + '30'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
    >
        <div className={`p-3 ${isMobile ? 'p-2.5' : 'p-3'}`}>
            <div className={`flex items-center gap-2 mb-2 ${isSecondaryLayout ? 'justify-center' : 'justify-start' // Always start for content
                }`}>
                <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: expertConfig.color }}
                />
                <span
                    className="text-xs font-semibold uppercase tracking-wide opacity-80"
                    style={{ color: expertConfig.color }}
                >
                    Analysis
                </span>
            </div>
            <div className="relative">
                <Quote
                    className={`absolute -left-1 -top-1 opacity-40 ${isMobile || isSecondaryLayout ? 'w-3 h-3' : 'w-4 h-4'
                        }`}
                    style={{ color: expertConfig.color }}
                />
                <p
                    className={`leading-relaxed pl-4 ${isMobile ? 'text-xs' :
                        isSecondaryLayout ? 'text-sm' :
                            isTablet ? 'text-sm' : 'text-sm'
                        } ${isSecondaryLayout ? 'text-center' : 'text-left'}`} // Content text alignment
                    style={{
                        color: isDark ? 'rgba(229, 231, 235, 0.95)' : 'rgba(55, 65, 81, 0.95)'
                    }}
                >
                    {opinion}
                </p>
            </div>
        </div>
    </motion.div>
}

export default ExpertOpinionCardContent;