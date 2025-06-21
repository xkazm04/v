import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { useViewport } from "@/app/hooks/useViewport"
import { Milestone } from "@/app/types/timeline";
import { motion } from "framer-motion";
import TimelineMilestonePersons from "./TimelineMilestone/TimelineMilestonePersons";
type Props = {
    milestone: Milestone
}
const TimelineSummary = ({milestone}: Props) => {
    const { colors } = useLayoutTheme();
    const { isMobile } = useViewport()
    return <>
        {milestone.key_persons && milestone.key_persons.length > 0 && (
            <motion.div
                className={`mb-${isMobile ? '6' : '8'}`}
            >
                <TimelineMilestonePersons
                    persons={milestone.key_persons}
                    isMobile={isMobile}
                    colors={colors}
                />
            </motion.div>
        )}

    </>
}

export default TimelineSummary;