import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { CardHeader, CardTitle } from '../../components/ui/card';
import { motion } from 'framer-motion';
import LogoCard from '@/app/components/ui/Decorative/LogoCard';

const ResearchFormHeader = () => {
    const { colors, isDark } = useLayoutTheme();
    const currentTheme = isDark ? 'dark' : 'light';
    return <CardHeader
        className="pb-8 pt-8 px-8"
        style={{
            background: isDark
                ? `linear-gradient(135deg, 
                  rgba(59, 130, 246, 0.1) 0%,
                  rgba(147, 51, 234, 0.1) 100%
                )`
                : `linear-gradient(135deg, 
                  rgba(59, 130, 246, 0.05) 0%,
                  rgba(147, 51, 234, 0.05) 100%
                )`,
            borderBottom: `1px solid ${isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.5)'}`
        }}
    >
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className='flex flex-row'
        >
            <CardTitle className="flex items-center gap-3 text-3xl font-bold">
                <div
                    className="p-3 rounded-xl"
                    style={{
                        background: isDark
                            ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)'
                            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
                        border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`
                    }}
                >
                    <LogoCard
                        currentTheme={currentTheme}
                        //@ts-expect-error Ignore
                        config={{}}
                    />
                </div>
                <span style={{ color: colors.foreground }}>
                    Fact-Check
                </span>
                <p
                    className="text-lg mt-3 font-medium"
                    style={{ color: colors.mutedForeground }}
                >
                    Analyze statements for accuracy and credibility
                </p>
            </CardTitle>

        </motion.div>
    </CardHeader>
}

export default ResearchFormHeader;