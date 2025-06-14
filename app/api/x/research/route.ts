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

    const result = await xService.researchTweet(body);
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('X Research API error:', error);
    
    // Handle rate limiting
    if (error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }
    
    // Handle extraction failures
    if (error.message.includes('private, deleted')) {
      return NextResponse.json(
        { error: 'Tweet not accessible. It may be private, deleted, or from a protected account.' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to research tweet' },
      { status: 500 }
    );
  }
}