import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { useResearchTranslations, useCommonTranslations } from "@/app/hooks/useSmartTranslations";
import { motion } from "framer-motion";
import { GlassContainer } from "../ui/containers/GlassContainer";
import { AlertCircle } from "lucide-react";
import { itemVariants } from "../animations/variants/votingVariants";

type Props = {
    fetchProfiles: () => void;
    error: string;
}

const ProfilesError = ({fetchProfiles, error}: Props) => {
    const { colors, isDark, vintage } = useLayoutTheme();
    const { t: tr } = useResearchTranslations();
    const { t: tc } = useCommonTranslations();
    
    return <motion.div
        variants={itemVariants}
        className="flex items-center justify-center py-16"
    >
        <GlassContainer
            style={isDark ? 'crystal' : 'subtle'}
            border="visible"
            rounded="xl"
            className="p-6 max-w-md"
        >
            <div className="flex items-center gap-3 text-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <div>
                    <h3
                        className="font-semibold mb-1"
                        style={{
                            color: isDark ? colors.foreground : vintage.ink,
                            fontFamily: '"Playfair Display", serif'
                        }}
                    >
                        {tr('error_loading_profiles', 'Error Loading Profiles')}
                    </h3>
                    <p
                        className="text-sm"
                        style={{
                            color: isDark ? colors.mutedForeground : vintage.faded,
                            fontFamily: '"Crimson Text", serif'
                        }}
                    >
                        {error}
                    </p>
                    <motion.button
                        onClick={() => fetchProfiles()}
                        className="mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                        style={{
                            background: isDark ? colors.primary : '#b8860b',
                            color: 'white'
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {tc('tryAgain', 'Try Again')}
                    </motion.button>
                </div>
            </div>
        </GlassContainer>
    </motion.div>
}

export default ProfilesError;