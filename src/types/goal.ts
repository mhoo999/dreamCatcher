export interface Goal {
  id: string;
  dream_id: string;
  user_id: string;
  title: string;
  completed: boolean;
  status: 'proposed' | 'accepted' | 'rejected' | 'completed';
  created_at: string;
  updated_at: string;
} 