export interface GridPosition {
  area: string;
  gridColumn: string;
  gridRow: string;
  priority: number;
}

export interface GridConfig {
  container: {
    display: string;
    gridTemplateColumns: string;
    gridTemplateRows: string;
    gap: string;
    width: string;
    maxWidth: string;
    height: string;
    margin: string;
    position: 'relative';
  };
  positions: {
    center: GridPosition;
    topRight: GridPosition;
    bottomLeft: GridPosition;
    topLeft: GridPosition;
    bottomRight: GridPosition;
    left: GridPosition;
    right: GridPosition;
    topCenter?: GridPosition;
    bottomCenter?: GridPosition;
  };
}

// Ideal card order: top right, bottom left, top left, bottom right, left, right
export const CARD_ORDER_PRIORITY = [
  'topRight',
  'bottomLeft', 
  'topLeft',
  'bottomRight',
  'left',
  'right'
] as const;

export const getTimelineEventGridConfig = (
  isMobile: boolean,
  isTablet: boolean,
  isDesktop: boolean,
  cardCount: number
): GridConfig => {
  if (isMobile) {
    // Mobile: Simple column layout
    return {
      container: {
        display: 'flex',
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        width: '100%',
        maxWidth: '400px',
        height: 'auto',
        margin: '0 auto',
        position: 'relative'
      },
      positions: {
        center: { area: 'center', gridColumn: '1', gridRow: '1', priority: 0 },
        topRight: { area: 'topRight', gridColumn: '1', gridRow: '2', priority: 1 },
        bottomLeft: { area: 'bottomLeft', gridColumn: '1', gridRow: '3', priority: 2 },
        topLeft: { area: 'topLeft', gridColumn: '1', gridRow: '4', priority: 3 },
        bottomRight: { area: 'bottomRight', gridColumn: '1', gridRow: '5', priority: 4 },
        left: { area: 'left', gridColumn: '1', gridRow: '6', priority: 5 },
        right: { area: 'right', gridColumn: '1', gridRow: '7', priority: 6 }
      }
    };
  }

  // Desktop/Tablet: Grid layout with expanded width for 6 cards
  const needsExpansion = cardCount > 4;
  const maxWidth = needsExpansion ? '2000px' : isDesktop ? '1500px' : '1000px';
  const columns = needsExpansion ? '5' : '3';
  const gap = isDesktop ? '2rem' : '1.5rem';

  return {
    container: {
      display: 'grid',
      gridTemplateColumns: needsExpansion 
        ? 'minmax(250px, 1fr) minmax(200px, 0.8fr) minmax(300px, 1fr) minmax(200px, 0.8fr) minmax(250px, 1fr)'
        : 'minmax(250px, 1fr) minmax(300px, 1fr) minmax(250px, 1fr)',
      gridTemplateRows: 'minmax(200px, 1fr) minmax(250px, 1fr) minmax(200px, 1fr)',
      gap,
      width: '100%',
      maxWidth,
      height: isDesktop ? '800px' : '600px',
      margin: '0 auto',
      position: 'relative'
    },
    positions: needsExpansion ? {
      // Expanded 5-column layout for 6+ cards
      center: { area: 'center', gridColumn: '3', gridRow: '2', priority: 0 },
      topRight: { area: 'topRight', gridColumn: '4', gridRow: '1', priority: 1 },
      bottomLeft: { area: 'bottomLeft', gridColumn: '2', gridRow: '3', priority: 2 },
      topLeft: { area: 'topLeft', gridColumn: '2', gridRow: '1', priority: 3 },
      bottomRight: { area: 'bottomRight', gridColumn: '4', gridRow: '3', priority: 4 },
      left: { area: 'left', gridColumn: '1', gridRow: '2', priority: 5 },
      right: { area: 'right', gridColumn: '5', gridRow: '2', priority: 6 }
    } : {
      // Standard 3-column layout for ≤4 cards
      center: { area: 'center', gridColumn: '2', gridRow: '2', priority: 0 },
      topRight: { area: 'topRight', gridColumn: '3', gridRow: '1', priority: 1 },
      bottomLeft: { area: 'bottomLeft', gridColumn: '1', gridRow: '3', priority: 2 },
      topLeft: { area: 'topLeft', gridColumn: '1', gridRow: '1', priority: 3 },
      bottomRight: { area: 'bottomRight', gridColumn: '3', gridRow: '3', priority: 4 },
      left: { area: 'left', gridColumn: '1', gridRow: '2', priority: 5 },
      right: { area: 'right', gridColumn: '3', gridRow: '2', priority: 6 }
    }
  };
};

export interface OpinionCardData {
  opinion: string;
  expertType: string;
  sourceUrl?: string;
  side: 'left' | 'right';
  isStrongest: boolean;
  isPrimary: boolean;
  index: number;
  position: keyof GridConfig['positions'];
}

export const mapOpinionsToPositions = (
  primaryOpinions: { left: any; right: any },
  secondaryOpinions: any[],
  showAllOpinions: boolean
): Map<string, OpinionCardData> => {
  const positionMap = new Map<string, OpinionCardData>();

  if (!showAllOpinions) {
    // Primary layout: only show strongest opinions in ideal positions
    if (primaryOpinions.left) {
      positionMap.set('topRight', {
        opinion: primaryOpinions.left.opinion,
        expertType: primaryOpinions.left.type,
        sourceUrl: primaryOpinions.left.source_url,
        side: 'left',
        isStrongest: true,
        isPrimary: true,
        index: 0,
        position: 'topRight'
      });
    }

    if (primaryOpinions.right) {
      positionMap.set('bottomLeft', {
        opinion: primaryOpinions.right.opinion,
        expertType: primaryOpinions.right.type,
        sourceUrl: primaryOpinions.right.source_url,
        side: 'right',
        isStrongest: true,
        isPrimary: true,
        index: 1,
        position: 'bottomLeft'
      });
    }
  } else {
    // Secondary layout: follow ideal order priority
    const allOpinions = [...secondaryOpinions];
    const maxOpinions = Math.min(6, allOpinions.length);

    for (let i = 0; i < maxOpinions; i++) {
      const opinion = allOpinions[i];
      const positionKey = CARD_ORDER_PRIORITY[i];
      
      if (positionKey) {
        positionMap.set(positionKey, {
          opinion: opinion.opinion,
          expertType: opinion.expert_type,
          sourceUrl: opinion.source_url,
          side: opinion.isLeft ? 'left' : 'right',
          isStrongest: false,
          isPrimary: false,
          index: i,
          position: positionKey
        });
      }
    }
  }

  return positionMap;
};