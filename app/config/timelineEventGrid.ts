import { ViewportType } from '@/app/hooks/useViewport';

export interface GridPosition {
  id: string;
  order: number;
  style: {
    position?: 'absolute';
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    transform?: string;
    zIndex?: number;
  };
  animation: {
    initial: Record<string, any>;
    animate: Record<string, any>;
    exit: Record<string, any>;
    transition: {
      duration: number;
      delay: number;
      ease?: string;
      type?: string;
    };
  };
  mobileOrder?: number;
}

export interface TimelineEventGridConfig {
  container: {
    height: string;
    maxWidth: string;
    width: string;
    margin: string;
    padding: string;
    position: 'relative';
  };
  factCard: {
    style: {
      position: 'absolute' | 'relative';
      top: string;
      left: string;
      transform: string;
      zIndex: number;
      width: string;
    };
  };
  positions: GridPosition[];
  mobileConfig: {
    container: string;
    cardSpacing: string;
  };
}

export const getTimelineEventGridConfig = (
  viewport: ViewportType,
  showAllOpinions: boolean
): TimelineEventGridConfig => {
  const { isMobile, isTablet, isDesktop } = viewport;

  // Base dimensions
  const containerHeight = isDesktop ? '900px' : '400px';
  const containerMaxWidth = isDesktop ? '2000px' : '100%';
  const factCardWidth = isDesktop ? '640px' : '280px';

  // Use mobile layout for both mobile AND tablet
  if (isMobile || isTablet) {
    return {
      container: {
        height: 'auto',
        maxWidth: '100%',
        width: '100%',
        margin: '0 auto',
        padding: '1rem',
        position: 'relative'
      },
      factCard: {
        style: {
          position: 'relative' as const,
          top: 'auto',
          left: 'auto',
          transform: 'none',
          zIndex: 20,
          width: factCardWidth
        }
      },
      positions: [],
      mobileConfig: {
        container: 'flex flex-col gap-6 w-full',
        cardSpacing: 'space-y-6'
      }
    };
  }

  // Desktop grid positions in ideal order
  const positions: GridPosition[] = [
    // 1. Top Right (primary position 1)
    {
      id: 'topRight',
      order: 1,
      style: {
        position: 'absolute',
        top: '5%',
        right: '5%',
        zIndex: 10
      },
      animation: {
        initial: { opacity: 0, scale: 0.8, y: -30, x: 30 },
        animate: { opacity: 1, scale: 1, y: 0, x: 0 },
        exit: { opacity: 0, scale: 0.8, y: -30, x: 30 },
        transition: { duration: 0.5, delay: 0.1, ease: "easeOut" }
      },
      mobileOrder: 1
    },
    
    // 2. Bottom Left (primary position 2)
    {
      id: 'bottomLeft',
      order: 2,
      style: {
        position: 'absolute',
        bottom: '5%',
        left: '5%',
        zIndex: 10
      },
      animation: {
        initial: { opacity: 0, scale: 0.8, y: 30, x: -30 },
        animate: { opacity: 1, scale: 1, y: 0, x: 0 },
        exit: { opacity: 0, scale: 0.8, y: 30, x: -30 },
        transition: { duration: 0.5, delay: 0.1, ease: "easeOut" }
      },
      mobileOrder: 2
    },

    // 3. Top Left (secondary position 1)
    {
      id: 'topLeft',
      order: 3,
      style: {
        position: 'absolute',
        top: '5%',
        left: '5%',
        zIndex: 9
      },
      animation: {
        initial: { opacity: 0, scale: 0.8, y: -30, x: -30 },
        animate: { opacity: 1, scale: 1, y: 0, x: 0 },
        exit: { opacity: 0, scale: 0.8, y: -30, x: -30 },
        transition: { duration: 0.5, delay: 0.2, ease: "easeOut" }
      },
      mobileOrder: 3
    },

    // 4. Bottom Right (secondary position 2)
    {
      id: 'bottomRight',
      order: 4,
      style: {
        position: 'absolute',
        bottom: '5%',
        right: '5%',
        zIndex: 9
      },
      animation: {
        initial: { opacity: 0, scale: 0.8, y: 30, x: 30 },
        animate: { opacity: 1, scale: 1, y: 0, x: 0 },
        exit: { opacity: 0, scale: 0.8, y: 30, x: 30 },
        transition: { duration: 0.5, delay: 0.3, ease: "easeOut" }
      },
      mobileOrder: 4
    },

    // 5. Left (secondary position 3)
    {
      id: 'left',
      order: 5,
      style: {
        position: 'absolute',
        top: '37%',
        left: '-30%',
        transform: 'translateY(-50%)',
        zIndex: 8
      },
      animation: {
        initial: { opacity: 0, scale: 0.8, x: -50 },
        animate: { opacity: 1, scale: 1, x: 0 },
        exit: { opacity: 0, scale: 0.8, x: -50 },
        transition: { duration: 0.5, delay: 0.4, ease: "easeOut" }
      },
      mobileOrder: 5
    },

    // 6. Right (secondary position 4)
    {
      id: 'right',
      order: 6,
      style: {
        position: 'absolute',
        top: '37%',
        right: '-30%',
        transform: 'translateY(-50%)',
        zIndex: 8
      },
      animation: {
        initial: { opacity: 0, scale: 0.8, x: 50 },
        animate: { opacity: 1, scale: 1, x: 0 },
        exit: { opacity: 0, scale: 0.8, x: 50 },
        transition: { duration: 0.5, delay: 0.5, ease: "easeOut" }
      },
      mobileOrder: 6
    }
  ];

  return {
    container: {
      height: containerHeight,
      maxWidth: containerMaxWidth,
      width: '100%',
      margin: '0 auto',
      padding: '4rem 3rem',
      position: 'relative'
    },
    factCard: {
      style: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
        width: factCardWidth
      }
    },
    positions,
    mobileConfig: {
      container: '',
      cardSpacing: ''
    }
  };
};

export const getOpinionCardPositions = (
  allOpinions: any[],
  showAllOpinions: boolean,
  primaryOpinions: { left: any; right: any }
) => {
  const assignments: Record<string, any> = {};

  if (!showAllOpinions) {
    // Primary layout: only top-right and bottom-left
    assignments.topRight = {
      ...primaryOpinions.left,
      side: 'left',
      isStrongest: true,
      isPrimary: true
    };
    assignments.bottomLeft = {
      ...primaryOpinions.right,
      side: 'right',
      isStrongest: true,
      isPrimary: true
    };
  } else {
    // Secondary layout: fill positions in order
    const positionIds = ['topRight', 'bottomLeft', 'topLeft', 'bottomRight', 'left', 'right'];
    
    allOpinions.slice(0, 6).forEach((opinion, index) => {
      const positionId = positionIds[index];
      if (positionId) {
        assignments[positionId] = {
          opinion: opinion.opinion,
          expertType: opinion.expert_type,
          sourceUrl: undefined,
          side: opinion.isLeft ? 'left' : 'right',
          isStrongest: false,
          isPrimary: false,
          index
        };
      }
    });
  }

  return assignments;
};