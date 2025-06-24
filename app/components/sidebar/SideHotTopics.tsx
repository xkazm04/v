'use client';

import React, { useMemo, useEffect } from 'react';
import { useFilterStore } from '@/app/stores/filterStore';
import { TIMELINE_DATASETS } from '@/app/stores/useTimelineStore';
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

  useEffect(() => {
    setSelectedTopicId(null);
  }, [setSelectedTopicId]);

  const hotTopics = useMemo(() => {
    return TIMELINE_DATASETS.map(dataset => ({
      id: dataset.topic_id || dataset.id,
      title: dataset.title,
      description: dataset.description || '',
      timelineId: dataset.id,
    }));
  }, []);

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