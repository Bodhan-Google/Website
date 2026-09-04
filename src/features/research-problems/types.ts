export type Priority = 'HIGH' | 'MEDIUM' | 'CRITICAL' | '';
export type VerticalTheme =
  | 'orange'
  | 'teal'
  | 'purple'
  | 'yellow'
  | 'blue'
  | 'red'
  | 'indigo'
  | 'green'
  | 'aqua'
  | 'cyan'
  | 'magenta'
  | 'amber'
  | 'rose';

export interface ResearchOutcome {
  id: string; // e.g., "O1"
  title: string;
  description: string;
  tags: string[];
  priority: Priority;
}

export interface ResearchProblem {
  id: string; // e.g., "4.1.1"
  title: string;
  description: string;
  outcomes: ResearchOutcome[];
}

export interface ResearchVertical {
  id: string; // e.g., "asr"
  title: string; // e.g., "Speech Recognition"
  shortTitle?: string; // e.g. "ASR"
  description: string;
  iconName: string; 
  theme: VerticalTheme;
  problemCount: number; // For display purposes (e.g. "35 Problems")
  tags: string[];
  problems: ResearchProblem[];
}

export interface Pillar {
  title: string;
  description: string;
  points: string[];
}

export interface Principle {
  id: string;
  title: string;
  description: string;
}

export interface GrandChallenge {
  id: string;
  vertical: string;
  title: string;
  description: string;
  theme: VerticalTheme;
  iconName: string;
}
