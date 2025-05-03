import React from 'react';
import { Goal } from '../../types/goal';

interface GoalCardProps {
  goal: Goal;
  onToggleCompleted?: (goal: Goal) => void;
}

const statusColor = {
  proposed: 'bg-gray-300 text-gray-700',
  in_progress: 'bg-blue-200 text-blue-800',
  completed: 'bg-green-200 text-green-800',
  accepted: 'bg-purple-200 text-purple-800',
  rejected: 'bg-red-200 text-red-800',
};

export default function GoalCard({ goal, onToggleCompleted }: GoalCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center gap-4 mb-3">
      <input
        type="checkbox"
        checked={goal.completed}
        onChange={() => onToggleCompleted && onToggleCompleted(goal)}
        className="w-5 h-5 accent-primary"
      />
      <div className="flex-1">
        <div className="font-medium text-base line-clamp-2 mb-1 {goal.completed ? 'line-through text-gray-400' : ''}">{goal.title}</div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2 py-0.5 rounded ${statusColor[goal.status] || 'bg-gray-200 text-gray-700'}`}>{goal.status}</span>
          <span className="text-gray-400">{goal.created_at?.slice(0, 10)}</span>
        </div>
      </div>
    </div>
  );
} 