import { MOCK_VIDEOS } from '@/app/constants/videos';
import { VideoGrid } from '../feed/VideoGrid';

export function FeaturedVideos() {
  return (
    <section className="py-6 relative">
      <h2 className="text-2xl font-bold mb-6">Hot</h2>
      <VideoGrid videos={MOCK_VIDEOS} />
    </section>
  );
}