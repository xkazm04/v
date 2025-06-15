import { motion } from "framer-motion"
import { Clock } from "lucide-react"

type Props = {
    themeColors: {
        emptyBackground: string;
        emptyBorder: string;
        emptyText: string;
        emptySubtext: string;
    };
}

const FactCheckOverlayEmpty = ({themeColors}: Props) => {
    return <motion.div
        key="empty-state"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex flex-col items-center justify-center p-6 h-full"
    >
        <motion.div
            className="text-center backdrop-blur-sm rounded-2xl p-8 border h-full flex flex-col justify-center"
            style={{
                background: themeColors.emptyBackground,
                borderColor: themeColors.emptyBorder
            }}
            animate={{
                scale: [1, 1.02, 1],
            }}
            transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
            }}
        >
            <motion.div
                animate={{
                    rotateZ: [0, 360],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear'
                }}
            >
                <Clock className="w-16 h-16 mx-auto mb-4 opacity-40" style={{ color: themeColors.emptyText }} />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: themeColors.emptyText }}>
                No Active Statement
            </h3>
            <p className="text-sm max-w-sm" style={{ color: themeColors.emptySubtext }}>
                Fact-checks will appear here when statements are detected during video playback
            </p>

        </motion.div>
    </motion.div>
}

export default FactCheckOverlayEmpty;