import { motion, AnimatePresence } from 'framer-motion';
import ExpertOpinionCard from '../../../components/timeline/ExpertOpinionCard/ExpertOpinionCard';
import { useViewport } from '@/app/hooks/useViewport';
import { getSecondaryOpinionPositions } from '@/app/config/timelineEventPositions';
import TimelineEventFactCard from './TimelineEventFactCard';
import { EventType } from '../data/timeline';

type Props = {
    gridConfig: {
        container: string;
    };
    isActive: boolean;
    event: EventType;
    showAllOpinions: boolean;
    setShowAllOpinions: (value: boolean) => void;
}
const TimelineEventSecondaryLayout = ({ gridConfig, isActive, event, showAllOpinions, setShowAllOpinions }: Props) => {
    const { isMobile, isTablet, isDesktop } = useViewport();
    const leftOpinions = event.all_opinions.filter(op => op.isLeft);
    const rightOpinions = event.all_opinions.filter(op => !op.isLeft);
    const allSecondaryOpinions = [...leftOpinions, ...rightOpinions];


    const secondaryPositions = getSecondaryOpinionPositions(allSecondaryOpinions, isTablet, isDesktop);
    const getPositionsByRow = () => {
        const grouped = {
            top: secondaryPositions.filter(p => p.position.row === "top"),
            middle: secondaryPositions.filter(p => p.position.row === "middle"),
            bottom: secondaryPositions.filter(p => p.position.row === "bottom")
        };
        return grouped;
    };

    const positionsByRow = getPositionsByRow();

    return <div className={gridConfig.container}>

        {/* Desktop: Organized Row Layout */}
        {isDesktop && (
            <div className="relative flex flex-col items-center justify-center">
                {/* Top Row - 2 opinions */}
                {positionsByRow.top.length > 0 && (
                    <motion.div
                        className="flex items-center justify-center gap-8 mb-6"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <AnimatePresence>
                            {positionsByRow.top.map(({ opinion, position, index }) => (
                                <motion.div
                                    key={`${opinion.id}-${index}`}
                                    className={position.className}
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
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* Middle Row - Central fact + side opinions */}
                <motion.div
                    className="flex items-center justify-center gap-12 mb-6"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                    {/* Left side opinion */}
                    {positionsByRow.middle.find(p => p.position.column === "left") && (
                        <motion.div
                            className="w-80"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                        >
                            <ExpertOpinionCard
                                opinion={positionsByRow.middle.find(p => p.position.column === "left")!.opinion.opinion}
                                expertType={positionsByRow.middle.find(p => p.position.column === "left")!.opinion.expert_type}
                                side="left"
                                isStrongest={false}
                                isActive={isActive}
                                isExpanded={true}
                                index={positionsByRow.middle.find(p => p.position.column === "left")!.index}
                                isSecondaryLayout={true}
                            />
                        </motion.div>
                    )}

                    <TimelineEventFactCard
                        isActive={isActive}
                        showAllOpinions={showAllOpinions}
                        setShowAllOpinions={setShowAllOpinions}
                        event={event}
                        eventIndex={0}
                        />

                    {/* Right side opinion */}
                    {positionsByRow.middle.find(p => p.position.column === "right") && (
                        <motion.div
                            className="w-80"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                        >
                            <ExpertOpinionCard
                                opinion={positionsByRow.middle.find(p => p.position.column === "right")!.opinion.opinion}
                                expertType={positionsByRow.middle.find(p => p.position.column === "right")!.opinion.expert_type}
                                side="right"
                                isStrongest={false}
                                isActive={isActive}
                                isExpanded={true}
                                index={positionsByRow.middle.find(p => p.position.column === "right")!.index}
                                isSecondaryLayout={true}
                            />
                        </motion.div>
                    )}
                </motion.div>

                {/* Bottom Row - 2 opinions */}
                {positionsByRow.bottom.length > 0 && (
                    <motion.div
                        className="flex items-center justify-center gap-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                    >
                        <AnimatePresence>
                            {positionsByRow.bottom.map(({ opinion, position, index }) => (
                                <motion.div
                                    key={`${opinion.id}-${index}`}
                                    className={position.className}
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
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        )}

        {/* Tablet & Mobile: Grid layout for secondary opinions */}
        {(isTablet || isMobile) && (
            <>
                {/* Central fact first on tablet/mobile */}
                <div className={`${isTablet ? 'col-span-2 order-first mb-8' : 'mb-8'
                    }`}>
                    <TimelineEventFactCard 
                        isActive={isActive}
                        showAllOpinions={showAllOpinions}
                        setShowAllOpinions={setShowAllOpinions}
                        event={event}
                        eventIndex={0}
                        />
                </div>

                {/* Secondary opinions grid */}
                <div className={`${isTablet ? 'col-span-2 grid grid-cols-2 gap-4' : 'space-y-4'
                    }`}>
                    <AnimatePresence>
                        {allSecondaryOpinions.slice(0, 6).map((opinion, index) => (
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
                        ))}
                    </AnimatePresence>
                </div>
            </>
        )}
    </div>
}

export default TimelineEventSecondaryLayout;