'use client';

import React, { useMemo, useEffect } from 'react';
import { useFilterStore } from '@/app/stores/filterStore';
import { useTimelineLoader } from '@/app/hooks/useTimelineLoader';
import SideHotTopic from './SideHotTopic';

interface SideHotTopicsProps {
  isCollapsed: boolean;
  mounted: boolean;
}

const SideHotTopics: React.FC<SideHotTopicsProps> = ({
  isCollapsed,
  mounted,
}) => {
  const { setSelectedTopicId } = useFilterStore();
  const { timelines: availableTimelines, loading, error } = useTimelineLoader(); 

  useEffect(() => {
    setSelectedTopicId(null);
  }, [setSelectedTopicId]);

  const hotTopics = useMemo(() => {
    return availableTimelines.map(dataset => ({
      id: dataset.topic_id || dataset.id,
      title: dataset.title,
      description: dataset.description || '',
      timelineId: dataset.id,
    }));
  }, [availableTimelines]);

  if (!mounted) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="h-12 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-center p-4 text-sm opacity-60">
          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
          Loading topics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-center p-4 text-sm opacity-60 text-red-500">
          ⚠️ Failed to load topics
        </div>
      </div>
    );
  }

  if (availableTimelines.length === 0) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-center p-4 text-sm opacity-60">
          No topics available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {hotTopics.map((topic, index) => (
        <SideHotTopic
          key={topic.id}
          topic={topic}
          isCollapsed={isCollapsed}
          index={index}
        />
      ))}
    </div>
  );
};

export default SideHotTopics;