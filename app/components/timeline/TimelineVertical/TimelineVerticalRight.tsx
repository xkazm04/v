'use client';
import { motion, MotionValue } from 'framer-motion';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';

interface TimelineVerticalRightProps {
  sideOpacity: MotionValue<number>;
  rightSide: string;
  colors: any;
}

export default function TimelineVerticalRight({
  sideOpacity,
  rightSide,
  colors
}: TimelineVerticalRightProps) {
  return (
    <motion.div
      className="fixed right-6 top-6 z-40 w-[200px]"
      style={{ opacity: sideOpacity }}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
    >
      <GlassContainer
        style="subtle"
        border="visible"
        rounded="2xl"
        className="p-4"
      >
        <motion.div
          className="flex flex-col items-center text-center border-l px-2 border-blue-500"
        >
          <p className="text-xs writing-mode-vertical-rl text-orientation-mixed">
            {rightSide}
          </p>
        </motion.div>
      </GlassContainer>
    </motion.div>
  );
}