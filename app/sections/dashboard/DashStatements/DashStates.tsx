import { MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

type Props = {
    themeColors: {
        cardBackground: string;
        cardBorder: string;
        cardShadow: string;
        text: string;
        itemBackground: string;
        itemBorder: string;
        accent: string;
        mutedText: string;
        errorBg: string;
        errorBorder: string;
    };
}

export const DashLoading = ({themeColors}: Props) => {
    return <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border p-6 shadow-sm"
        style={{
            background: themeColors.cardBackground,
            borderColor: themeColors.cardBorder,
            boxShadow: themeColors.cardShadow
        }}
    >
        <h3 className="text-lg font-semibold mb-6" style={{ color: themeColors.text }}>
            Recent Activity
        </h3>

        <div className="space-y-4">
            {[1, 2, 3].map((index) => (
                <div
                    key={index}
                    className="animate-pulse rounded-lg p-4 border"
                    style={{
                        background: themeColors.itemBackground,
                        borderColor: themeColors.itemBorder
                    }}
                >
                    <div className="flex items-start gap-3">
                        <div className="w-4 h-4 bg-muted rounded mt-1" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4" />
                            <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="flex items-center justify-center mt-6 py-4">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: themeColors.accent }} />
            <span className="ml-2 text-sm" style={{ color: themeColors.mutedText }}>
                Loading statements...
            </span>
        </div>
    </motion.div>
}

export const DashError = ({themeColors}: Props) => {
    return <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border p-6 shadow-sm"
        style={{
            background: themeColors.cardBackground,
            borderColor: themeColors.cardBorder,
            boxShadow: themeColors.cardShadow
        }}
    >
        <h3 className="text-lg font-semibold mb-6" style={{ color: themeColors.text }}>
            Recent Activity
        </h3>

        <div
            className="rounded-lg p-6 border text-center"
            style={{
                background: themeColors.errorBg,
                borderColor: themeColors.errorBorder
            }}
        >
            <AlertCircle className="w-8 h-8 mx-auto mb-3 text-red-500" />
            <h4 className="font-semibold mb-2" style={{ color: themeColors.text }}>
                Failed to Load Statements
            </h4>
            <p className="text-sm" style={{ color: themeColors.mutedText }}>
                Unable to fetch data
            </p>
        </div>
    </motion.div>
}

export const DashEmpty = ({themeColors}: Props) => {
    return <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border p-6 shadow-sm"
        style={{
            background: themeColors.cardBackground,
            borderColor: themeColors.cardBorder,
            boxShadow: themeColors.cardShadow
        }}
    >
        <h3 className="text-lg font-semibold mb-6" style={{ color: themeColors.text }}>
            Recent Activity
        </h3>

        <div
            className="rounded-lg p-8 border text-center"
            style={{
                //@ts-expect-error Ignore
                background: themeColors.background,
                borderColor: themeColors.itemBorder
            }}
        >
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-40" style={{ color: themeColors.mutedText }} />
            <h4 className="font-semibold mb-2" style={{ color: themeColors.text }}>
                No Statements Yet
            </h4>
            <p className="text-sm" style={{ color: themeColors.mutedText }}>
                This profile doesn't have any analyzed statements yet.
            </p>
        </div>
    </motion.div>
}