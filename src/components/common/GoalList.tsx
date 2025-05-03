import React from 'react';
import { Goal } from '../../types/goal';
import GoalCard from './GoalCard';

interface GoalListProps {
  goals: Goal[];
  onToggleCompleted?: (goal: Goal) => void;
}

export default function GoalList({ goals, onToggleCompleted }: GoalListProps) {
  if (!goals || goals.length === 0) {
    return <div className="text-gray-400 text-center py-8">아직 목표가 없습니다.</div>;
  }
  return (
    <div>
      {goals.map(goal => (
        <GoalCard key={goal.id} goal={goal} onToggleCompleted={onToggleCompleted} />
      ))}
    </div>
  );
} 