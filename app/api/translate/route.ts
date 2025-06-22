import { NextRequest, NextResponse } from 'next/server';
import { translateWithMetadata } from '@/app/lib/services/translation-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      text, 
      sourceLocale = 'en', 
      targetLocale = 'es',
      context 
    } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    console.log(`🔄 API: Translating "${text.slice(0, 50)}..." from ${sourceLocale} to ${targetLocale}`);
    const result = await translateWithMetadata(
      text,
      sourceLocale,
      targetLocale,
      context
    );

    console.log(`✅ API: Translation completed (cached: ${result.wasCached})`);

    return NextResponse.json({
      translatedText: result.translatedText,
      originalText: text,
      sourceLocale,
      targetLocale,
      context,
      cached: result.wasCached, 
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Translation API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Translation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}