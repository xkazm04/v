// app/api/news/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { newsService } from '@/app/lib/services/news-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    
    console.log(`🔍 Research API route called with params:`, Object.fromEntries(searchParams.entries()));
    
    // Parse filters from search params (including translation)
    const filters = newsService.parseSearchParams(searchParams);
    
    const enhancedFilters = {
      ...filters,
      translate_to: 'es'
    };
    
    console.log(`🌐 Translation enabled: English → Spanish`);
    
    // Get research results with translation
    const results = await newsService.getNews(enhancedFilters);
    
    console.log(`✅ Research API returning ${results.length} results in ${Date.now() - startTime}ms`);
    
    // Return ResearchResult array with translated statements
    return NextResponse.json({
      results,
      count: results.length,
      filters: enhancedFilters,
      __meta: {
        fetchTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        totalSources: ['supabase', 'backend', 'mock'],
        translationEnabled: true,
        targetLanguage: 'es'
      }
    });

  } catch (error) {
    console.error('💥 Research API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        results: [],
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