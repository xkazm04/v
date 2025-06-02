import { NextRequest, NextResponse } from 'next/server';
import { ResearchApiService } from '@/lib/services/research-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const limit = Number(searchParams.get('limit')) || 20;
    const onlyFactChecked = searchParams.get('fact_checked') === 'true';
    const breaking = searchParams.get('breaking') === 'true';
    const useAdmin = searchParams.get('admin') === 'true';

    let result;
    
    if (breaking) {
      result = await ResearchApiService.getBreakingNews({ limit, useAdmin });
    } else {
      result = await ResearchApiService.getRecentNews({ 
        limit, 
        onlyFactChecked, 
        useAdmin 
      });
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: result.data,
      count: result.data.length
    });

  } catch (error) {
    console.error('News API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}