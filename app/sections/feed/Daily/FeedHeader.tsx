"use client";

import { useState } from "react";
import { useTheme } from "next-themes"; 
import FeedHeaderContent from "./FeedHeaderContent";
import DynamicBackground from "@/app/components/ui/Decorative/DynamicBackground";
import { GlassContainer } from "@/app/components/ui/containers/GlassContainer";
import { statusColorConfig } from "@/app/constants/colors";
import StampText from "@/app/components/ui/Decorative/StampText";
import { containerVariants } from "@/app/components/animations/variants/mobileNavVariants";
import { Daily } from "@/app/types/research";

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
const mockStatement = {
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

const FeedHeader = ({ className = "" }: StatementOfDayProps) => {
    const { theme } = useTheme();
    const [isVisible, setIsVisible] = useState(false);
    const currentTheme = theme === 'light' ? 'light' : 'dark';
    const config = statusColorConfig[currentTheme][mockStatement.status];

    const textColors = {
        primary: currentTheme === 'light' ? 'text-slate-900' : 'text-white',
        secondary: currentTheme === 'light' ? 'text-slate-700' : 'text-slate-100',
        tertiary: currentTheme === 'light' ? 'text-slate-600' : 'text-slate-300',
        accent: currentTheme === 'light' ? 'text-red-700' : 'text-red-400',
        border: currentTheme === 'light' ? 'border-slate-200/40' : 'border-white/10',
        warning: currentTheme === 'light' ? 'text-amber-700' : 'text-amber-400'
    };

    return (
        <div className={`relative my-2 max-w-[1600px] ${className}`}>
            <div className="absolute inset-0 -z-10">
                <DynamicBackground
                    config={{
                        bgGradient: config.bgGradient,
                        color: config.color,
                        stampOpacity: config.stampOpacity
                    }}
                    currentTheme={currentTheme}
                    setIsVisible={setIsVisible}
                />
            </div>

            <GlassContainer
                variants={containerVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                style="frosted"
                border="glow"
                rounded="3xl"
                shadow="glow"
                theme={currentTheme}
                overlay={true}
                overlayOpacity={currentTheme === 'light' ? 0.12 : 0.06}
                className="h-full relative min-h-[500px]"
            >
                {currentTheme === 'light' && (
                    <StampText 
                        stampText="DECLASSIFIED"
                        config={{
                            ...config,
                            label: "DECLASSIFIED",
                            stampOpacity: 0.15
                        }}
                    />
                )}

                <FeedHeaderContent
                    config={config}
                    currentTheme={currentTheme}
                    textColors={textColors}
                    mockStatement={mockStatement}
                />
            </GlassContainer>
        </div>
    );
};

export default FeedHeader;