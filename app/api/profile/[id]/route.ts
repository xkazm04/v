import { NextRequest, NextResponse } from 'next/server';
import { ProfileApiService } from '@/app/api/profile/profile';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Profile ID is required' },
        { status: 400 }
      );
    }

    const result = await ProfileApiService.getProfileById(id);

    if (result.error) {
      // Handle specific error types
      if (result.error.includes('404')) {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    if (!result.data) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: result.data });

  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}