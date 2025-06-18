import { GlassContainer } from "@/app/components/ui/containers/GlassContainer";
import { FloatingVerdictIcon } from "@/app/components/ui/Decorative/FloatingVerdictIcon";
import { motion } from "framer-motion"

type Props = {
    timeline: {
        milestones: { events: { all_opinions: any[] }[] }[];
        conclusion: string;
    };
    colors: {
        primary: string;
        foreground: string;
        border: string;
    };
    itemVariants: any;
}

const TimelineHeaderSummary = ({ timeline, colors, itemVariants }: Props) => {
    return <motion.div
        className="col-span-6"
        variants={itemVariants}
    >
        <GlassContainer
            style="frosted"
            border="visible"
            rounded="xl"
            className="p-6 h-full"
            overlay={true}
            >
                 <div className="absolute flex flex-row justify-center w-full lg:hidden xl:block opacity-20"><FloatingVerdictIcon /></div>
        <div className="flex items-center justify-between px-5 mb-6">
           
            <h2
                className="text-xl font-bold"
                style={{ color: colors.primary }}
            >
                Executive Summary
            </h2>
            <motion.div
                className="flex justify-center gap-7 pt-6 pl-5 border-t"
                style={{ borderColor: colors.border + '30' }}
            >
                <div className="text-center">
                    <p
                        className="text-2xl font-black"
                        style={{ color: colors.primary }}
                    >
                        {timeline.milestones.length}
                    </p>
                    <p className="text-xs opacity-60">Milestones</p>
                </div>
                <div className="text-center">
                    <p
                        className="text-2xl font-black"
                        style={{ color: colors.primary }}
                    >
                        {timeline.milestones.reduce((acc, m) => acc + m.events.length, 0)}
                    </p>
                    <p className="text-xs opacity-60">Events</p>
                </div>
                <div className="text-center">
                    <p
                        className="text-2xl font-black"
                        style={{ color: colors.primary }}
                    >
                        {timeline.milestones.reduce((acc, m) => acc + m.events.reduce((eAcc, e) => eAcc + e.all_opinions.length, 0), 0)}
                    </p>
                    <p className="text-xs opacity-60">Opinions</p>
                </div>
            </motion.div>
        </div>

        <p
            className="leading-relaxed font-light text-base mb-6"
            style={{ color: colors.foreground }}
        >
            {timeline.conclusion}
        </p>
        </GlassContainer>
    </motion.div>
}

export default TimelineHeaderSummary;