import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/app/components/ui/card';
import { useResearchTranslations } from '@/app/hooks/useSmartTranslations';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { mapExpertToProfile } from '../utils/statusConfig';
import { EXPERT_PROFILES } from '@/app/constants/experts';
import { Badge } from '../../ui/badge';
import { LLMResearchResponse } from '@/app/types/research';

type Props = {
    activeExpert: string | null;
    expertData: LLMResearchResponse['expert_perspectives'];
}

const FactCheckExpertActive = ({activeExpert, expertData}: Props) => {
    const { isDark } = useLayoutTheme();
    const { t: tr } = useResearchTranslations();
    if (!expertData) return 
    return <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
            {activeExpert !== null && expertData[parseInt(activeExpert)] && (
                <motion.div
                    key={activeExpert}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                >
                    <Card className="h-full">
                        <CardContent className="p-4 h-full flex flex-col">
                            {(() => {
                                const perspective = expertData[parseInt(activeExpert)];
                                const profileKey = mapExpertToProfile(perspective.expert_name, perspective.expertise_area);
                                const profile = EXPERT_PROFILES[profileKey];

                                return (
                                    <>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ background: profile.color }}
                                            />
                                            <span className="text-sm font-semibold">{perspective.expert_name}</span>
                                            <Badge variant="outline" className="text-xs">
                                                {perspective.expertise_area}
                                            </Badge>
                                        </div>

                                        <div className="flex-1 overflow-auto">
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-xs text-muted-foreground mb-1">
                                                        {tr('analysis', 'Analysis')}
                                                    </p>
                                                    <p className="text-sm leading-relaxed">{perspective.reasoning}</p>
                                                </div>

                                                {perspective.summary && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-1">
                                                            {tr('summary', 'Summary')}
                                                        </p>
                                                        <p className="text-sm leading-relaxed">{perspective.summary}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((level) => (
                                                    <div
                                                        key={level}
                                                        className="w-2 h-2 rounded-full"
                                                        style={{
                                                            background: level <= Math.floor(perspective.confidence_level / 20)
                                                                ? profile.color
                                                                : isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.8)'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {perspective.confidence_level}% {tr('confidence_text', 'confidence')}
                                            </span>
                                        </div>
                                    </>
                                );
                            })()}
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
}

export default FactCheckExpertActive;