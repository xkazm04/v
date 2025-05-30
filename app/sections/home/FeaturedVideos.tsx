import { VideoGrid } from '@/app/components/video/video-grid';
import { MOCK_VIDEOS } from '@/app/constants/videos';

export function FeaturedVideos() {
  return (
    <section className="py-6">
      <h2 className="text-2xl font-bold mb-6">Recommended Videos</h2>
      <VideoGrid videos={MOCK_VIDEOS} />
    </section>
  );
}