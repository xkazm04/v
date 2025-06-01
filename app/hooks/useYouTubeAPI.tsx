'use client';

import { useEffect, useRef } from 'react';

// Global YouTube API loading state
let apiLoadPromise: Promise<void> | null = null;

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
    ytApiReady?: boolean;
    ytApiLoading?: boolean;
  }
}

const loadYouTubeAPI = (): Promise<void> => {
  // Return existing promise if API is already loading
  if (apiLoadPromise) {
    return apiLoadPromise;
  }

  // If API is already loaded, return resolved promise
  if (window.YT && window.YT.Player && window.ytApiReady) {
    return Promise.resolve();
  }

  // Create new loading promise
  apiLoadPromise = new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
    
    if (existingScript && !window.ytApiLoading) {
      // Script exists but might not be loaded yet, wait for it
      const checkExisting = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkExisting);
          window.ytApiReady = true;
          resolve();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkExisting);
        reject(new Error('Existing YouTube API script failed to load'));
      }, 10000);
      return;
    }

    if (window.ytApiLoading) {
      // API is already loading, wait for it
      const checkLoading = setInterval(() => {
        if (window.YT && window.YT.Player && window.ytApiReady) {
          clearInterval(checkLoading);
          resolve();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkLoading);
        reject(new Error('YouTube API loading timeout'));
      }, 10000);
      return;
    }

    // Mark as loading
    window.ytApiLoading = true;

    // Set up the callback before loading the script
    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube API Ready');
      window.ytApiReady = true;
      window.ytApiLoading = false;
      resolve();
    };

    // Load the script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    
    tag.onerror = () => {
      window.ytApiLoading = false;
      reject(new Error('Failed to load YouTube API script'));
    };

    // Insert script
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      document.head.appendChild(tag);
    }

    // Timeout after 15 seconds
    setTimeout(() => {
      if (!window.ytApiReady) {
        window.ytApiLoading = false;
        reject(new Error('YouTube API load timeout'));
      }
    }, 15000);
  });

  return apiLoadPromise;
};

export function useYouTubeAPI() {
  const isLoadedRef = useRef(false);

  useEffect(() => {
    if (isLoadedRef.current) return;
    
    loadYouTubeAPI()
      .then(() => {
        isLoadedRef.current = true;
        console.log('YouTube API loaded successfully');
      })
      .catch((error) => {
        console.error('Failed to load YouTube API:', error);
      });
  }, []);

  return {
    loadAPI: loadYouTubeAPI,
    isAPIReady: () => window.YT && window.YT.Player && window.ytApiReady
  };
}