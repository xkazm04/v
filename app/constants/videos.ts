import { VideoWithTimestamps, Video, VideoTimestamp, FactCheckData } from "../types/video_api";

// Mock fact-check data
const mockFactChecks: Record<string, FactCheckData> = {
  climate_001: {
    id: "research_climate_001",
    verdict: "This statement is accurate according to NASA temperature records",
    status: "TRUE",
    confidence: 95,
    sources: {
      agreed: {
        count: 8,
        percentage: "8/9",
        references: [
          {
            url: "https://climate.nasa.gov/evidence/",
            title: "NASA Climate Evidence",
            country: "USA",
            category: "GOVERNMENT",
            credibility: "high"
          }
        ],
        countries: ["USA", "UK", "Germany"]
      },
      disagreed: {
        count: 1,
        percentage: "1/9",
        references: [],
        countries: []
      }
    },
    expertAnalysis: {
      nerd: "Temperature data from multiple sources confirms this trend",
      devil: "Some measurement stations may have urban heat island effects",
      critic: "The methodology for global temperature averaging is well-established",
      psychic: "Future warming trends will likely continue this pattern"
    },
    processedAt: new Date("2023-12-01T10:30:00Z")
  },
  energy_001: {
    id: "research_energy_001",
    verdict: "Renewable energy percentage varies by measurement methodology",
    status: "PARTIALLY_TRUE",
    confidence: 88,
    sources: {
      agreed: {
        count: 6,
        percentage: "6/8",
        references: [
          {
            url: "https://www.iea.org/reports/renewable-energy-market-update-june-2023",
            title: "IEA Renewable Energy Update",
            country: "International",
            category: "INTERNATIONAL_ORG",
            credibility: "high"
          }
        ],
        countries: ["International", "USA", "EU"]
      },
      disagreed: {
        count: 2,
        percentage: "2/8",
        references: [],
        countries: []
      }
    },
    processedAt: new Date("2023-12-01T10:40:00Z")
  }
};

export const videos: VideoWithTimestamps[] = [
  {
    video: {
      id: "1dv99v6GRi4",
      video_url: "https://www.youtube.com/watch?v=1dv99v6GRi4",
      source: "youtube",
      researched: true,
      title: "Climate Change Facts and Scientific Evidence",
      verdict: "Comprehensive analysis of climate science with high accuracy",
      duration_seconds: 900,
      speaker_name: "Dr. Sarah Climate",
      language_code: "en",
      audio_extracted: true,
      transcribed: true,
      analyzed: true,
      created_at: "2023-12-01T10:00:00Z",
      updated_at: "2023-12-01T10:30:00Z",
      processed_at: "2023-12-01T10:30:00Z"
    },
    timestamps: [
      {
        startTime: 45,
        endTime: 125,
        statement: "Global average temperatures have risen by 1.1 degrees Celsius since pre-industrial times according to NASA data",
        category: "FACTUAL_CLAIM",
        confidence: 95,
        factCheck: mockFactChecks.climate_001
      },
      {
        startTime: 280,
        endTime: 340,
        statement: "Carbon dioxide levels are at their highest point in 3 million years, reaching over 420 parts per million",
        category: "FACTUAL_CLAIM",
        confidence: 98,
        factCheck: {
          id: "research_climate_002",
          verdict: "CO2 measurements are accurate and well-documented",
          status: "TRUE",
          confidence: 98,
          sources: {
            agreed: { count: 12, percentage: "12/12", references: [], countries: ["USA", "UK", "Japan"] },
            disagreed: { count: 0, percentage: "0/12", references: [], countries: [] }
          },
          processedAt: new Date("2023-12-01T10:35:00Z")
        }
      },
      {
        startTime: 520,
        endTime: 580,
        statement: "Renewable energy sources now account for over 30% of global electricity generation",
        category: "FACTUAL_CLAIM",
        confidence: 88,
        factCheck: mockFactChecks.energy_001
      },
      {
        startTime: 720,
        endTime: 780,
        statement: "Some climate models may be overestimating the rate of sea level rise in certain regions",
        category: "UNCERTAIN_CLAIM",
        confidence: 65,
        factCheck: {
          id: "research_climate_003",
          verdict: "Model accuracy varies by region and methodology",
          status: "UNVERIFIABLE",
          confidence: 65,
          sources: {
            agreed: { count: 3, percentage: "3/7", references: [], countries: [] },
            disagreed: { count: 4, percentage: "4/7", references: [], countries: [] }
          },
          processedAt: new Date("2023-12-01T10:45:00Z")
        }
      }
    ]
  },
  {
    video: {
      id: "dQw4w9WgXcQ",
      video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      source: "youtube",
      researched: true,
      title: "Controversial Health Claims Investigation",
      verdict: "Mixed accuracy with several misleading claims identified",
      duration_seconds: 720,
      speaker_name: "Health Investigator",
      language_code: "en",
      audio_extracted: true,
      transcribed: true,
      analyzed: true,
      created_at: "2023-11-15T14:30:00Z",
      updated_at: "2023-11-15T15:20:00Z",
      processed_at: "2023-11-15T15:20:00Z"
    },
    timestamps: [
      {
        startTime: 30,
        endTime: 95,
        statement: "Drinking 8 glasses of water daily is essential for optimal health and has been proven by scientific studies",
        category: "MISLEADING_CLAIM",
        confidence: 82,
        factCheck: {
          id: "research_hydration_001",
          verdict: "Water needs vary by individual; 8 glasses is not universally required",
          status: "MISLEADING",
          confidence: 82,
          sources: {
            agreed: { count: 2, percentage: "2/8", references: [], countries: [] },
            disagreed: { count: 6, percentage: "6/8", references: [], countries: [] }
          },
          processedAt: new Date("2023-11-15T15:00:00Z")
        }
      },
      {
        startTime: 180,
        endTime: 240,
        statement: "Vitamin C supplements can completely prevent the common cold if taken in high doses",
        category: "FALSE_CLAIM",
        confidence: 91,
        factCheck: {
          id: "research_vitamins_001",
          verdict: "No evidence supports complete cold prevention through vitamin C",
          status: "FALSE",
          confidence: 91,
          sources: {
            agreed: { count: 0, percentage: "0/10", references: [], countries: [] },
            disagreed: { count: 10, percentage: "10/10", references: [], countries: [] }
          },
          processedAt: new Date("2023-11-15T15:05:00Z")
        }
      }
    ]
  },
  {
    video: {
      id: "kJQP7kiw5Fk",
      video_url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
      source: "youtube",
      researched: true,
      title: "Economic Policy Analysis: Inflation and Interest Rates",
      verdict: "Mostly accurate economic data with some contextual issues",
      duration_seconds: 1080,
      speaker_name: "Economic Analyst",
      language_code: "en",
      audio_extracted: true,
      transcribed: true,
      analyzed: true,
      created_at: "2023-12-10T09:00:00Z",
      updated_at: "2023-12-10T09:45:00Z",
      processed_at: "2023-12-10T09:45:00Z"
    },
    timestamps: [
      {
        startTime: 60,
        endTime: 120,
        statement: "The Federal Reserve has raised interest rates 11 times since March 2022 to combat inflation",
        category: "FACTUAL_CLAIM",
        confidence: 99,
        factCheck: {
          id: "research_fed_001",
          verdict: "Federal Reserve rate hike count is accurate",
          status: "TRUE",
          confidence: 99,
          sources: {
            agreed: { count: 15, percentage: "15/15", references: [], countries: [] },
            disagreed: { count: 0, percentage: "0/15", references: [], countries: [] }
          },
          processedAt: new Date("2023-12-10T09:30:00Z")
        }
      }
    ]
  }
];

