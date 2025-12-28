
export interface ReferenceBook {
  id: string;
  title: string;
  subject: string;
  totalChapters: number;
  completedChapters: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lastStudied: string;
  coverImage?: string; // Base64 or URL
}

export interface StudySession {
  id: string;
  bookId: string;
  durationMinutes: number;
  date: string;
  notes: string;
}

export interface MotivationMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  image?: string; // Attachment for visual context
}

export interface DailyProgress {
  date: string;
  minutes: number;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  createdAt: string;
}

export interface RoadmapStep {
  id: string;
  label: string;
  description: string;
  requiredBooks: string[];
  level: number; // 0 to 100
}
