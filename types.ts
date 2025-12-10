export enum AppStage {
  UPLOAD = 'UPLOAD',
  ANALYSIS = 'ANALYSIS',
  INTERVIEW = 'INTERVIEW',
  ROADMAP = 'ROADMAP',
  SUMMARY = 'SUMMARY'
}

export type Language = 'en' | 'tr';

export interface RoadmapStep {
  title: string;
  duration: string;
  description: string;
  actionItems: string[];
}

export interface AnalysisResult {
  score: number;
  summary: string;
  detectedRole: string; 
  skillsDetected: string[]; 
  improvements: string[];
  strengths: string[];
  categoryScores: {
    formatting: number; 
    expertise: number;  
    impact: number;     
  };
  missingKeywords: string[]; 
  projectSuggestions: string[]; 
  careerAdvice: string; 
  roadmap: RoadmapStep[]; // New field for the learning path
}

export interface InterviewMessage {
  id: string;
  sender: 'ai' | 'user';
  content: string;
  feedback?: {
    score: number;
    critique: string;
  };
}

export interface InterviewState {
  messages: InterviewMessage[];
  currentQuestionIndex: number;
  isTyping: boolean;
}

export interface FileData {
  mimeType: string;
  data: string;
}