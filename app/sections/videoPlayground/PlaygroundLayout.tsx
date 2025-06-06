import { YouTubeDesktopPlayer } from "../player/YouTubeDesktopPlayer";
import { YouTubeMobilePlayer } from "../player/YouTubeMobilePlayer";
import { VideoMetadata } from "@/app/types/video";

const videos: VideoMetadata[] = [
    {
        id: "1",
        title: "Climate Change Facts and Scientific Evidence",
        description: "A comprehensive look at climate change science and evidence.",
        thumbnailUrl: "https://via.placeholder.com/150",
        videoUrl: "https://www.youtube.com/watch?v=1dv99v6GRi4",
        duration: 900, // 15 minutes
        views: 125000,
        likes: 8500,
        uploadDate: "2023-12-01",
        channelName: "Science Explained",
        category: "Education",
        factCheck: {
            evaluation: "Fact",
            truthPercentage: 92,
            neutralPercentage: 6,
            misleadingPercentage: 2,
            totalClaims: 15,
            verifiedClaims: 14,
            sources: 8,
            confidence: 95
        },
        youtubeId: "1dv99v6GRi4"
    },
    {
        id: "2",
        title: "Controversial Health Claims Investigation",
        description: "Examining popular health claims and their validity.",
        thumbnailUrl: "https://via.placeholder.com/150",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: 720, // 12 minutes
        views: 45000,
        likes: 2100,
        uploadDate: "2023-11-15",
        channelName: "Health Truth",
        category: "Education",
        factCheck: {
            evaluation: "Mislead",
            truthPercentage: 25,
            neutralPercentage: 15,
            misleadingPercentage: 60,
            totalClaims: 8,
            verifiedClaims: 2,
            sources: 3,
            confidence: 78
        },
        youtubeId: "dQw4w9WgXcQ"
    },
];

const PlaygroundLayout = () => {
    return (
        <div className="space-y-8">
            <div className="hidden md:block">
                <YouTubeDesktopPlayer videos={videos} initialIndex={0} autoPlay={false} />
            </div>
            <div className="md:hidden">
                <YouTubeMobilePlayer videos={videos} initialIndex={0} autoPlay={true} />
            </div>
        </div>
    );
}

export default PlaygroundLayout;