import { NextRequest, NextResponse } from 'next/server';
import { ResearchApiService } from '@/app/lib/services/research-api';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const { searchParams } = new URL(request.url);
    const useAdmin = searchParams.get('admin') === 'true';

    const result = await ResearchApiService.getResearchById(id, useAdmin);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    if (!result.data) {
      return NextResponse.json(
        { error: 'Research result not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.data);

  } catch (error) {
    console.error('Research detail API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}