'use client';

import { memo } from 'react';
import { ResearchResult } from '@/app/types/article';
import { LLMResearchResponse } from '@/app/types/research';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { Calendar, Globe, User, Database } from 'lucide-react';

interface FactCheckMetadataProps {
  research: ResearchResult;
  displayResult: LLMResearchResponse;
}

const FactCheckMetadata = memo(function FactCheckMetadata({
  research,
  displayResult
}: FactCheckMetadataProps) {
  const { colors } = useLayoutTheme();

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown date';
    }
  };

  const metadataItems = [
    {
      icon: <Database className="w-4 h-4" />,
      label: 'Research ID',
      value: research.id
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: 'Statement Date',
      value: research.statement_date ? formatDate(research.statement_date) : 'Not specified'
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: 'Processed',
      value: formatDate(research.processed_at)
    },
    {
      icon: <Globe className="w-4 h-4" />,
      label: 'Country',
      value: research.country || 'Unknown'
    },
    {
      icon: <User className="w-4 h-4" />,
      label: 'Profile ID',
      value: research.profileId || 'Anonymous'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metadataItems.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg border"
            style={{
              backgroundColor: `${colors.muted}50`,
              borderColor: colors.border
            }}
          >
            <div style={{ color: colors.mutedForeground }}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-sm font-medium"
                style={{ color: colors.foreground }}
              >
                {item.label}
              </div>
              <div
                className="text-sm truncate"
                style={{ color: colors.mutedForeground }}
                title={item.value}
              >
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Source Information */}
      <div
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: `${colors.muted}30`,
          borderColor: colors.border
        }}
      >
        <h4
          className="text-sm font-medium mb-2 flex items-center gap-2"
          style={{ color: colors.foreground }}
        >
          <Database className="w-4 h-4" />
          Original Statement
        </h4>
        <p
          className="text-sm leading-relaxed"
          style={{ color: colors.mutedForeground }}
        >
          {research.statement}
        </p>
        {research.context && (
          <>
            <h5
              className="text-sm font-medium mt-3 mb-1"
              style={{ color: colors.foreground }}
            >
              Context
            </h5>
            <p
              className="text-sm leading-relaxed"
              style={{ color: colors.mutedForeground }}
            >
              {research.context}
            </p>
          </>
        )}
      </div>
    </div>
  );
});

export default FactCheckMetadata;