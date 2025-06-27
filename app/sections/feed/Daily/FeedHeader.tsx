"use client";

import { useMemo, Suspense, lazy } from "react";
import { useTheme } from "next-themes"; 
import { motion, Variants } from "framer-motion";
import { GlassContainer } from "@/app/components/ui/containers/GlassContainer";
import { statusColorConfig } from "@/app/constants/colors";
import { Daily } from "@/app/types/research";

const FeedHeaderContent = lazy(() => import("./FeedHeaderContent"));
const StampText = lazy(() => import("@/app/components/ui/Decorative/StampText"));

export type DailyProps = {
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
    accent: string;
    warning: string;
    border: string;
  };
  mockStatement: Daily
}

interface StatementOfDayProps {
  className?: string;
}

const mockStatement: Daily = {
  id: "statement-of-day",
  text: "There were weapons of mass destruction in Iraq that posed an imminent threat to the United States and its allies",
  verdict: "This statement was CONCLUSIVELY FALSE. No weapons of mass destruction were found in Iraq after the 2003 invasion, despite extensive searches by coalition forces and weapons inspectors.",
  status: "FALSE" as const,
  impact_score: 9.8,
  date: "2003-02-05T00:00:00.000Z", 
  dateDisplay: "February 5, 2003",
  speaker: "Colin Powell",
  speakerTitle: "U.S. Secretary of State",
  source: "United Nations Security Council",
  reach: "Global audience",
  venue: "UN Security Council Chamber",
  referenceUrl: "https://www.un.org/webcast/ga/58/statements/usaeng030205.htm",
  impactDescription: "This false claim directly led to the Iraq War, resulting in hundreds of thousands of casualties and destabilizing an entire region. The misinformation damaged international trust in U.S. intelligence and had profound geopolitical consequences that persist today.",
  tags: ["War", "Intelligence", "International Relations", "Middle East"]
};

const containerVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.98
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-6 p-8">
    <div className="flex items-start gap-6">
      <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      <div className="flex-1 space-y-3">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    </div>
    <div className="space-y-4">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-4/5"></div>
      <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
    </div>
  </div>
);

const FeedHeader = ({ className = "" }: StatementOfDayProps) => {
  const { theme } = useTheme();

  const currentTheme = useMemo(() => 
    theme === 'light' ? 'light' : 'dark', 
    [theme]
  );
  
  const config = useMemo(() => 
    //@ts-expect-error Ignore
    statusColorConfig[currentTheme][mockStatement.status], 
    [currentTheme]
  );

  const textColors = useMemo(() => ({
    primary: currentTheme === 'light' ? 'text-slate-900' : 'text-white',
    secondary: currentTheme === 'light' ? 'text-slate-700' : 'text-slate-100',
    tertiary: currentTheme === 'light' ? 'text-slate-600' : 'text-slate-300',
    accent: currentTheme === 'light' ? 'text-red-700' : 'text-red-400',
    border: currentTheme === 'light' ? 'border-slate-200/40' : 'border-white/10',
    warning: currentTheme === 'light' ? 'text-amber-700' : 'text-amber-400'
  }), [currentTheme]);

  return (
    <div className={`relative my-2 max-w-[1600px] ${className}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="h-full"
      >
        <GlassContainer
          style="crystal"
          border="glow"
          rounded="3xl"
          shadow="glow"
          theme={currentTheme}
          overlay={true}
          overlayOpacity={currentTheme === 'light' ? 0.12 : 0.06}
          className="h-full relative min-h-[500px] overflow-hidden"
        >
          {currentTheme === 'light' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <Suspense fallback={null}>
                <StampText 
                  stampText="DECLASSIFIED"
                  config={{
                    ...config,
                    label: "DECLASSIFIED",
                    stampOpacity: 0.85
                  }}
                />
              </Suspense>
            </div>
          )}

          <div className="relative z-10 h-full">
            <Suspense fallback={<LoadingSkeleton />}>
              <FeedHeaderContent
                config={config}
                currentTheme={currentTheme}
                textColors={textColors}
                mockStatement={mockStatement}
              />
            </Suspense>
          </div>
        </GlassContainer>
      </motion.div>
    </div>
  );
};

export default FeedHeader;