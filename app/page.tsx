import { Sidebar } from '@/app/components/sidebar/sidebar';
import { FeaturedVideos } from '@/app/sections/home/FeaturedVideos';
import { CategoryFilter } from '@/app/sections/home/CategoryFilter';
import { Divider } from './components/ui/divider';
import FeaturedNews from './sections/home/FeaturedNews';

export default function Home() {
  return (
    <div className="flex relative">
      <Sidebar />
      <div className="flex-1 p-4 relative">
        <CategoryFilter />
        <FeaturedVideos />
        <Divider />
        <FeaturedNews />
      </div>
    </div>
  );
}