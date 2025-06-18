import { motion, MotionValue } from 'framer-motion';
import { GlassContainer } from '@/app/components/ui/containers/GlassContainer';

interface TimelineVerticalLeftProps {
  sideOpacity: MotionValue<number>;
  leftSide: string;
  colors: any;
}

export default function TimelineVerticalLeft({
  sideOpacity,
  leftSide,
  colors
}: TimelineVerticalLeftProps) {
  return (
    <motion.div
      className="fixed -left-5 top-6 z-40 w-[200px]"
      style={{ opacity: sideOpacity }}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
    >
      <GlassContainer
        style="subtle"
        border="visible"
        rounded="2xl"
        className="p-4"
      >
        <motion.div
          className="flex flex-row items-center text-center border-r border-blue-500"
        >  
          <p className="text-xs writing-mode-vertical-rl text-orientation-mixed">
            {leftSide}
          </p>
        </motion.div>
      </GlassContainer>
    </motion.div>
  );
}