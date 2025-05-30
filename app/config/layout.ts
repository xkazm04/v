import { LayoutConfig, AnimationConfig } from '@/app/types/layout';

export const LAYOUT_CONFIGS: Record<string, LayoutConfig> = {
  grid: {
    containerClass: 'block group w-full',
    thumbnailClass: 'relative aspect-video w-full overflow-hidden rounded-lg bg-card',
    contentClass: 'mt-4 space-y-3',
    titleClass: 'font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors leading-snug',
    metaClass: 'text-sm text-muted-foreground',
    progressBarHeight: 'h-1.5',
    showDescription: false,
    showOverlay: true,
    overlayContent: 'full'
  },
  list: {
    containerClass: 'flex gap-6 group w-full min-h-48',
    thumbnailClass: 'relative w-80 h-48 flex-shrink-0 bg-card rounded-lg overflow-hidden',
    contentClass: 'flex-1 min-w-0 flex flex-col justify-between py-2',
    titleClass: 'text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors leading-tight',
    metaClass: 'text-sm text-muted-foreground',
    progressBarHeight: 'h-2',
    showDescription: true,
    showOverlay: true,
    overlayContent: 'minimal'
  },
  compact: {
    containerClass: 'flex gap-4 group w-full min-h-36',
    thumbnailClass: 'relative w-64 h-36 flex-shrink-0 bg-card rounded-lg overflow-hidden',
    contentClass: 'flex-1 min-w-0 flex flex-col justify-between py-1',
    titleClass: 'text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors',
    metaClass: 'text-xs text-muted-foreground',
    progressBarHeight: 'h-1',
    showDescription: false,
    showOverlay: false,
    overlayContent: 'none'
  }
};

export const ANIMATION_CONFIGS: Record<string, AnimationConfig> = {
  container: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  thumbnail: {
    initial: { scale: 1 },
    animate: { scale: 1 },
    exit: { scale: 0.95 },
    transition: { duration: 0.2 },
    hover: { scale: 1.02 }
  },
  overlay: {
    initial: { opacity: 0, backdropFilter: 'blur(0px)' },
    animate: { opacity: 1, backdropFilter: 'blur(4px)' },
    exit: { opacity: 0, backdropFilter: 'blur(0px)' },
    transition: { duration: 0.25, ease: 'easeInOut' }
  },
  progressBar: {
    initial: { scaleX: 0 },
    animate: { scaleX: 1 },
    exit: { scaleX: 0 },
    transition: { duration: 0.6, delay: 0.2, ease: 'easeOut' }
  },
  badge: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
    transition: { duration: 0.3, delay: 0.1, ease: 'backOut' }
  }
};