import { CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

type Props ={ 
    themeColors: {
        pendingBackground: string;
        pendingBorder: string;
        pendingAccent: string;
        emptyText: string;
        emptySubtext: string;
    };
    currentTimestamp: {
        startTime: number;
        endTime: number;
        statement: string;
    };
}

const FactCheckOverlayPending = ({themeColors, currentTimestamp}: Props) => {
    return <motion.div
        className="w-full h-full flex flex-col backdrop-blur-xl rounded-xl border"
        style={{
            background: themeColors.pendingBackground,
            borderColor: themeColors.pendingBorder
        }}
        layout
    >
        <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4" style={{ color: themeColors.pendingAccent }} />
                <span className="text-sm font-mono" style={{ color: themeColors.emptySubtext }}>
                    {Math.floor(currentTimestamp.startTime / 60)}:{(currentTimestamp.startTime % 60).toString().padStart(2, '0')} -
                    {Math.floor(currentTimestamp.endTime / 60)}:{(currentTimestamp.endTime % 60).toString().padStart(2, '0')}
                </span>
            </div>
            <CardTitle className="text-lg" style={{ color: themeColors.emptyText }}>
                Current Statement
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
            <p className="text-sm leading-relaxed" style={{ color: themeColors.emptyText }}>
                "{currentTimestamp.statement}"
            </p>
            <Badge
                variant="outline"
                className="inline-flex items-center gap-1"
                style={{
                    backgroundColor: `${themeColors.pendingAccent}20`,
                    color: themeColors.pendingAccent,
                    borderColor: `${themeColors.pendingAccent}40`
                }}
            >
                <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: themeColors.pendingAccent }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />
                Fact-check in progress...
            </Badge>
        </CardContent>
    </motion.div>
}

export default FactCheckOverlayPending;