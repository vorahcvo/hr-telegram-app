export type TabType = 'applications' | 'sources' | 'training' | 'profile';

export interface User {
  id: string;
  user_id: number;
  name: string;
  username: string | null;
  avatar: string | null;
  inn: string | null;
  corporate_card: string | null;
  account_number: string | null;
  bik: string | null;
}

export interface Application {
  id: string;
  fullName: string;
  phone: string;
  date: string;
  status: 'registered' | 'in_progress' | 'rejected' | 'contacted';
  source: string;
  comment: string | null;
}

export interface Source {
  id: string;
  name: string;
  status: 'active' | 'moderation' | 'blocked';
  url: string | null;
  isDefault: boolean;
  applicationsCount: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  content: string;
  completed: boolean;
}