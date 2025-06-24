import { supabaseAdmin } from '@/app/lib/supabase';
import { translateWithMetadata } from './translation-service';
import { Video } from '@/app/types/video_api';

interface VideoTranslationResult {
  translatedTitle: string | null;
  wasCached: boolean;
}

/**
 * Get cached video translation from Supabase
 */
async function getCachedVideoTranslation(
  videoId: string,
  field: string,
  targetLocale: string
): Promise<string | null> {
  try {
    if (!supabaseAdmin) {
      console.warn('Supabase admin client not available for video translation cache');
      return null;
    }

    const { data, error } = await supabaseAdmin
      .from('video_translations')
      .select('translated_text')
      .eq('video_id', videoId)
      .eq('field_name', field)
      .eq('target_locale', targetLocale)
      .single();

    if (error || !data) {
      return null;
    }

    console.log(`💾 Found cached video translation for ${videoId}.${field} -> ${targetLocale}`);
    return data.translated_text;

  } catch (error) {
    console.warn('Error retrieving cached video translation:', error);
    return null;
  }
}

/**
 * Cache video translation in Supabase
 */
async function cacheVideoTranslation(
  videoId: string,
  field: string,
  originalText: string,
  translatedText: string,
  sourceLocale: string,
  targetLocale: string
): Promise<void> {
  try {
    if (!supabaseAdmin) {
      console.warn('Supabase admin client not available for video translation caching');
      return;
    }

    const cacheEntry = {
      video_id: videoId,
      field_name: field,
      original_text: originalText,
      translated_text: translatedText,
      source_locale: sourceLocale,
      target_locale: targetLocale,
      translation_type: 'video_metadata',
      created_at: new Date().toISOString()
    };

    const { error } = await supabaseAdmin
      .from('video_translations')
      .upsert(cacheEntry, {
        onConflict: 'video_id,field_name,target_locale'
      });

    if (error) {
      console.warn('Video translation caching failed:', error);
    } else {
      console.log(`✅ Cached video translation: ${videoId}.${field} -> ${targetLocale}`);
    }

  } catch (error) {
    console.warn('Video translation caching failed:', error);
  }
}

/**
 * ✅ NEW: Translate video title with caching
 */
export async function translateVideoTitle(
  video: Video,
  sourceLocale: string = 'en',
  targetLocale: string = 'es'
): Promise<VideoTranslationResult> {
  if (!video.title || video.title.trim() === '') {
    return {
      translatedTitle: video.title,
      wasCached: false
    };
  }

  // Same language, no translation needed
  if (sourceLocale === targetLocale) {
    return {
      translatedTitle: video.title,
      wasCached: false
    };
  }

  try {
    console.log(`🎬 Translating video title: "${video.title}" from ${sourceLocale} to ${targetLocale}`);

    // Check video-specific cache first
    const cachedResult = await getCachedVideoTranslation(video.id, 'title', targetLocale);
    if (cachedResult) {
      console.log(`💾 Using cached video title translation for: ${video.id}`);
      return {
        translatedTitle: cachedResult,
        wasCached: true
      };
    }

    console.log(`🔄 No video cache found, translating title via service`);

    // Use the existing translation service with metadata
    const result = await translateWithMetadata(
      video.title,
      sourceLocale,
      targetLocale,
      'news' // Use 'news' context for video titles
    );

    if (result.translatedText && result.translatedText !== video.title) {
      // Cache the successful translation
      await cacheVideoTranslation(
        video.id,
        'title',
        video.title,
        result.translatedText,
        sourceLocale,
        targetLocale
      );

      return {
        translatedTitle: result.translatedText,
        wasCached: result.wasCached
      };
    } else {
      console.warn(`⚠️ Video title translation returned same text: "${video.title}"`);
      return {
        translatedTitle: video.title,
        wasCached: false
      };
    }

  } catch (error) {
    console.error('Video title translation error:', error);
    return {
      translatedTitle: video.title,
      wasCached: false
    };
  }
}

/**
 * ✅ NEW: Batch translate multiple video titles
 */
export async function batchTranslateVideoTitles(
  videos: Video[],
  sourceLocale: string = 'en',
  targetLocale: string = 'es'
): Promise<Video[]> {
  if (sourceLocale === targetLocale) {
    return videos;
  }

  try {
    console.log(`🎬 Batch translating ${videos.length} video titles from ${sourceLocale} to ${targetLocale}`);

    const translatedVideos = await Promise.all(
      videos.map(async (video) => {
        const result = await translateVideoTitle(video, sourceLocale, targetLocale);
        
        return {
          ...video,
          title: result.translatedTitle,
          // Add metadata to track translation status
          __translation_meta: {
            wasCached: result.wasCached,
            sourceLocale,
            targetLocale,
            originalTitle: video.title
          }
        };
      })
    );

    const cacheHits = translatedVideos.filter(v => v.__translation_meta?.wasCached).length;
    const newTranslations = translatedVideos.length - cacheHits;

    console.log(`✅ Batch video translation completed: ${cacheHits} cached, ${newTranslations} new`);

    return translatedVideos;

  } catch (error) {
    console.error('Batch video translation error:', error);
    return videos; // Return original videos on error
  }
}

/**
 * ✅ NEW: Translate video metadata (title, description, etc.)
 */
export async function translateVideoMetadata(
  video: Video,
  sourceLocale: string = 'en',
  targetLocale: string = 'es',
  fields: string[] = ['title']
): Promise<Video> {
  if (sourceLocale === targetLocale) {
    return video;
  }

  try {
    console.log(`🎬 Translating video metadata for: ${video.id}, fields: ${fields.join(', ')}`);

    let translatedVideo = { ...video };

    // Translate title
    if (fields.includes('title') && video.title) {
      const titleResult = await translateVideoTitle(video, sourceLocale, targetLocale);
      translatedVideo.title = titleResult.translatedTitle;
    }

    // Translate description (if available and requested)
    if (fields.includes('description') && video.description) {
      const result = await translateWithMetadata(
        video.description,
        sourceLocale,
        targetLocale,
        'news'
      );

      if (result.translatedText) {
        translatedVideo.description = result.translatedText;
        
        // Cache description translation
        await cacheVideoTranslation(
          video.id,
          'description',
          video.description,
          result.translatedText,
          sourceLocale,
          targetLocale
        );
      }
    }

    //@ts-expect-error Ignore
    translatedVideo.__translation_meta = {
      sourceLocale,
      targetLocale,
      translatedFields: fields,
      timestamp: new Date().toISOString()
    };

    return translatedVideo;

  } catch (error) {
    console.error('Video metadata translation error:', error);
    return video;
  }
}