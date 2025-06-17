import { NextRequest, NextResponse } from 'next/server';
import { supabaseProfileServiceServer } from '@/app/lib/services/supabase-profile-service-server';

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

    const stats = await supabaseProfileServiceServer.getProfileStats(id);

    if (!stats) {
      return NextResponse.json(
        { error: 'Profile not found or no statistics available' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: stats });

  } catch (error) {
    console.error('Profile stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}