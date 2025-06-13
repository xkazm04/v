'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CardContent } from '../../components/ui/card';
import { useLayoutTheme } from '@/app/hooks/use-layout-theme';
import { Label } from '@/app/components/ui/label';
import { Video, Play, RotateCcw, YoutubeIcon } from 'lucide-react';
import { useSSE } from '../../hooks/useSSE';
import { ProcessingUpdate, ProcessingStatus, StatementResult, VideoProcessingRequest } from '../../types/processing';
import { ProgressBar, StatusBadge, ProcessingStep } from './components/Progress';
import { StatementResultsList } from './components/StatementResults';
import YtFormAdvanced from './YtFormAdvanced';
import YtResult from './YtResult';

const containerVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1
    }
  }
};

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

const UploadVideo: React.FC = () => {
  const { colors, isDark } = useLayoutTheme();

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

  const inputStyle = () => ({
    background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    color: colors.foreground,
    borderColor: isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.5)',
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <CardContent className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
        {/* Header */}
        <motion.div
          variants={fieldVariants}
          className="text-center mb-8"
        >          

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-600 bg-clip-text text-transparent mb-2">
            YouTube Video Analysis
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground font-normal max-w-md mx-auto leading-relaxed">
            Extract and fact-check statements from YouTube videos
          </p>

        </motion.div>

        {/* Form */}
        <form className="space-y-6">
          {/* YouTube URL */}
          <motion.div
            variants={fieldVariants}
            className="space-y-3"
          >
            <Label
              htmlFor="youtube-url"
              className="flex items-center gap-2 text-sm sm:text-base font-semibold"
              style={{ color: colors.foreground }}
            >
              <Video className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span>YouTube URL *</span>
            </Label>
            <input
              id="youtube-url"
              type="url"
              value={formData.url}
              onChange={(e) => handleInputChange('url', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full outline-none h-12 sm:h-14 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 text-sm sm:text-base"
              style={inputStyle()}
              disabled={isProcessing}
              required
            />
          </motion.div>

          {/* Advanced Options */}
          <motion.div variants={fieldVariants}>
            <YtFormAdvanced
              handleInputChange={handleInputChange}
              formData={formData}
              isProcessing={isProcessing}
            />
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={fieldVariants}
            className="flex flex-col sm:flex-row gap-3"
          >
            <motion.button
              type="button"
              onClick={startProcessing}
              disabled={isProcessing || !formData.url.trim()}
              className="flex-1 h-12 sm:h-14 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 relative overflow-hidden group border-0 flex items-center justify-center gap-2 sm:gap-3"
              style={{
                background: (isProcessing || !formData.url.trim())
                  ? isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.5)'
                  : `linear-gradient(135deg, 
                      rgba(239, 68, 68, 0.9) 0%,
                      rgba(220, 38, 38, 0.9) 50%,
                      rgba(185, 28, 28, 0.9) 100%
                    )`,
                color: (isProcessing || !formData.url.trim()) ? colors.mutedForeground : 'white',
                boxShadow: (isProcessing || !formData.url.trim())
                  ? 'none'
                  : '0 8px 25px -8px rgba(239, 68, 68, 0.5)',
                cursor: (isProcessing || !formData.url.trim()) ? 'not-allowed' : 'pointer'
              }}
              whileHover={!(isProcessing || !formData.url.trim()) ? { scale: 1.02 } : {}}
              whileTap={!(isProcessing || !formData.url.trim()) ? { scale: 0.98 } : {}}
            >
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Video className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.div>
                  <span className="hidden sm:inline">Processing Video...</span>
                  <span className="sm:hidden">Processing...</span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="hidden sm:inline">Start Video Analysis</span>
                  <span className="sm:hidden">Start Analysis</span>
                </>
              )}
            </motion.button>

            {(isProcessing || finalResult) && (
              <motion.button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 h-12 sm:h-14 rounded-xl border-2 font-medium transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  borderColor: isDark ? 'rgba(71, 85, 105, 0.4)' : 'rgba(226, 232, 240, 0.5)',
                  background: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                  color: colors.foreground
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Reset</span>
              </motion.button>
            )}
          </motion.div>
        </form>

        {/* Processing Status */}
        {(isProcessing || finalResult) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold" style={{ color: colors.foreground }}>
                Processing Status
              </h2>
              <div className="flex items-center space-x-3">
                <StatusBadge status={currentStatus} />
                {sseError && (
                  <span className="text-sm text-red-500">
                    Connection: {sseError}
                  </span>
                )}
                {isConnected && (
                  <span className="text-sm text-green-500">
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
              <div className="text-sm opacity-70 font-mono" style={{ color: colors.mutedForeground }}>
                Job ID: {jobId}
              </div>
            )}
          </motion.div>
        )}

        {/* Processing Updates */}
        {processingUpdates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.foreground }}>
              Processing Log
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {processingUpdates.map((update, index) => (
                <ProcessingStep
                  key={`${update.job_id}-${index}`}
                  update={update}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Statement Results */}
        {statementResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.foreground }}>
              Fact-Check Results
            </h3>
            <StatementResultsList results={statementResults} />
          </motion.div>
        )}

        {/* Final Result */}
        {finalResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <YtResult
              finalResult={finalResult}
              statementResults={statementResults}
            />
          </motion.div>
        )}
      </CardContent>
    </motion.div>
  );
};

export default UploadVideo;