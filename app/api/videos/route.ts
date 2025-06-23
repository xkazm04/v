import { NextRequest, NextResponse } from 'next/server';
import { videoAPI } from '@/app/api/videos/videos';
import { Video, VideoFilters } from '@/app/types/video_api';
import { supabaseVideoService } from '@/app/lib/services/suapabse-video-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    
    console.log(`🔍 Videos API route called with params:`, Object.fromEntries(searchParams.entries()));
    
    // Parse filters from search params
    const filters: VideoFilters = {
      limit: searchParams.get('limit') ? Math.min(parseInt(searchParams.get('limit')!), 6) : 6, // Max 6 for featured
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
      source: searchParams.get('source') || undefined,
      speaker_name: searchParams.get('speaker_name') || undefined,
      language_code: searchParams.get('language_code') || undefined,
      categories: searchParams.get('categories') || undefined,
      search: searchParams.get('search') || undefined,
      sort_by: searchParams.get('sort_by') || 'processed_at',
      sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || 'desc'
    };

    // Convert to Supabase filters format
    const supabaseFilters = {
      limit: filters.limit,
      offset: filters.offset,
      source: filters.source,
      speaker_name: filters.speaker_name,
      language_code: filters.language_code,
      categories: filters.categories,
      search: filters.search,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order
    };
    
    let videos: Video[] = [];
    let dataSource = 'unknown';
    
    // Try Supabase first
    try {
      console.log('🎯 Attempting to fetch videos from Supabase...');
      videos = await supabaseVideoService.getVideos(supabaseFilters);
      
      if (videos.length > 0) {
        dataSource = 'supabase';
        console.log(`✅ Videos API returning ${videos.length} results from Supabase in ${Date.now() - startTime}ms`);
        
        return NextResponse.json({
          videos,
          count: videos.length,
          filters,
          __meta: {
            fetchTime: Date.now() - startTime,
            timestamp: new Date().toISOString(),
            source: dataSource,
            dataQuality: 'real'
          }
        });
      }
    } catch (supabaseError) {
      console.warn('⚠️ Supabase videos failed in API route:', supabaseError);
    }
    
    // Fallback to backend API
    try {
      console.log('🔄 Using backend API fallback for videos...');
      videos = await videoAPI.getVideos(filters);
      dataSource = 'backend_api';
      
      if (videos.length > 0) {
        console.log(`✅ Videos API returning ${videos.length} results from backend API in ${Date.now() - startTime}ms`);
        
        return NextResponse.json({
          videos,
          count: videos.length,
          filters,
          __meta: {
            fetchTime: Date.now() - startTime,
            timestamp: new Date().toISOString(),
            source: dataSource,
            dataQuality: 'real',
            fallback: true
          }
        });
      }
    } catch (backendError) {
      console.warn('⚠️ Backend API videos failed:', backendError);
    }
    
    // If both fail, return empty array with error info
    console.log('❌ All video sources failed, returning empty array');
    
    return NextResponse.json({
      videos: [],
      count: 0,
      filters,
      __meta: {
        fetchTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        source: 'none',
        dataQuality: 'none',
        error: 'All data sources failed'
      }
    });

  } catch (error) {
    console.error('💥 Videos API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        videos: [],
        __meta: {
          fetchTime: Date.now() - startTime,
          timestamp: new Date().toISOString(),
          source: 'error'
        }
      },
      { status: 500 }
    );
  }
}