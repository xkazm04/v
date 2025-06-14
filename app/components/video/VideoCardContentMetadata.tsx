import { itemVariants } from "@/app/helpers/animation";
import { useLayoutTheme } from "@/app/hooks/use-layout-theme";
import { cn } from "@/app/lib/utils";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Video } from "@/app/types/video_api";

type Props = {
    video: Video;
}

const VideoCardContentMetadata = ({video}: Props) => {
     const { colors } = useLayoutTheme();
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };
    return <motion.div
        variants={itemVariants}
        className="flex items-center justify-between gap-2"
    >
        {/* Date */}
        <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" style={{ color: colors.mutedForeground }} />
            <span
                className={cn(
                    "transition-colors duration-200 text-xs",
                )}
                style={{ color: colors.mutedForeground }}
            >
                {formatDate(video.created_at)}
            </span>
        </div>
    </motion.div>
}

export default VideoCardContentMetadata;