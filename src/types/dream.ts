import { Goal } from './goal';

export interface Dream {
  id: string;
  user_id: string;
  title: string;
  description: string;
  deadline?: string; // ISO 날짜 문자열
  created_at: string;
  updated_at: string;
  goals: Goal[];
} 