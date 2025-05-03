export interface Dream {
  id: string;
  title: string;
  description: string;
  deadline?: string; // ISO 날짜 문자열
  created_at: string;
  updated_at: string;
  user_id: string;
  goals: DreamGoal[];
}

export interface DreamGoal {
  id: string;
  dream_id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
} 