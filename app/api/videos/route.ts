import { NextRequest, NextResponse } from 'next/server';
import { videoAPI } from './videos';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchText = searchParams.get('search_text');
    const sourceFilter = searchParams.get('source_filter');
    const researchedFilter = searchParams.get('researched_filter');
    const speakerFilter = searchParams.get('speaker_filter');
    const languageFilter = searchParams.get('language_filter');
    const categoriesFilter = searchParams.get('categories_filter');
    const limitCount = parseInt(searchParams.get('limit_count') || '50');
    const offsetCount = parseInt(searchParams.get('offset_count') || '0');

    // If it's a search request, use the search endpoint
    if (searchText || sourceFilter || researchedFilter || speakerFilter || languageFilter || categoriesFilter) {
      const results = await videoAPI.searchVideos(
        searchText || undefined,
        sourceFilter || undefined,
        researchedFilter ? researchedFilter === 'true' : undefined,
        speakerFilter || undefined,
        languageFilter || undefined,
        categoriesFilter || undefined,
        limitCount,
        offsetCount
      );
      return NextResponse.json(results);
    }

    // Otherwise, get all videos with basic filters
    const filters = {
      limit: limitCount,
      offset: offsetCount
    };

    const results = await videoAPI.getVideos(filters);
    return NextResponse.json(results);

  } catch (error) {
    console.error('Video API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}