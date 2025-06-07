import { videos } from "@/app/constants/videos";
import { YouTubeDesktopPlayer } from "../player/YouTubeDesktopPlayer";
import { YouTubeMobilePlayer } from "../player/YouTubeMobilePlayer";

const PlaygroundLayout = () => {
    return (
        <div className="space-y-8">
            <div className="hidden md:block">
                <YouTubeDesktopPlayer videos={videos} initialIndex={0} autoPlay={false} />
            </div>
            <div className="md:hidden">
                <YouTubeMobilePlayer videos={videos} initialIndex={0} autoPlay={false} />
            </div>
        </div>
    );
}

export default PlaygroundLayout;