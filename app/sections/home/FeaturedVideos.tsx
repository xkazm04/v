import { VideoGrid } from '../feed/VideoGrid';

export function FeaturedVideos() {
  let videos
  return ( <>
    {videos && <section className="py-6 relative">
      <h2 className="text-2xl font-bold mb-6">Hot</h2>
       <VideoGrid videos={videos} />
    </section>}
    </>
  );
}