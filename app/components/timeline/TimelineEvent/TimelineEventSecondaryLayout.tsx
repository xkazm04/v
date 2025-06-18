import { motion, AnimatePresence } from 'framer-motion';
import ExpertOpinionCard from '../../../components/timeline/ExpertOpinionCard/ExpertOpinionCard';
import { useViewport } from '@/app/hooks/useViewport';
import { getSecondaryOpinionPositions } from '@/app/config/timelineEventPositions';
import { EventType } from '@/app/types/timeline';

type Props = {
    isActive: boolean;
    event: EventType;
    eventIndex: number;
}

const TimelineEventSecondaryLayout = ({ 
    isActive, 
    event, 
    eventIndex
}: Props) => {
    const { isMobile, isTablet, isDesktop } = useViewport();
    const leftOpinions = event.all_opinions.filter(op => op.isLeft);
    const rightOpinions = event.all_opinions.filter(op => !op.isLeft);
    const allSecondaryOpinions = [...leftOpinions, ...rightOpinions];

    // Enhanced debug logging
    console.log('TimelineEventSecondaryLayout render:', { 
        eventId: event.id, 
        allSecondaryOpinions: allSecondaryOpinions.length,
        leftOpinions: leftOpinions.length,
        rightOpinions: rightOpinions.length,
        isDesktop,
        isTablet,
        isMobile
    });

    const secondaryPositions = getSecondaryOpinionPositions(allSecondaryOpinions, isDesktop, isTablet);
    
    const getPositionsByRow = () => {
        const grouped = {
            top: secondaryPositions.filter(p => p.position.row === "top"),
            middle: secondaryPositions.filter(p => p.position.row === "middle"),
            bottom: secondaryPositions.filter(p => p.position.row === "bottom")
        };
        
        return grouped;
    };

    const positionsByRow = getPositionsByRow();

    return (
        <div className="w-full">
            {isDesktop && (
                <div className="relative w-full max-w-6xl mx-auto">
                    {/* Top Row */}
                    {positionsByRow.top.length > 0 && (
                        <motion.div
                            className="flex items-center justify-center gap-6 mb-8 w-full"
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <AnimatePresence>
                                {positionsByRow.top.map(({ opinion, position, index }) => {
                                    console.log(`Rendering top row card ${index}:`, { opinion: opinion.id, side: position.side });
                                    return (
                                        <motion.div
                                            key={`${opinion.id}-${index}`}
                                            className="w-72 flex-shrink-0"
                                            initial={{
                                                opacity: 0,
                                                scale: 0.8,
                                                y: -50
                                            }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                                y: 0
                                            }}
                                            exit={{
                                                opacity: 0,
                                                scale: 0.8,
                                                y: -50
                                            }}
                                            transition={{
                                                delay: index * 0.1,
                                                duration: 0.6,
                                                type: "spring",
                                                stiffness: 100,
                                                damping: 20
                                            }}
                                        >
                                            <ExpertOpinionCard
                                                opinion={opinion.opinion}
                                                expertType={opinion.expert_type}
                                                side={position.side}
                                                isStrongest={false}
                                                isActive={isActive}
                                                isExpanded={true}
                                                index={index}
                                                isSecondaryLayout={true}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Middle Row - Side opinions only (fact card is handled by parent) */}
                    <motion.div
                        className="flex items-center justify-center gap-16 mb-8 w-full"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    >
                        {/* Left side opinion */}
                        {positionsByRow.middle.find(p => p.position.column === "left") && (
                            <motion.div
                                className="w-72 flex-shrink-0"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                            >
                                {(() => {
                                    const leftMiddle = positionsByRow.middle.find(p => p.position.column === "left");
                                    return (
                                        <ExpertOpinionCard
                                            opinion={leftMiddle!.opinion.opinion}
                                            expertType={leftMiddle!.opinion.expert_type}
                                            side="left"
                                            isStrongest={false}
                                            isActive={isActive}
                                            isExpanded={true}
                                            index={leftMiddle!.index}
                                            isSecondaryLayout={true}
                                        />
                                    );
                                })()}
                            </motion.div>
                        )}

                        {/* Center spacer for fact card (handled by parent) */}
                        <div className="w-80 flex-shrink-0" />

                        {/* Right side opinion */}
                        {positionsByRow.middle.find(p => p.position.column === "right") && (
                            <motion.div
                                className="w-72 flex-shrink-0"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                            >
                                {(() => {
                                    const rightMiddle = positionsByRow.middle.find(p => p.position.column === "right");
                                    return (
                                        <ExpertOpinionCard
                                            opinion={rightMiddle!.opinion.opinion}
                                            expertType={rightMiddle!.opinion.expert_type}
                                            side="right"
                                            isStrongest={false}
                                            isActive={isActive}
                                            isExpanded={true}
                                            index={rightMiddle!.index}
                                            isSecondaryLayout={true}
                                        />
                                    );
                                })()}
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Bottom Row */}
                    {positionsByRow.bottom.length > 0 && (
                        <motion.div
                            className="flex items-center justify-center gap-6 w-full"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                        >
                            <AnimatePresence>
                                {positionsByRow.bottom.map(({ opinion, position, index }) => {
                                    console.log(`Rendering bottom row card ${index}:`, { opinion: opinion.id, side: position.side });
                                    return (
                                        <motion.div
                                            key={`${opinion.id}-${index}`}
                                            className="w-72 flex-shrink-0"
                                            initial={{
                                                opacity: 0,
                                                scale: 0.8,
                                                y: 50
                                            }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                                y: 0
                                            }}
                                            exit={{
                                                opacity: 0,
                                                scale: 0.8,
                                                y: 50
                                            }}
                                            transition={{
                                                delay: (index + 4) * 0.1,
                                                duration: 0.6,
                                                type: "spring",
                                                stiffness: 100,
                                                damping: 20
                                            }}
                                        >
                                            <ExpertOpinionCard
                                                opinion={opinion.opinion}
                                                expertType={opinion.expert_type}
                                                side={position.side}
                                                isStrongest={false}
                                                isActive={isActive}
                                                isExpanded={true}
                                                index={index}
                                                isSecondaryLayout={true}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            )}

            {/* Tablet & Mobile: Grid layout for secondary opinions only */}
            {(isTablet || isMobile) && (
                <div className="w-full mt-8">
                    {/* Secondary opinions grid */}
                    <div className={`${isTablet ? 'grid grid-cols-2 gap-4' : 'space-y-4'}`}>
                        <AnimatePresence>
                            {allSecondaryOpinions.slice(0, 6).map((opinion, index) => {
                                console.log(`Rendering tablet/mobile card ${index}:`, { opinion: opinion.id, side: opinion.isLeft ? 'left' : 'right' });
                                return (
                                    <motion.div
                                        key={`${opinion.id}-${index}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{
                                            delay: index * 0.08,
                                            duration: 0.4,
                                            type: "spring",
                                            stiffness: 100
                                        }}
                                    >
                                        <ExpertOpinionCard
                                            opinion={opinion.opinion}
                                            expertType={opinion.expert_type}
                                            side={opinion.isLeft ? 'left' : 'right'}
                                            isStrongest={false}
                                            isActive={isActive}
                                            isExpanded={true}
                                            index={index}
                                            isSecondaryLayout={true}
                                        />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TimelineEventSecondaryLayout;