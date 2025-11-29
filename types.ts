export interface Clip {
  id: string;
  title: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  summary: string;
  viralScore: number; // 0-100
  tags: string[];
  suggestedPost?: string;
}

export interface VideoProject {
  id: string;
  title: string;
  uploadDate: string;
  duration: string;
  thumbnailUrl: string;
  status: 'processing' | 'ready' | 'error';
  clips?: Clip[];
  transcriptContext?: string; // Simulated transcript or topic for AI context
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum ProcessingState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}