// Helper functions remain the same but work with corrected types
export const getVideoById = (id: string): VideoWithTimestamps | undefined => {
  return videos.find(video => video.video.id === id);
};

export const getVideosByCategory = (category: string): VideoWithTimestamps[] => {
  return videos.filter(video => {
    return video.timestamps.some(ts => 
      ts.category?.toLowerCase().includes(category.toLowerCase())
    );
  });
};

export const getHighConfidenceVideos = (minConfidence: number = 90): VideoWithTimestamps[] => {
  return videos.filter(video => {
    const avgConfidence = video.timestamps.reduce((sum, ts) => 
      sum + (ts.confidence || 0), 0) / video.timestamps.length;
    return avgConfidence >= minConfidence;
  });
};

export const getTimestampStats = (videoData: VideoWithTimestamps) => {
  const { timestamps } = videoData;
  
  if (timestamps.length === 0) {
    return {
      totalClaims: 0,
      factualClaims: 0,
      misleadingClaims: 0,
      falseClaims: 0,
      uncertainClaims: 0,
      averageConfidence: 0,
      totalDuration: 0
    };
  }

  const categoryCounts = timestamps.reduce((acc, ts) => {
    const category = ts.category || 'UNCERTAIN_CLAIM';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalDuration = timestamps.reduce((sum, ts) => 
    sum + (ts.endTime - ts.startTime), 0);

  const averageConfidence = timestamps.reduce((sum, ts) => 
    sum + (ts.confidence || 0), 0) / timestamps.length;

  return {
    totalClaims: timestamps.length,
    factualClaims: categoryCounts['FACTUAL_CLAIM'] || 0,
    misleadingClaims: categoryCounts['MISLEADING_CLAIM'] || 0,
    falseClaims: categoryCounts['FALSE_CLAIM'] || 0,
    uncertainClaims: categoryCounts['UNCERTAIN_CLAIM'] || 0,
    averageConfidence: Math.round(averageConfidence),
    totalDuration: Math.round(totalDuration)
  };
};

export default videos;