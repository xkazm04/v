import { NextRequest, NextResponse } from 'next/server';
import { supabaseVideoService } from '@/app/lib/services/suapabse-video-service';
import { videoAPI } from './videos';
import { Video, VideoFilters } from '@/app/types/video_api';
import { userPreferencesApiClient } from '@/app/lib/services/user-preferences-api-client';
import { batchTranslateVideoTitles } from '@/app/lib/services/video-translation-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract user preferences from request
    const userPreferences = userPreferencesApiClient.extractUserPreferences({
      request,
      searchParams
    });
    
    // Get translation target from user preferences ONLY
    let translationTarget = userPreferencesApiClient.getTranslationTarget(userPreferences);
    
    // Parse filters from search params
    const filters: VideoFilters = {
      limit: searchParams.get('limit') ? Math.min(parseInt(searchParams.get('limit')!), 6) : 6,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0,
      source: searchParams.get('source') || undefined,
      speaker_name: searchParams.get('speaker_name') || undefined,
      language_code: searchParams.get('language_code') || undefined,
      categories: searchParams.get('categories') || undefined,
      search: searchParams.get('search') || undefined,
      sort_by: searchParams.get('sort_by') || 'processed_at',
      sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || 'desc',
      status: searchParams.get('status') || undefined,
      topic_id: searchParams.get('topic_id') || undefined,
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
      sort_order: filters.sort_order,
      status: filters.status,
      topic_id: filters.topic_id,
    };
    
    let videos: Video[] = [];
    let dataSource = 'unknown';
    
    // Try Supabase first
    try {
      videos = await supabaseVideoService.getVideos(supabaseFilters);
      
      if (videos.length > 0) {
        dataSource = 'supabase';
        
        // Apply translation if needed (only based on user preferences)
        if (translationTarget && translationTarget !== 'en') {
          try {
            videos = await batchTranslateVideoTitles(videos, 'en', translationTarget);
          } catch (translationError) {
            console.warn('⚠️ Video translation failed, using original content:', translationError);
          }
        }
        
        return NextResponse.json({
          videos,
          count: videos.length,
          filters,
          __meta: {
            fetchTime: Date.now() - startTime,
            timestamp: new Date().toISOString(),
            source: dataSource,
            dataQuality: 'real',
            translated: !!translationTarget,
            targetLanguage: translationTarget || 'en',
            userPreferences: {
              translationEnabled: !!translationTarget,
              translationTarget: translationTarget || 'en',
              originalLanguage: 'en',
              detectionMethod: userPreferences ? 'headers' : 'url_params'
            }
          }
        });
      }
    } catch (supabaseError) {
      console.warn('⚠️ Supabase videos failed in API route:', supabaseError);
    }
    
    // Fallback to backend API
    try {
      videos = await videoAPI.getVideos(filters);
      dataSource = 'backend_api';
      
      if (videos.length > 0) {
        // Apply translation to backend API results too (only based on user preferences)
        if (translationTarget && translationTarget !== 'en') {
          try {
            videos = await batchTranslateVideoTitles(videos, 'en', translationTarget);
          } catch (translationError) {
            console.warn('⚠️ Backend video translation failed, using original content:', translationError);
          }
        }
        
        return NextResponse.json({
          videos,
          count: videos.length,
          filters,
          __meta: {
            fetchTime: Date.now() - startTime,
            timestamp: new Date().toISOString(),
            source: dataSource,
            dataQuality: 'real',
            fallback: true,
            translated: !!translationTarget,
            targetLanguage: translationTarget || 'en'
          }
        });
      }
    } catch (backendError) {
      console.warn('⚠️ Backend API videos failed:', backendError);
    }
    
    // If both fail, return empty array with error info
    return NextResponse.json({
      videos: [],
      count: 0,
      filters,
      __meta: {
        fetchTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        source: 'none',
        dataQuality: 'none',
        error: 'All data sources failed',
        translated: false,
        targetLanguage: translationTarget || 'en'
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
          source: 'error',
          translated: false
        }
      },
      { status: 500 }
    );
  }
}