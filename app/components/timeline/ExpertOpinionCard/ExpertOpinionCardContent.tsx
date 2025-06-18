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
        className="rounded-lg border mb-4"
        style={{
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(248, 250, 252, 0.6)',
            borderColor: expertConfig.color + '30'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
    >
        <div className={`p-3 ${isMobile ? 'p-2.5' : 'p-3'}`}>
            <div className="relative">
                <Quote
                    className={`absolute -left-1 -top-1 opacity-40 ${isMobile || isSecondaryLayout ? 'w-3 h-3' : 'w-4 h-4'
                        }`}
                    style={{ color: expertConfig.color }}
                />
                <p
                    className={`leading-relaxed pl-4 text-left ${
                        isMobile ? 'text-xs' :
                        isSecondaryLayout ? 'text-sm' :
                            isTablet ? 'text-sm' : 'text-sm'
                        }`}
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