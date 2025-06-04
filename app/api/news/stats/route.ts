import { NextRequest, NextResponse } from 'next/server';
import { newsService } from '@/app/lib/services/news-service';
// import { fetchNewsStats, fetchAvailableCategories } from '@/app/lib/services/news-service';

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


// export async function GET(request: NextRequest) {
//   try {
//     const stats = await fetchNewsStats();
//     return NextResponse.json(stats);
//   } catch (error) {
//     console.error('News Stats API error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch news statistics' }, 
//       { status: 500 }
//     );
//   }
// }

// export async function GET(request: NextRequest) {
//   try {
//     const categories = await fetchAvailableCategories();
//     return NextResponse.json(categories);
//   } catch (error) {
//     console.error('Categories API error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch categories' }, 
//       { status: 500 }
//     );
//   }
// }