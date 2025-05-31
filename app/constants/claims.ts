  export const mockClaims = [
    { 
      id: '1',
      startTime: 15, 
      endTime: 35, 
      veracity: 'true' as const, 
      text: "Economic growth statistics are accurate according to official sources", 
      confidence: 92 
    },
    { 
      id: '2',
      startTime: 45, 
      endTime: 60, 
      veracity: 'neutral' as const, 
      text: "General policy statement without verifiable claims", 
      confidence: 65 
    },
    { 
      id: '3',
      startTime: 80, 
      endTime: 105, 
      veracity: 'false' as const, 
      text: "Healthcare improvement claims contradict published data", 
      confidence: 88 
    },
    { 
      id: '4',
      startTime: 120, 
      endTime: 150, 
      veracity: 'true' as const, 
      text: "Infrastructure spending figures match government reports", 
      confidence: 95 
    },
    { 
      id: '5',
      startTime: 170, 
      endTime: 188, 
      veracity: 'false' as const, 
      text: "Employment statistics are misrepresented", 
      confidence: 90 
    },
    { 
      id: '6',
      startTime: 200, 
      endTime: 225, 
      veracity: 'neutral' as const, 
      text: "Discussion of future policy plans", 
      confidence: 70 
    }
  ];
