import React, { useEffect, useState } from 'react';
import { fetchAllGoals, createGoal, updateGoal, deleteGoal } from '../services/supabase';
import { Goal } from '../types/goal';
import GoalList from '../components/common/GoalList';
import { supabase } from '../services/supabase';

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [goalUpdating, setGoalUpdating] = useState<string | null>(null);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [adding, setAdding] = useState(false);

  const loadGoals = async () => {
    try {
      const data = await fetchAllGoals();
      setGoals(data);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  // 목표 완료 상태 토글 핸들러
  const handleToggleCompleted = async (goal: Goal) => {
    if (!goal || !goal.id) return;
    setGoalUpdating(goal.id);
    const { error } = await supabase
      .from('goals')
      .update({ completed: !goal.completed })
      .eq('id', goal.id);
    setGoalUpdating(null);
    if (!error) {
      loadGoals(); // 상태 변경 후 새로고침
    } else {
      alert('목표 상태 변경에 실패했습니다.');
    }
  };

  // 목표 추가 핸들러
  const handleAddGoal = async () => {
    if (!newGoalTitle.trim()) return;
    setAdding(true);
    try {
      await createGoal({
        title: newGoalTitle.trim(),
        completed: false,
        status: 'proposed',
        dream_id: '', // 필요시 연결
      } as any);
      setNewGoalTitle('');
      loadGoals();
    } catch (e) {
      alert('목표 추가에 실패했습니다.');
    } finally {
      setAdding(false);
    }
  };

  // 목표 수정 핸들러
  const handleEditGoal = async (goal: Goal, updates: Partial<Goal>) => {
    try {
      await updateGoal(goal.id, updates);
      loadGoals();
    } catch (e) {
      alert('목표 수정에 실패했습니다.');
    }
  };

  // 목표 삭제 핸들러
  const handleDeleteGoal = async (goal: Goal) => {
    if (!window.confirm('정말로 이 목표를 삭제하시겠습니까?')) return;
    try {
      await deleteGoal(goal.id);
      loadGoals();
    } catch (e) {
      alert('목표 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="w-full px-4 py-8 flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-2xl font-bold mb-6">모든 목표</h1>
      <div className="w-full max-w-[430px] mb-6 flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 text-base"
          placeholder="새 목표 입력"
          value={newGoalTitle}
          onChange={e => setNewGoalTitle(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleAddGoal(); }}
          disabled={adding}
        />
        <button
          className="bg-primary text-white font-bold rounded px-4 py-2 disabled:opacity-60"
          onClick={handleAddGoal}
          disabled={adding || !newGoalTitle.trim()}
        >
          추가
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">로딩 중...</div>
      ) : (
        <>
          <GoalList
            goals={goals}
            onToggleCompleted={handleToggleCompleted}
            onEdit={handleEditGoal}
            onDelete={handleDeleteGoal}
          />
          {goalUpdating && <div className="text-xs text-blue-500 mt-2">상태 변경 중...</div>}
        </>
      )}
    </div>
  );
};

export default Goals; 