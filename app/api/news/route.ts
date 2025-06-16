// app/api/news/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { newsService } from '@/app/lib/services/news-service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    
    console.log(`🔍 Research API route called with params:`, Object.fromEntries(searchParams.entries()));
    
    // Parse filters from search params
    const filters = newsService.parseSearchParams(searchParams);
    
    // Get research results with dual strategy
    const results = await newsService.getNews(filters);
    
    console.log(`✅ Research API returning ${results.length} results in ${Date.now() - startTime}ms`);
    
    // ✅ **Return ResearchResult array directly**
    return NextResponse.json({
      results,
      count: results.length,
      filters: filters,
      __meta: {
        fetchTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        totalSources: ['supabase', 'backend', 'mock']
      }
    });

  } catch (error) {
    console.error('💥 Research API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        results: [], // Return empty array to prevent frontend breaks
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