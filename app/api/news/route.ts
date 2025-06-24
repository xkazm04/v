import { NextRequest, NextResponse } from 'next/server';
import { supabaseNewsServiceServer } from '@/app/lib/services/supabase-news-service-server';
import { userPreferencesApiClient } from '@/app/lib/services/user-preferences-api-client';
import { ResearchResult } from '@/app/types/article';

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
    
    // Fallback: Check URL parameters if headers didn't work
    if (!translationTarget) {
      const langParam = searchParams.get('lang') || searchParams.get('translate_to');
      if (langParam && langParam !== 'en') {
        translationTarget = langParam;
      }
    }
    
    // Parse exclude_ids for article replacement
    const excludeIdsParam = searchParams.get('exclude_ids');
    const excludeIds = excludeIdsParam ? excludeIdsParam.split(',').filter(Boolean) : [];
    
    // Parse filters from search params
    const filters = {
      limit: parseInt(searchParams.get('limit') || '10'),
      offset: parseInt(searchParams.get('offset') || '0'),
      status: searchParams.get('status_filter') || undefined,
      category: searchParams.get('category_filter') || undefined,
      country: searchParams.get('country_filter') || undefined,
      source: searchParams.get('source_filter') || undefined,
      search: searchParams.get('search_text') || undefined,
      sort_by: searchParams.get('sort_by') || 'processed_at',
      sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || 'desc',
      translateTo: translationTarget || 'en',
      topicId: searchParams.get('topic_id') || undefined,
      excludeIds: searchParams.get('exclude_ids')?.split(',').filter(Boolean) || [],
    };
    
    let results: ResearchResult[] = [];
    
    try {
      // Pass translation target to Supabase service
      const supabaseFilters = {
        ...filters,
        translateTo: translationTarget || 'en'
      };
      
      results = await supabaseNewsServiceServer.getNews(supabaseFilters);
      
      // Filter out excluded articles client-side as backup
      if (excludeIds.length > 0) {
        results = results.filter(article => !excludeIds.includes(article.id));
      }
      
    } catch (supabaseError) {
      console.error('❌ Supabase fetch failed:', supabaseError);
    }
    
    return NextResponse.json({
      results,
      count: results.length,
      filters,
      __meta: {
        fetchTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        source: 'supabase',
        excludedCount: excludeIds.length,
        userPreferences: {
          translationEnabled: !!translationTarget,
          translationTarget: translationTarget || 'en',
          originalLanguage: 'en',
          detectionMethod: userPreferences ? 'headers' : 'url_params'
        }
      }
    });

  } catch (error) {
    console.error('💥 Research API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}