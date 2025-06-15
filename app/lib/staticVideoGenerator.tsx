
import { videos as mockVideos } from '@/app/constants/videos';
import { supabaseVideoService } from './services/suapabse-video-service';

export async function generateAllVideoStaticData() {
  try {
    console.log('🏗️ Starting video static data generation...');
    
    // Get all video IDs from Supabase
    const supabaseVideoIds = await supabaseVideoService.getAllVideoIds();
    
    // Get mock video IDs as fallback
    const mockVideoIds = mockVideos.map(v => v.video.id);
    
    // Combine and deduplicate
    const allVideoIds = Array.from(new Set([...supabaseVideoIds, ...mockVideoIds]));
    
    console.log(`📊 Generating static data for ${allVideoIds.length} videos`);
    
    // Batch fetch video details for static generation
    const videoDetails = await supabaseVideoService.getMultipleVideoDetails(allVideoIds);
    
    console.log(`✅ Successfully generated static data for ${Object.keys(videoDetails).length} videos`);
    
    return {
      videoIds: allVideoIds,
      videoDetails,
      generatedAt: new Date().toISOString(),
      totalVideos: allVideoIds.length,
      successfulFetches: Object.keys(videoDetails).length
    };
    
  } catch (error) {
    console.error('❌ Error in video static generation:', error);
    
    // Fallback to mock data only
    const mockVideoIds = mockVideos.map(v => v.video.id);
    
    return {
      videoIds: mockVideoIds,
      videoDetails: {},
      generatedAt: new Date().toISOString(),
      totalVideos: mockVideoIds.length,
      successfulFetches: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}