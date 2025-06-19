import { NextRequest, NextResponse } from 'next/server';
import { supabaseNewsServiceServer } from '@/app/lib/services/supabase-news-service-server';
import { MockDataService } from '@/app/lib/services/mockDataService';
import { ResearchResult } from '@/app/types/article';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    
    console.log(`🔍 Research API route called with params:`, Object.fromEntries(searchParams.entries()));
    
    // Parse filters from search params
    const filters = {
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined,
      status: searchParams.get('status_filter') || undefined,
      category: searchParams.get('category_filter') || undefined,
      country: searchParams.get('country_filter') || undefined,
      source: searchParams.get('source_filter') || undefined,
      search: searchParams.get('search_text') || undefined,
      sort_by: searchParams.get('sort_by') || 'processed_at',
      sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || 'desc',
      translateTo: searchParams.get('translate_to') || 'es' // Default to Spanish
    };
    
    console.log(`🌐 Translation enabled: English → ${filters.translateTo}`);
    
    let results: ResearchResult[] = [];
    
    // Try Supabase first
    try {
      results = await supabaseNewsServiceServer.getNews(filters);
      
      if (results.length > 0) {
        console.log(`✅ Research API returning ${results.length} results from Supabase in ${Date.now() - startTime}ms`);
        
        return NextResponse.json({
          results,
          count: results.length,
          filters,
          __meta: {
            fetchTime: Date.now() - startTime,
            timestamp: new Date().toISOString(),
            source: 'supabase',
            translationEnabled: true,
            targetLanguage: filters.translateTo
          }
        });
      }
    } catch (supabaseError) {
      console.warn('⚠️ Supabase failed in API route:', supabaseError);
    }
    
    // Fallback to mock data
    console.log('🔄 Using mock data fallback in API route...');
    
    const mockResults = MockDataService.getMockNews({
      limit: filters.limit,
      offset: filters.offset,
      status: filters.status,
      category: filters.category,
      country: filters.country,
      source: filters.source,
      search: filters.search
    });
    
    // Convert mock to ResearchResult format
    //@ts-expect-error Ignore
    results = mockResults.map(article => ({
      id: article.id,
      statement: article.headline,
      source: article.source.name,
      context: article.summary,
      request_datetime: article.publishedAt,
      statement_date: article.statementDate,
      country: article.country,
      valid_sources: '',
      verdict: article.factCheck.verdict,
      status: article.factCheck.evaluation,
      correction: '',
      experts: article.factCheck.experts,
      resources_agreed: article.factCheck.resources_agreed,
      resources_disagreed: article.factCheck.resources_disagreed,
      processed_at: article.publishedAt,
      created_at: article.datePublished,
      updated_at: article.publishedAt,
      category: article.category,
      profileId: article.profileId,
      __meta: {
        source: 'mock',
        fetchTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        warning: 'Using offline mock data'
      }
    }));

    console.log(`✅ Research API returning ${results.length} mock results in ${Date.now() - startTime}ms`);
    
    return NextResponse.json({
      results,
      count: results.length,
      filters,
      __meta: {
        fetchTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        source: 'mock',
        translationEnabled: false,
        targetLanguage: filters.translateTo
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