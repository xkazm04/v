import React from 'react';
import { ProcessingStatus, ProcessingUpdate } from '../../../types/processing';

interface ProgressBarProps {
  progress: number;
  status: ProcessingStatus;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, status, className = '' }) => {
  const getProgressColor = (status: ProcessingStatus) => {
    switch (status) {
      case ProcessingStatus.DOWNLOADING:
        return 'bg-blue-500';
      case ProcessingStatus.TRANSCRIBING:
        return 'bg-purple-500';
      case ProcessingStatus.ANALYZING:
        return 'bg-yellow-500';
      case ProcessingStatus.RESEARCHING:
        return 'bg-green-500';
      case ProcessingStatus.COMPLETED:
        return 'bg-green-600';
      case ProcessingStatus.FAILED:
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getProgressBackground = (status: ProcessingStatus) => {
    switch (status) {
      case ProcessingStatus.FAILED:
        return 'bg-red-100';
      case ProcessingStatus.COMPLETED:
        return 'bg-green-100';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full h-3 rounded-full ${getProgressBackground(status)} overflow-hidden`}>
        <div
          className={`h-full transition-all duration-500 ease-out ${getProgressColor(status)} ${
            status === ProcessingStatus.RESEARCHING ? 'animate-pulse' : ''
          }`}
          style={{ width: `${Math.max(progress, 2)}%` }}
        />
      </div>
      <div className="mt-1 text-right text-sm text-gray-600">
        {progress}%
      </div>
    </div>
  );
};

interface StatusBadgeProps {
  status: ProcessingStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusColor = (status: ProcessingStatus) => {
    switch (status) {
      case ProcessingStatus.CREATED:
        return 'bg-gray-100 text-gray-800';
      case ProcessingStatus.DOWNLOADING:
        return 'bg-blue-100 text-blue-800';
      case ProcessingStatus.TRANSCRIBING:
        return 'bg-purple-100 text-purple-800';
      case ProcessingStatus.ANALYZING:
        return 'bg-yellow-100 text-yellow-800';
      case ProcessingStatus.RESEARCHING:
        return 'bg-green-100 text-green-800';
      case ProcessingStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case ProcessingStatus.FAILED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ProcessingStatus) => {
    switch (status) {
      case ProcessingStatus.CREATED:
        return 'Created';
      case ProcessingStatus.DOWNLOADING:
        return 'Downloading';
      case ProcessingStatus.TRANSCRIBING:
        return 'Transcribing';
      case ProcessingStatus.ANALYZING:
        return 'Analyzing';
      case ProcessingStatus.RESEARCHING:
        return 'Researching';
      case ProcessingStatus.COMPLETED:
        return 'Completed';
      case ProcessingStatus.FAILED:
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)} ${className}`}>
      {getStatusText(status)}
    </span>
  );
};

interface ProcessingStepProps {
  update: ProcessingUpdate;
  className?: string;
}

export const ProcessingStep: React.FC<ProcessingStepProps> = ({ update, className = '' }) => {
  const isError = update.status === ProcessingStatus.FAILED || !!update.error;
  const isComplete = update.status === ProcessingStatus.COMPLETED;

  return (
    <div className={`border rounded-lg p-4 ${isError ? 'border-red-200 bg-red-50' : isComplete ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'} ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <StatusBadge status={update.status} />
          <span className="text-sm text-gray-500">
            {new Date(update.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <ProgressBar progress={update.progress} status={update.status} className="w-32" />
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-900">
          {update.step}
        </div>
        <div className="text-sm text-gray-600">
          {update.message}
        </div>
        
        {update.error && (
          <div className="text-sm text-red-600 bg-red-100 p-2 rounded">
            <strong>Error:</strong> {update.error}
          </div>
        )}
        
        {update.data && (
          <div className="text-xs text-gray-500">
            <details className="cursor-pointer">
              <summary className="font-medium">Additional Data</summary>
              <pre className="mt-1 bg-gray-100 p-2 rounded overflow-x-auto">
                {JSON.stringify(update.data, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};