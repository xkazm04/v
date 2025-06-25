import { NextRequest, NextResponse } from 'next/server';
import { videoAPI } from '@/app/api/videos/videos';
import { convertBackendToFrontend } from '@/app/types/video_api';
import { videos as mockVideos } from '@/app/constants/videos';
import { supabaseVideoDetailService } from '@/app/lib/services/supabase-video-detail-service';
import { extractYouTubeId } from '@/app/utils/youtube';

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

    // ✅ STRATEGY 1: Try Supabase first with enhanced error handling
    let videoDetail = null;
    let dataSource = 'unknown';

    try {
      console.log('🔄 Attempting Supabase fetch...');
      
      // ✅ FIXED: Use the correct service and method
      const healthCheck = await supabaseVideoDetailService.healthCheck();
      if (!healthCheck) {
        throw new Error('Supabase connection failed health check');
      }
      
      // ✅ FIXED: Use the correct method name
      videoDetail = await supabaseVideoDetailService.getVideoWithTimestamps(videoId);
      
      if (videoDetail) {
        console.log(`✅ Successfully fetched from Supabase in ${Date.now() - startTime}ms`);
        dataSource = 'supabase';
        
        return NextResponse.json({
          ...videoDetail,
          __meta: {
            source: dataSource,
            fetchTime: Date.now() - startTime,
            timestamp: new Date().toISOString(),
            dataQuality: 'real'
          }
        });
      } else {
        console.log('⚠️ No data found in Supabase, trying FastAPI...');
      }
    } catch (supabaseError) {
      console.warn('⚠️ Supabase fetch failed:', supabaseError);
      console.warn('⚠️ Supabase error details:', {
        message: supabaseError instanceof Error ? supabaseError.message : 'Unknown error',
        stack: supabaseError instanceof Error ? supabaseError.stack : 'No stack trace'
      });
    }

    // ✅ STRATEGY 2: Fallback to FastAPI backend (with timeout)
    try {
      console.log('🔄 Attempting FastAPI fetch...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const backendResponse = await videoAPI.getVideoDetail(videoId, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
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
              timestamp: new Date().toISOString(),
              dataQuality: 'real',
              fallback: true
            }
          });
        }
      } catch (timeoutError) {
        clearTimeout(timeoutId);
        throw timeoutError;
      }
      
    } catch (fastApiError) {
      console.warn('⚠️ FastAPI fetch failed:', fastApiError);
    }

    // ✅ STRATEGY 3: Mock data fallback with enhanced matching
    try {
      console.log('🔄 Trying mock data fallback...');
      
      const mockVideo = mockVideos.find(v => 
        v.video.id === videoId || 
        v.video.video_url.includes(videoId) ||
        extractYouTubeId(v.video.video_url) === videoId
      );

      if (mockVideo) {
        console.log(`📚 Using mock data for: ${videoId}`);
        dataSource = 'mock';
        
        return NextResponse.json({
          ...mockVideo,
          __meta: {
            source: dataSource,
            fetchTime: Date.now() - startTime,
            timestamp: new Date().toISOString(),
            dataQuality: 'mock',
            warning: 'Using mock data - API sources unavailable'
          }
        });
      }
    } catch (mockError) {
      console.warn('⚠️ Mock data fallback failed:', mockError);
    }

    // ✅ STRATEGY 4: Generate minimal video object
    console.log(`⚠️ Creating minimal video object for: ${videoId}`);
    
    const minimalVideo = {
      video: {
        id: videoId,
        video_url: `https://youtube.com/watch?v=${videoId}`,
        source: 'youtube',
        researched: false,
        title: `Video ${videoId}`,
        verdict: null,
        duration_seconds: null,
        speaker_name: null,
        language_code: 'en',
        audio_extracted: false,
        transcribed: false,
        analyzed: false,
        created_at: new Date().toISOString(),
        updated_at: null,
        processed_at: null,
        duration: 'Unknown'
      },
      timestamps: []
    };
    
    return NextResponse.json({
      ...minimalVideo,
      __meta: {
        source: 'generated',
        fetchTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        dataQuality: 'minimal',
        warning: 'Generated minimal video object - all data sources failed'
      }
    });

  } catch (error) {
    console.error('💥 Unexpected error in video detail route:', error);
    let videoId: string | undefined = undefined;
    try {
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/');
      videoId = pathParts[pathParts.length - 1] || undefined;
    } catch {
      videoId = undefined;
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        videoId,
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

// ✅ STATIC GENERATION SUPPORT
export async function generateStaticParams() {
  try {
    console.log('🏗️ Generating static params for video details...');
    
    // ✅ FIXED: Use the correct service
    const videoExists = await supabaseVideoDetailService.healthCheck();
    if (!videoExists) {
      console.warn('Supabase not available for static generation');
      return mockVideos.map(v => ({ id: v.video.id }));
    }

    // Get sample video IDs for static generation
    // You might want to add a method to get all IDs in supabaseVideoDetailService
    
    // Also include mock video IDs
    const mockVideoIds = mockVideos.map(v => v.video.id);
    
    console.log(`📊 Generating static params for ${mockVideoIds.length} videos`);
    
    return mockVideoIds.map(id => ({
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