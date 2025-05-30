import { MetadataItem } from '@/app/components/video/MetadataItem';
import { LAYOUT_CONFIGS } from '@/app/config/layout';
import { formatDuration, formatTimeAgo, formatViewCount } from '@/app/utils/format';
import { Eye, Heart, Clock, Calendar } from 'lucide-react';

type Props = {
    layout: 'grid' | 'list' | 'compact';
    video: {
        views: number;
        likes: number;
        duration: number;
        uploadDate: string;
    };
}

const FeedVideoMetadata = ({layout, video}: Props) => {
    const config = LAYOUT_CONFIGS[layout];
    
    return <>
        <MetadataItem
            icon={<Eye className="h-3 w-3" />}
            text={formatViewCount(video.views)}
            config={config}
        />
        <MetadataItem
            icon={<Heart className="h-3 w-3" />}
            text={formatViewCount(video.likes)}
            config={config}
        />
        {layout === 'list' && (
            <>
                <MetadataItem
                    icon={<Clock className="h-3 w-3" />}
                    text={formatDuration(video.duration)}
                    config={config}
                />
                <MetadataItem
                    icon={<Calendar className="h-3 w-3" />}
                    text={formatTimeAgo(video.uploadDate)}
                    config={config}
                />
            </>
        )}
        {layout !== 'list' && (
            <MetadataItem
                icon={<Calendar className="h-3 w-3" />}
                text={formatTimeAgo(video.uploadDate)}
                className="col-span-2"
                config={config}
            />
        )}
    </>
}

export default FeedVideoMetadata;