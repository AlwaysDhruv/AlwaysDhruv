export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Chat {
  _id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatSummary {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}
