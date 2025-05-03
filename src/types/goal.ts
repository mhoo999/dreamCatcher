export type GoalStatus = 'proposed' | 'accepted' | 'rejected' | 'completed' | 'in_progress';

export interface Goal {
  id: string;
  dream_id: string;
  title: string;
  completed: boolean;
  status: GoalStatus; // goal_status ENUM과 일치
  created_at: string;
  updated_at: string;
} 