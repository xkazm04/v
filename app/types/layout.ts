export type LayoutType = 'grid' | 'list' | 'compact';

export interface LayoutConfig {
  containerClass: string;
  thumbnailClass: string;
  contentClass: string;
  titleClass: string;
  metaClass: string;
  progressBarHeight: string;
  showDescription: boolean;
  showOverlay: boolean;
  overlayContent: 'full' | 'minimal' | 'none';
}

export interface AnimationConfig {
  initial: object;
  animate: object;
  exit: object;
  transition: object;
  hover?: object;
}