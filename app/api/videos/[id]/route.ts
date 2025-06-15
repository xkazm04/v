import { NextRequest, NextResponse } from 'next/server';
import { videoAPI } from '@/app/api/videos/videos';
import { convertBackendToFrontend } from '@/app/types/video_api';
import { videos as mockVideos } from '@/app/constants/videos';
import { supabaseVideoService } from '@/app/lib/services/suapabse-video-service';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = Date.now();
  
  try {
    const { id: videoId } = await params;
    
    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    console.log(`🎬 Fetching video detail for ID: ${videoId}`);

    // ✅ **STRATEGY 1: Try Supabase first**
    let videoDetail = null;
    let dataSource = 'unknown';

    try {
      console.log('🔄 Attempting Supabase fetch...');
      videoDetail = await supabaseVideoService.getVideoDetail(videoId);
      
      if (videoDetail) {
        console.log(`✅ Successfully fetched from Supabase in ${Date.now() - startTime}ms`);
        dataSource = 'supabase';
        
        return NextResponse.json({
          ...videoDetail,
          __meta: {
            source: dataSource,
            fetchTime: Date.now() - startTime,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        console.log('⚠️ No data found in Supabase, trying FastAPI...');
      }
    } catch (supabaseError) {
      console.warn('⚠️ Supabase fetch failed:', supabaseError);
    }

    // ✅ **STRATEGY 2: Fallback to FastAPI backend**
    try {
      console.log('🔄 Attempting FastAPI fetch...');
      const backendResponse = await videoAPI.getVideoDetail(videoId);
      
      if (backendResponse) {
        // Convert backend response to frontend format
        videoDetail = convertBackendToFrontend(backendResponse);
        dataSource = 'fastapi';
        
        console.log(`✅ Successfully fetched from FastAPI in ${Date.now() - startTime}ms`);
        
        return NextResponse.json({
          ...videoDetail,
          __meta: {
            source: dataSource,
            fetchTime: Date.now() - startTime,
            timestamp: new Date().toISOString()
          }
        });
      } else {
        console.log('⚠️ No data found in FastAPI, trying mock data...');
      }
    } catch (fastApiError) {
      console.warn('⚠️ FastAPI fetch failed:', fastApiError);
    }

    // ✅ **STRATEGY 3: Ultimate fallback to mock data**
    try {
      console.log('🔄 Attempting mock data fallback...');
      const mockVideo = mockVideos.find(v => 
        v.video.id === videoId || 
        v.video.video_url.includes(videoId)
      );
      
      if (mockVideo) {
        console.log(`✅ Found mock data for video: ${videoId}`);
        dataSource = 'mock';
        
        return NextResponse.json({
          ...mockVideo,
          __meta: {
            source: dataSource,
            fetchTime: Date.now() - startTime,
            timestamp: new Date().toISOString(),
            warning: 'Using offline mock data'
          }
        });
      }
    } catch (mockError) {
      console.warn('⚠️ Mock data access failed:', mockError);
    }

    // ✅ **NO DATA FOUND ANYWHERE**
    console.log(`❌ Video not found in any data source: ${videoId}`);
    
    return NextResponse.json(
      { 
        error: 'Video not found',
        videoId,
        searchedSources: ['supabase', 'fastapi', 'mock'],
        __meta: {
          source: 'none',
          fetchTime: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      },
      { status: 404 }
    );

  } catch (error) {
    console.error('💥 Unexpected error in video detail route:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        __meta: {
          source: 'error',
          fetchTime: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

// ✅ **STATIC GENERATION SUPPORT**
export async function generateStaticParams() {
  try {
    console.log('🏗️ Generating static params for video details...');
    
    // Get all video IDs from Supabase for static generation
    const videoIds = await supabaseVideoService.getAllVideoIds();
    
    // Also include mock video IDs
    const mockVideoIds = mockVideos.map(v => v.video.id);
    
    const allIds = Array.from(new Set([...videoIds, ...mockVideoIds]));
    
    console.log(`📊 Generating static params for ${allIds.length} videos`);
    
    return allIds.map(id => ({
      id: id
    }));
    
  } catch (error) {
    console.error('Error generating static params:', error);
    
    // Fallback to mock videos only
    return mockVideos.map(v => ({
      id: v.video.id
    }));
  }
}