import { videos } from "../constants/videos";
import { YouTubeMobilePlayer } from "../sections/player/YouTubeMobilePlayer";

export default function Page() {
    return <>
        <YouTubeMobilePlayer videos={videos} initialIndex={0} autoPlay={false} />
    </>
}
