import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { supabaseAdmin } from '@/app/lib/supabase';
import crypto from 'crypto';

const client = new ElevenLabsClient({ 
  apiKey: process.env.ELEVENLABS_API_KEY!
});

// Default voice ID (you can make this configurable)
const DEFAULT_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // Rachel voice

interface AudioCacheEntry {
  id?: string;
  text_hash: string;
  voice_id: string;
  audio_data: string; // base64 encoded
  audio_format: string;
  created_at?: string;
}

/**
 * Generate hash for text to use as cache key
 */
function generateTextHash(text: string, voiceId: string): string {
  return crypto.createHash('md5').update(`${text}_${voiceId}`).digest('hex');
}

/**
 * Get cached audio from Supabase
 */
async function getCachedAudio(textHash: string): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('elevenlabs_audio_cache')
      .select('audio_data')
      .eq('text_hash', textHash)
      .maybeSingle();

    if (error) {
      console.warn('Audio cache lookup error:', error);
      return null;
    }

    return data?.audio_data || null;
  } catch (error) {
    console.warn('Audio cache retrieval failed:', error);
    return null;
  }
}

/**
 * Cache audio in Supabase
 */
async function cacheAudio(
  textHash: string,
  voiceId: string,
  audioData: string,
  format: string
): Promise<void> {
  try {
    const cacheEntry: AudioCacheEntry = {
      text_hash: textHash,
      voice_id: voiceId,
      audio_data: audioData,
      audio_format: format,
    };

    const { error } = await supabaseAdmin
      .from('elevenlabs_audio_cache')
      .upsert(cacheEntry, {
        onConflict: 'text_hash'
      });

    if (error) {
      console.warn('Audio cache storage error:', error);
    } else {
      console.log(`✅ Cached audio for hash: ${textHash}`);
    }
  } catch (error) {
    console.warn('Audio caching failed:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, voiceId = DEFAULT_VOICE_ID } = await request.json();

    if (!text || text.trim() === '') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Generate hash for caching
    const textHash = generateTextHash(text, voiceId);
    
    // Check cache first
    console.log(`🎵 Generating audio for: "${text.slice(0, 50)}..."`);
    const cachedAudio = await getCachedAudio(textHash);
    
    if (cachedAudio) {
      console.log(`📋 Using cached audio for hash: ${textHash}`);
      
      // Convert base64 back to buffer
      const audioBuffer = Buffer.from(cachedAudio, 'base64');
      
      return new NextResponse(audioBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioBuffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
          'X-Audio-Source': 'cache'
        },
      });
    }

    // Generate new audio
    console.log(`🎤 Calling ElevenLabs API for voice: ${voiceId}`);
    
    const audioStream = await client.textToSpeech.stream(voiceId, {
      outputFormat: "mp3_44100_128",
      text: text,
      modelId: "eleven_multilingual_v2",
      voiceSettings: {
        stability: 0.75,
        similarityBoost: 0.75,
        style: 0.0,
        useSpeakerBoost: true
      }
    });

    // Collect stream data
    const chunks: Uint8Array[] = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }

    // Combine chunks into single buffer
    const audioBuffer = Buffer.concat(chunks);
    
    // Cache the audio (fire and forget)
    const base64Audio = audioBuffer.toString('base64');
    cacheAudio(textHash, voiceId, base64Audio, 'mp3_44100_128')
      .catch(error => console.warn('Background caching failed:', error));

    console.log(`✅ Generated audio: ${audioBuffer.length} bytes`);

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'X-Audio-Source': 'elevenlabs'
      },
    });

  } catch (error) {
    console.error('ElevenLabs API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate audio',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'ElevenLabs Audio API',
      endpoints: {
        POST: '/api/elevenlabs/stream - Generate audio from text'
      }
    },
    { status: 200 }
  );
}