'use client';

import React, { useState, useCallback } from 'react';
import { useSSE } from '../../hooks/useSSE';
import { ProcessingUpdate, ProcessingStatus, StatementResult, VideoProcessingRequest } from '../../types/processing';
import { ProgressBar, StatusBadge, ProcessingStep } from './components/Progress';
import { StatementResultsList } from './components/StatementResults';
import YtFormAdvanced from './YtFormAdvanced';
import YtResult from './YtResult';

const UploadVideo: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState<VideoProcessingRequest>({
    url: '',
    speaker_name: '',
    context: 'Political speech or interview',
    language_code: 'en',
    model_id: 'scribe_v1',
    cleanup_audio: true,
    research_statements: true,
  });

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [processingUpdates, setProcessingUpdates] = useState<ProcessingUpdate[]>([]);
  const [statementResults, setStatementResults] = useState<StatementResult[]>([]);
  const [finalResult, setFinalResult] = useState<ProcessingUpdate | null>(null);

  // SSE connection
  const { isConnected, lastUpdate, error: sseError } = useSSE(streamUrl, {
    onUpdate: useCallback((update: ProcessingUpdate) => {
      setProcessingUpdates(prev => [...prev, update]);

      // Handle statement research updates
      if (update.data?.statement_index && update.status === ProcessingStatus.RESEARCHING) {
        const statementResult: StatementResult = {
          statement_index: update.data.statement_index,
          statement_text: update.data.statement_text,
          research_result: update.data.research_result,
          error: update.data.error,
        };

        setStatementResults(prev => {
          const existing = prev.find(r => r.statement_index === statementResult.statement_index);
          if (existing) {
            return prev.map(r => r.statement_index === statementResult.statement_index ? statementResult : r);
          }
          return [...prev, statementResult];
        });
      }
    }, []),
    onComplete: useCallback((finalUpdate: ProcessingUpdate) => {
      setFinalResult(finalUpdate);
      setIsProcessing(false);
    }, []),
    onError: useCallback((error: string) => {
      console.error('SSE Error:', error);
    }, []),
  });

  const handleInputChange = (field: keyof VideoProcessingRequest, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const startProcessing = async () => {
    if (!formData.url.trim()) {
      alert('Please enter a YouTube URL');
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingUpdates([]);
      setStatementResults([]);
      setFinalResult(null);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/yt/process-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const result = await response.json();
      setJobId(result.job_id);
      setStreamUrl(result.stream_url);

    } catch (error) {
      console.error('Failed to start processing:', error);
      alert(`Failed to start processing: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      url: '',
      speaker_name: '',
      context: 'Political speech or interview',
      language_code: 'en',
      model_id: 'scribe_v1',
      cleanup_audio: true,
      research_statements: true,
    });
    setIsProcessing(false);
    setStreamUrl(null);
    setJobId(null);
    setProcessingUpdates([]);
    setStatementResults([]);
    setFinalResult(null);
  };

  const currentStatus = lastUpdate?.status || ProcessingStatus.CREATED;
  const currentProgress = lastUpdate?.progress || 0;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex flex-col">
          <div>https://www.youtube.com/shorts/FlyeD7esY0c</div>
          <div>Donald Trump</div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          YouTube Video Fact-Checker
        </h1>
        <p className="text-gray-600">
          Upload a political speech or interview to automatically extract and fact-check statements
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          {/* YouTube URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube URL *
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isProcessing}
              required
            />
          </div>

          {/* Advanced Options */}
          <YtFormAdvanced
            handleInputChange={handleInputChange}
            formData={formData}
            isProcessing={isProcessing}
          />

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={startProcessing}
              disabled={isProcessing || !formData.url.trim()}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Start Fact-Check Analysis'}
            </button>

            {(isProcessing || finalResult) && (
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Processing Status */}
      {(isProcessing || finalResult) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Processing Status
            </h2>
            <div className="flex items-center space-x-3">
              <StatusBadge status={currentStatus} />
              {sseError && (
                <span className="text-sm text-red-600">
                  Connection: {sseError}
                </span>
              )}
              {isConnected && (
                <span className="text-sm text-green-600">
                  ● Connected
                </span>
              )}
            </div>
          </div>

          <ProgressBar
            progress={currentProgress}
            status={currentStatus}
            className="mb-6"
          />

          {jobId && (
            <div className="text-sm text-gray-500 mb-4">
              Job ID: <span className="font-mono">{jobId}</span>
            </div>
          )}
        </div>
      )}

      {/* Processing Updates */}
      {processingUpdates.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Processing Log
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {processingUpdates.map((update, index) => (
              <ProcessingStep
                key={`${update.job_id}-${index}`}
                update={update}
              />
            ))}
          </div>
        </div>
      )}

      {/* Statement Results */}
      {statementResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Fact-Check Results
          </h2>
          <StatementResultsList results={statementResults} />
        </div>
      )}

      {/* Final Result */}
      {finalResult && (
        <YtResult
          finalResult={finalResult}
          statementResults={statementResults}
        />
      )}
    </div>
  );
};

export default UploadVideo;