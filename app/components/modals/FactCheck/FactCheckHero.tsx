import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { LLMResearchResponse } from "@/app/types/research";
import { getCountryFlagSvg } from "@/app/helpers/countries"

type Props = {
    onClose: () => void;
    displayResult?: LLMResearchResponse;
}

const FactCheckHero = ({ onClose, displayResult }: Props) => {
    const { colors, isDark } = useLayoutTheme();
    const flagSvg = displayResult?.country ? getCountryFlagSvg(displayResult.country) : null;

    return (
        <div
            className="flex items-center justify-end relative py-3 sm:p-4 lg:p-6 border-b border-gray-300/20 bg-gradient-to-r"
            style={{
                background: isDark
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(51, 65, 85, 0.95) 100%)'
                    : 'linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.95) 100%)'
            }}
        >
            <div className="absolute left-4 top-6 w-[100px] h-[80px]">
                {flagSvg && (
                    <Image
                        src={flagSvg}
                        alt={`${displayResult?.country} flag`}
                        fill
                        style={{ objectFit: "contain" }}
                    />
                )}
            </div>

            <motion.button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 group flex-shrink-0"
                style={{
                    color: colors.mutedForeground,
                    backgroundColor: 'transparent',
                }}
                whileHover={{
                    scale: 1.05,
                    backgroundColor: colors.muted,
                    color: colors.foreground
                }}
                whileTap={{ scale: 0.95 }}
            >
                <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-200" />
            </motion.button>
        </div>
    );
}

export default FactCheckHero;