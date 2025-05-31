import { motion } from "framer-motion"
import { Eye, Shield, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import PlayerTimelineRow from "./PlayerTimelineRow";

type Props = {
    factCheck: {
        truthPercentage: number;
        confidence: number;
        sources: number;
    };
    mockTimelineData: {
        timestamp: number;
        claim: string;
        type: 'truth' | 'neutral' | 'lie';
    }[];
    onSeekToTimestamp?: (timestamp: number) => void;
}

const PlayerTimelineExp = ({ factCheck, mockTimelineData, onSeekToTimestamp }: Props) => {
    return (
        <div className="h-full flex flex-col p-6">
            {/* Header with enhanced styling for overlay */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6 flex-shrink-0"
            >
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Clock className="h-6 w-6 text-blue-400" />
                        Fact-Check Timeline
                    </h2>
                    
                    <div className="flex gap-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400/30 min-w-[120px]"
                        >
                            <div className="text-2xl font-bold text-green-400">{factCheck.truthPercentage}%</div>
                            <div className="text-sm text-green-300 mt-1">Factual Content</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-400/30 min-w-[120px]"
                        >
                            <div className="text-2xl font-bold text-yellow-400">{factCheck.confidence}%</div>
                            <div className="text-sm text-yellow-300 mt-1">Confidence</div>
                        </motion.div>
                    </div>
                </div>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex gap-3"
                >
                    <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                        <Eye className="h-4 w-4 mr-2" />
                        View Sources
                    </Button>
                    <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                        <Shield className="h-4 w-4 mr-2" />
                        Report Issue
                    </Button>
                </motion.div>
            </motion.div>

            {/* Fact-check Claims - Enhanced for overlay viewing */}
            <div className="flex-1 flex flex-col min-h-0">
                <motion.h4 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-white font-medium text-lg mb-4 flex items-center gap-2 flex-shrink-0"
                >
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                    Key Points ({mockTimelineData.length})
                </motion.h4>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex-1 overflow-y-auto pr-2 custom-scrollbar"
                >
                    <div className="space-y-3">
                        {mockTimelineData.map((segment, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 + (index * 0.1) }}
                            >
                                <PlayerTimelineRow
                                    index={index}
                                    segment={segment}
                                    onSeekToTimestamp={onSeekToTimestamp}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default PlayerTimelineExp;