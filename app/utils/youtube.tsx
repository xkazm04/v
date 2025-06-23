/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    // Standard watch URL
    /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
    // Short URL
    /(?:youtu\.be\/)([^&\n?#]+)/,
    // Embed URL
    /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
    // Old format
    /(?:youtube\.com\/v\/)([^&\n?#]+)/,
    // Any URL with v= parameter
    /(?:youtube\.com\/.*[?&]v=)([^&\n?#]+)/,
    // Mobile URL
    /(?:m\.youtube\.com\/watch\?v=)([^&\n?#]+)/,
    // Gaming URL
    /(?:gaming\.youtube\.com\/watch\?v=)([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Validate if a string is a valid YouTube URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}

/**
 * Generate YouTube embed URL from video ID
 */
export function generateYouTubeEmbedUrl(videoId: string, options: {
  autoplay?: boolean;
  controls?: boolean;
  modestbranding?: boolean;
  rel?: boolean;
  start?: number;
} = {}): string {
  const params = new URLSearchParams();
  
  if (options.autoplay) params.set('autoplay', '1');
  if (options.controls === false) params.set('controls', '0');
  if (options.modestbranding) params.set('modestbranding', '1');
  if (options.rel === false) params.set('rel', '0');
  if (options.start) params.set('start', options.start.toString());
  
  const queryString = params.toString();
  return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ''}`;
}