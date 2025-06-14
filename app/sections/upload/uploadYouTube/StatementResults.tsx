import React from 'react';
import { StatementResult } from '../../../types/processing';

interface StatementResultCardProps {
  result: StatementResult;
  className?: string;
}

export const StatementResultCard: React.FC<StatementResultCardProps> = ({ result, className = '' }) => {
  const getVerdictColor = (verdict: string) => {
    const lowerVerdict = verdict.toLowerCase();
    if (lowerVerdict.includes('true') || lowerVerdict.includes('correct')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (lowerVerdict.includes('false') || lowerVerdict.includes('incorrect')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    if (lowerVerdict.includes('mostly') || lowerVerdict.includes('partially')) {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('verified') || lowerStatus.includes('true')) {
      return 'bg-blue-100 text-blue-800';
    }
    if (lowerStatus.includes('false') || lowerStatus.includes('debunked')) {
      return 'bg-red-100 text-red-800';
    }
    if (lowerStatus.includes('unverifiable')) {
      return 'bg-gray-100 text-gray-800';
    }
    return 'bg-purple-100 text-purple-800';
  };

  return (
    <div className={`border rounded-lg p-4 space-y-3 ${result.error ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'} ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-500">
            Statement #{result.statement_index}
          </span>
          {result.research_result && (
            <>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.research_result.status)}`}>
                {result.research_result.status}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getVerdictColor(result.research_result.verdict)}`}>
                {result.research_result.verdict}
              </span>
            </>
          )}
        </div>
        {result.research_result?.database_id && (
          <span className="text-xs text-gray-400 font-mono">
            ID: {result.research_result.database_id.slice(0, 8)}...
          </span>
        )}
      </div>

      {/* Statement Text */}
      <div className="text-sm text-gray-900">
        <div className="font-medium mb-1">Statement:</div>
        <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
          "{result.statement_text}"
        </div>
      </div>

      {/* Research Result */}
      {result.research_result && (
        <div className="space-y-2">
          {result.research_result.correction && (
            <div className="text-sm">
              <div className="font-medium text-gray-700 mb-1">Correction:</div>
              <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-500 text-gray-900">
                {result.research_result.correction}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {result.error && (
        <div className="text-sm">
          <div className="font-medium text-red-700 mb-1">Error:</div>
          <div className="bg-red-100 p-3 rounded border-l-4 border-red-500 text-red-800">
            {result.error}
          </div>
        </div>
      )}
    </div>
  );
};

interface StatementResultsListProps {
  results: StatementResult[];
  className?: string;
}

export const StatementResultsList: React.FC<StatementResultsListProps> = ({ results, className = '' }) => {
  if (results.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        No statement results yet. Research will appear here as it completes.
      </div>
    );
  }

  const completedCount = results.filter(r => r.research_result || r.error).length;

  return (
    <div className={className}>
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-sm font-medium text-blue-900">
          Research Progress: {completedCount} of {results.length} statements completed
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / results.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {results.map((result, index) => (
          <StatementResultCard 
            key={`statement-${result.statement_index || index}`} 
            result={result} 
          />
        ))}
      </div>
    </div>
  );
};