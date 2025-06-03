export interface ProcessingUpdate {
  type: string;
  job_id: string;
  video_id?: string;
  status: ProcessingStatus;
  step: string;
  progress: number;
  message: string;
  data?: Record<string, any>;
  timestamp: string;
  error?: string;
}

export enum ProcessingStatus {
  CREATED = "created",
  DOWNLOADING = "downloading", 
  TRANSCRIBING = "transcribing",
  ANALYZING = "analyzing",
  RESEARCHING = "researching",
  COMPLETED = "completed",
  FAILED = "failed"
}

export interface StatementResult {
  statement_index: number;
  statement_text: string;
  research_result?: {
    verdict: string;
    status: string;
    correction?: string;
    database_id?: string;
  };
  error?: string;
}

export interface VideoProcessingRequest {
  url: string;
  speaker_name?: string;
  context?: string;
  language_code?: string;
  model_id?: string;
  cleanup_audio?: boolean;
  research_statements?: boolean;
}

export interface VideoProcessingResponse {
  job_id: string;
  stream_url: string;
  message: string;
}