import { Sidebar } from '@/app/components/sidebar/sidebar';
import { FeaturedVideos } from '@/app/sections/home/FeaturedVideos';
import { CategoryFilter } from '@/app/sections/home/CategoryFilter';

export default function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <CategoryFilter />
        <FeaturedVideos />
      </div>
    </div>
  );
}