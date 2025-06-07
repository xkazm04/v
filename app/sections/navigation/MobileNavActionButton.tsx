import { fabVariants } from '@/app/components/animations/variants/mobileNavVariants';
import { Plus, Sparkles,  } from 'lucide-react';
import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';

type Props = {
    router: any; // Adjust type as needed
    navColors: {
        fabShadow: string;
    };
}

const MobileNavActionButton = ({ router,navColors }: Props) => {
    const [fabPressed, setFabPressed] = useState(false);
    const { colors } = useLayoutTheme();
    const handleFabPress = useCallback(() => {
        setFabPressed(true);

        if ('vibrate' in navigator) {
            navigator.vibrate(15);
        }

        router.push('/upload');

        setTimeout(() => setFabPressed(false), 200);
    }, [router]);
    return <>
        <motion.button
            variants={fabVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            whileHover="hover"
            whileTap="tap"
            onTouchStart={() => setFabPressed(true)}
            onTouchEnd={() => setFabPressed(false)}
            onClick={handleFabPress}
            className="absolute -top-8 right-5 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden"
            style={{
                backgroundColor: colors.primary,
                color: 'white',
                boxShadow: navColors.fabShadow
            }}
            aria-label="Create new content"
        >
            {/* FAB background gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)`
                }}
            />

            {/* FAB press effect */}
            <AnimatePresence>
                {fabPressed && (
                    <motion.div
                        className="absolute inset-0 bg-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.2 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                    />
                )}
            </AnimatePresence>

            {/* FAB icon with sparkle effect */}
            <motion.div
                className="relative z-10 flex items-center justify-center"
                animate={{
                    rotate: fabPressed ? 45 : 0
                }}
                transition={{ duration: 0.2 }}
            >
                <Plus className="h-6 w-6" strokeWidth={2.5} />

                {/* Sparkle indicator for new content */}
                <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                >
                    <Sparkles className="h-3 w-3" />
                </motion.div>
            </motion.div>

            {/* FAB ripple effect */}
            <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-white"
                animate={{
                    scale: fabPressed ? [1, 1.5] : 1,
                    opacity: fabPressed ? [0.5, 0] : 0
                }}
                transition={{ duration: 0.3 }}
            />
        </motion.button>
    </>
}

export default MobileNavActionButton;