import { VideoWithTimestamps, Video, VideoTimestamp } from "../types/video_api";

export const videos: VideoWithTimestamps[] = [
    {
        video: {
            id: "vid_001",
            title: "Climate Change Facts and Scientific Evidence",
            description: "A comprehensive look at climate change science and evidence from leading researchers worldwide.",
            video_url: "https://www.youtube.com/watch?v=1dv99v6GRi4",
            thumbnail_url: "https://via.placeholder.com/1280x720/0066cc/ffffff?text=Climate+Science",
            duration_seconds: 900, // 15 minutes
            upload_date: "2023-12-01T10:00:00Z",
            channel_name: "Science Explained",
            category: "Education",
            view_count: 125000,
            like_count: 8500,
            language: "en",
            transcript: "Welcome to today's discussion on climate change science...",
            created_at: "2023-12-01T10:00:00Z",
            updated_at: "2023-12-01T10:00:00Z"
        },
        timestamps: [
            {
                id: "ts_001",
                video_id: "vid_001",
                time_from_seconds: 45,
                time_to_seconds: 125,
                statement: "Global average temperatures have risen by 1.1 degrees Celsius since pre-industrial times according to NASA data",
                category: "FACTUAL_CLAIM",
                confidence_score: 95,
                research_id: "research_climate_001",
                created_at: "2023-12-01T10:30:00Z",
                updated_at: "2023-12-01T10:30:00Z"
            },
            {
                id: "ts_002",
                video_id: "vid_001",
                time_from_seconds: 280,
                time_to_seconds: 340,
                statement: "Carbon dioxide levels are at their highest point in 3 million years, reaching over 420 parts per million",
                category: "FACTUAL_CLAIM",
                confidence_score: 98,
                research_id: "research_climate_002",
                created_at: "2023-12-01T10:35:00Z",
                updated_at: "2023-12-01T10:35:00Z"
            },
            {
                id: "ts_003",
                video_id: "vid_001",
                time_from_seconds: 520,
                time_to_seconds: 580,
                statement: "Renewable energy sources now account for over 30% of global electricity generation",
                category: "FACTUAL_CLAIM",
                confidence_score: 88,
                research_id: "research_energy_001",
                created_at: "2023-12-01T10:40:00Z",
                updated_at: "2023-12-01T10:40:00Z"
            },
            {
                id: "ts_004",
                video_id: "vid_001",
                time_from_seconds: 720,
                time_to_seconds: 780,
                statement: "Some climate models may be overestimating the rate of sea level rise in certain regions",
                category: "UNCERTAIN_CLAIM",
                confidence_score: 65,
                research_id: "research_climate_003",
                created_at: "2023-12-01T10:45:00Z",
                updated_at: "2023-12-01T10:45:00Z"
            }
        ]
    },
    {
        video: {
            id: "vid_002",
            title: "Controversial Health Claims Investigation",
            description: "Examining popular health claims and their scientific validity through evidence-based research.",
            video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            thumbnail_url: "https://via.placeholder.com/1280x720/cc6600/ffffff?text=Health+Claims",
            duration_seconds: 720, // 12 minutes
            upload_date: "2023-11-15T14:30:00Z",
            channel_name: "Health Truth",
            category: "Education",
            view_count: 45000,
            like_count: 2100,
            language: "en",
            transcript: "Today we're investigating some of the most common health claims...",
            created_at: "2023-11-15T14:30:00Z",
            updated_at: "2023-11-15T14:30:00Z"
        },
        timestamps: [
            {
                id: "ts_005",
                video_id: "vid_002",
                time_from_seconds: 30,
                time_to_seconds: 95,
                statement: "Drinking 8 glasses of water daily is essential for optimal health and has been proven by scientific studies",
                category: "MISLEADING_CLAIM",
                confidence_score: 82,
                research_id: "research_hydration_001",
                created_at: "2023-11-15T15:00:00Z",
                updated_at: "2023-11-15T15:00:00Z"
            },
            {
                id: "ts_006",
                video_id: "vid_002",
                time_from_seconds: 180,
                time_to_seconds: 240,
                statement: "Vitamin C supplements can completely prevent the common cold if taken in high doses",
                category: "FALSE_CLAIM",
                confidence_score: 91,
                research_id: "research_vitamins_001",
                created_at: "2023-11-15T15:05:00Z",
                updated_at: "2023-11-15T15:05:00Z"
            },
            {
                id: "ts_007",
                video_id: "vid_002",
                time_from_seconds: 320,
                time_to_seconds: 380,
                statement: "Regular exercise has been shown to reduce the risk of cardiovascular disease by up to 35%",
                category: "FACTUAL_CLAIM",
                confidence_score: 94,
                research_id: "research_exercise_001",
                created_at: "2023-11-15T15:10:00Z",
                updated_at: "2023-11-15T15:10:00Z"
            },
            {
                id: "ts_008",
                video_id: "vid_002",
                time_from_seconds: 480,
                time_to_seconds: 540,
                statement: "Detox diets can remove all toxins from your body in just 7 days",
                category: "FALSE_CLAIM",
                confidence_score: 96,
                research_id: "research_detox_001",
                created_at: "2023-11-15T15:15:00Z",
                updated_at: "2023-11-15T15:15:00Z"
            },
            {
                id: "ts_009",
                video_id: "vid_002",
                time_from_seconds: 600,
                time_to_seconds: 680,
                statement: "The Mediterranean diet has been associated with improved cognitive function in older adults",
                category: "FACTUAL_CLAIM",
                confidence_score: 87,
                research_id: "research_diet_001",
                created_at: "2023-11-15T15:20:00Z",
                updated_at: "2023-11-15T15:20:00Z"
            }
        ]
    },
    {
        video: {
            id: "vid_003",
            title: "Economic Policy Analysis: Inflation and Interest Rates",
            description: "Breaking down recent economic policies and their impact on inflation and interest rates.",
            video_url: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
            thumbnail_url: "https://via.placeholder.com/1280x720/009966/ffffff?text=Economic+Analysis",
            duration_seconds: 1080, // 18 minutes
            upload_date: "2023-12-10T09:00:00Z",
            channel_name: "Economic Insights",
            category: "News",
            view_count: 78000,
            like_count: 4200,
            language: "en",
            transcript: "Let's examine the latest economic data and policy decisions...",
            created_at: "2023-12-10T09:00:00Z",
            updated_at: "2023-12-10T09:00:00Z"
        },
        timestamps: [
            {
                id: "ts_010",
                video_id: "vid_003",
                time_from_seconds: 60,
                time_to_seconds: 120,
                statement: "The Federal Reserve has raised interest rates 11 times since March 2022 to combat inflation",
                category: "FACTUAL_CLAIM",
                confidence_score: 99,
                research_id: "research_fed_001",
                created_at: "2023-12-10T09:30:00Z",
                updated_at: "2023-12-10T09:30:00Z"
            },
            {
                id: "ts_011",
                video_id: "vid_003",
                time_from_seconds: 300,
                time_to_seconds: 360,
                statement: "Current inflation rates are directly comparable to the hyperinflation experienced in Germany during the 1920s",
                category: "MISLEADING_CLAIM",
                confidence_score: 85,
                research_id: "research_inflation_001",
                created_at: "2023-12-10T09:35:00Z",
                updated_at: "2023-12-10T09:35:00Z"
            },
            {
                id: "ts_012",
                video_id: "vid_003",
                time_from_seconds: 540,
                time_to_seconds: 600,
                statement: "Housing prices have increased by an average of 15% annually over the past three years",
                category: "FACTUAL_CLAIM",
                confidence_score: 92,
                research_id: "research_housing_001",
                created_at: "2023-12-10T09:40:00Z",
                updated_at: "2023-12-10T09:40:00Z"
            },
            {
                id: "ts_013",
                video_id: "vid_003",
                time_from_seconds: 780,
                time_to_seconds: 840,
                statement: "Lower interest rates always lead to increased consumer spending and economic growth",
                category: "UNCERTAIN_CLAIM",
                confidence_score: 68,
                research_id: "research_economics_001",
                created_at: "2023-12-10T09:45:00Z",
                updated_at: "2023-12-10T09:45:00Z"
            }
        ]
    }
];

// Helper function to get video by ID
export const getVideoById = (id: string): VideoWithTimestamps | undefined => {
    return videos.find(video => video.video.id === id);
};

// Helper function to get all videos for a specific category
export const getVideosByCategory = (category: string): VideoWithTimestamps[] => {
    return videos.filter(video => video.video.category.toLowerCase() === category.toLowerCase());
};

// Helper function to get videos with high confidence fact checks
export const getHighConfidenceVideos = (minConfidence: number = 90): VideoWithTimestamps[] => {
    return videos.filter(video => {
        const avgConfidence = video.timestamps.reduce((sum, ts) => 
            sum + (ts.confidence_score || 0), 0) / video.timestamps.length;
        return avgConfidence >= minConfidence;
    });
};

// Helper function to get timestamp statistics for a video
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
        sum + (ts.time_to_seconds - ts.time_from_seconds), 0);

    const averageConfidence = timestamps.reduce((sum, ts) => 
        sum + (ts.confidence_score || 0), 0) / timestamps.length;

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

// Export default for backward compatibility
export default videos;