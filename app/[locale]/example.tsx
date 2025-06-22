import NewsCardSpeaker from "@/app/components/news/NewsCardSpeaker";
import { FloatingVerdictIcon } from "@/app/components/ui/Decorative/FloatingVerdictIcon";
import { Divider } from "@/app/components/ui/divider";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { useSmartTranslation } from "@/app/hooks/useSmartTranslation";
import { motion, Variants } from "framer-motion";
import { useTranslations } from 'next-intl';

type Props = {
  config: {
    color: string;
    icon: React.ComponentType<any>;
    label: string;
  };
  currentTheme: 'light' | 'dark';
  textColors: {
    primary: string;
    secondary: string;
    tertiary: string;
    border: string;
  };
  mockStatement: {
    impact_score: number;
    text: string;
    verdict: string;
    source: string;
  };
}

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const FeedHeaderContent = ({ config, currentTheme, textColors, mockStatement }: Props) => {
  const { colors } = useLayoutTheme();
  const t = useTranslations();

  // ✅ Static translation for UI text
  const titleTranslation = useSmartTranslation({
    staticKey: 'feed.statementOfTheDay',
    fallbackText: 'Statement of the Day'
  });

  // ✅ Dynamic translation for statement content
  const statementTranslation = useSmartTranslation({
    dynamicText: mockStatement.text,
    fallbackText: mockStatement.text,
    context: 'news',
    enableDynamic: true
  });

  // ✅ Dynamic translation for verdict content
  const verdictTranslation = useSmartTranslation({
    dynamicText: mockStatement.verdict,
    fallbackText: mockStatement.verdict,
    context: 'news',
    enableDynamic: true
  });

  return (
    <>
      <div className="relative z-10 p-8 h-full flex flex-col">
        {/* Header with App Branding */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-6">
            {/* Enhanced Floating Verdict Icon */}
            <div className="relative">
              <FloatingVerdictIcon
                size="md"
                confidence={mockStatement.impact_score}
                showConfidenceRing={true}
                delay={0}
                colors={{
                  glowColor: config.color,
                  backgroundColor: currentTheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'
                }}
                className="transition-all duration-300 hover:scale-110"
              />
            </div>
            
            <div>
              {/* ✅ Static translation with loading state */}
              <h1 className={`text-2xl font-bold ${textColors.primary} mb-1 flex items-center gap-2`}>
                {titleTranslation.text}
                {titleTranslation.isLoading && (
                  <motion.div
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </h1>
              <div className={`flex items-center gap-2 ${textColors.tertiary} text-sm`}>
                {mockStatement.source}
                {/* Translation indicator */}
                {(statementTranslation.isDynamic || verdictTranslation.isDynamic) && (
                  <span className="flex items-center gap-1 text-xs opacity-60">
                    🌐 <span>{titleTranslation.locale.toUpperCase()}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Statement */}
        <motion.div 
          variants={itemVariants}
          className="flex-1 flex flex-col justify-center"
        >
          {/* Statement Text with dynamic translation */}
          <motion.blockquote
            className={`text-xl md:text-2xl font-semibold ${textColors.primary} leading-relaxed mb-4 relative`}
            style={{
              textShadow: currentTheme === 'light' 
                ? "0 1px 2px rgba(0,0,0,0.1)" 
                : "0 2px 4px rgba(0,0,0,0.3)"
            }}
          >
            "{statementTranslation.text}"
            {/* Loading indicator for statement */}
            {statementTranslation.isLoading && (
              <motion.div
                className="absolute -right-8 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            )}
          </motion.blockquote>
          
          {/* Quick Verdict with enhanced styling and dynamic translation */}
          <motion.div className="relative pl-1.5">
            <motion.p
              className={`${textColors.secondary} font-serif leading-relaxed max-w-3xl px-2 relative z-10 flex items-center gap-2`}
              style={{ background: `${colors.background}80`, fontSize: '1.1rem' }}
            >
              {verdictTranslation.text}
              {/* Loading indicator for verdict */}
              {verdictTranslation.isLoading && (
                <motion.div
                  className="w-4 h-4 border-2 border-current border-t-transparent rounded-full flex-shrink-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.p>
            
            {/* Verdict accent line */}
            <motion.div
              className="absolute left-0 top-0 w-0.5 h-full rounded-full"
              style={{ backgroundColor: config.color }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '100%', opacity: 0.7 }}
              transition={{ delay: 1, duration: 0.8 }}
            />
          </motion.div>
        </motion.div>
        
        <Divider />

        {/* Enhanced Footer */}
        <motion.div 
          variants={itemVariants}
          className={`flex items-center justify-between pt-6`}
        >
          <motion.div 
            className={`${textColors.tertiary} text-sm flex items-center gap-2`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <NewsCardSpeaker research={mockStatement} />
          </motion.div>

          {/* Translation Status Footer */}
          {(statementTranslation.isDynamic || verdictTranslation.isDynamic || statementTranslation.isLoading || verdictTranslation.isLoading) && (
            <motion.div
              className={`${textColors.tertiary} text-xs flex items-center gap-2 opacity-60`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: 2, duration: 0.5 }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-green-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              {statementTranslation.isLoading || verdictTranslation.isLoading 
                ? t('common.loading')
                : `Translated to ${titleTranslation.locale.toUpperCase()}`
              }
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default FeedHeaderContent;