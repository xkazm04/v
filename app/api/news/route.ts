import { NextRequest, NextResponse } from 'next/server';
import { newsService } from '@/app/lib/services/news-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Create a simple object to check for search parameters
    const paramObject = {
      search_text: searchParams.get('search_text'),
      status_filter: searchParams.get('status_filter'),
      country_filter: searchParams.get('country_filter'),
      category_filter: searchParams.get('category_filter'),
      source_filter: searchParams.get('source_filter')
    };

    // Determine if this is a search request or general news request
    if (newsService.isSearchRequest(paramObject)) {
      // Handle search request
      const searchFilters = newsService.parseSearchParams(searchParams);
      const articles = await newsService.searchResearch(searchFilters);
      return NextResponse.json(articles);
    } else {
      // Handle general recent news request
      const recentNewsFilters = newsService.parseRecentNewsParams(searchParams);
      const articles = await newsService.getRecentNews(recentNewsFilters);
      return NextResponse.json(articles);
    }
  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// Optional: Add other HTTP methods if needed
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Handle POST requests if needed
    // Example: Create news, update news, etc.
    
    return NextResponse.json({ message: 'POST endpoint not implemented yet' }, { status: 501 });
  } catch (error) {
    console.error('News API POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}