
export interface User {
  id: string;
  email: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string | AnalysisSection[];
  sources?: Source[];
  timestamp: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  messages: Message[];
  created_at: string;
}

export interface AnalysisSection {
    id: string;
    title: string;
    content: string;
}

export interface Source {
    uri: string;
    title: string;
}

export interface ParsedGeminiResponse {
    sections: AnalysisSection[];
    sources: Source[];
}
