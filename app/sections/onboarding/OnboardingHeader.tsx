import LogoCard from "@/app/components/ui/Decorative/LogoCard";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
    onSkip?: () => void;
    currentStep: number;
    steps: { title: string; subtitle: string }[];
    getBackgroundConfig: () => { color: string };
    preferences: { theme: string };
}

const OnboardingHeader = ({onSkip, currentStep, steps, getBackgroundConfig, preferences}: Props) => {
    return <>
        <div className="p-6 md:p-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <LogoCard
                        config={{
                            color: getBackgroundConfig().color,
                            icon: Sparkles,
                            label: 'Welcome'
                        }}
                        //@ts-expect-error Ignore
                        currentTheme={preferences.theme}
                    />
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Welcome to FactCheck
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Let's personalize your experience
                        </p>
                    </div>
                </div>

                {onSkip && (
                    <button
                        onClick={onSkip}
                        className="text-gray-500 p-2 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        Skip
                    </button>
                )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Step {currentStep + 1} of {steps.length}</span>
                    <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                        className="h-2 rounded-full"
                        style={{
                            background: `linear-gradient(90deg, ${getBackgroundConfig().color}, ${getBackgroundConfig().color}80)`
                        }}
                        initial={{ width: "0%" }}
                        animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
            </div>
        </div>
    </>
}

export default OnboardingHeader;