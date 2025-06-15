import { NextRequest, NextResponse } from 'next/server';
import { ResearchApiService } from '@/app/lib/services/research-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const limit = Number(searchParams.get('limit')) || 50;
    const offset = Number(searchParams.get('offset')) || 0;
    const useAdmin = searchParams.get('admin') === 'true';

    const result = await ResearchApiService.getResearchResults({
      search,
      status,
      limit,
      offset,
      useAdmin
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: result.data,
      count: result.count,
      pagination: {
        limit,
        offset,
        hasMore: result.count > offset + limit
      }
    });

  } catch (error) {
    console.error('Research API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}