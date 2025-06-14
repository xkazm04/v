import { NextRequest, NextResponse } from 'next/server';
import { xService } from '@/app/lib/services/x-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    if (!body.tweet_url) {
      return NextResponse.json(
        { error: 'tweet_url is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    if (!xService.validateTwitterUrl(body.tweet_url)) {
      return NextResponse.json(
        { error: 'Invalid Twitter/X URL format' },
        { status: 400 }
      );
    }

    const result = await xService.extractTweet(body);
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('X Extract API error:', error);
    
    // Handle specific error types
    if (error.message.includes('Invalid Twitter/X URL')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    if (error.message.includes('private, deleted')) {
      return NextResponse.json(
        { error: 'Tweet not accessible. It may be private, deleted, or from a protected account.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to extract tweet' },
      { status: 500 }
    );
  }
}