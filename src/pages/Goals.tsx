import React, { useEffect, useState } from 'react';
import { fetchAllGoals } from '../services/supabase';
import { Goal } from '../types/goal';

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGoals() {
      try {
        const data = await fetchAllGoals();
        setGoals(data);
      } catch (error) {
        console.error('Failed to load goals:', error);
      } finally {
        setLoading(false);
      }
    }
    loadGoals();
  }, []);

  return (
    <div className="max-w-[430px] mx-auto w-full px-4 py-8 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-6">모든 목표</h1>
      {loading ? (
        <div className="flex justify-center py-12">로딩 중...</div>
      ) : goals.length === 0 ? (
        <div className="text-center text-gray-400 py-12">아직 등록된 목표가 없습니다.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map(goal => (
            <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
              <h3 className="font-semibold text-lg mb-2 truncate">{goal.title}</h3>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>상태: {goal.status}</span>
                <span>생성일: {goal.created_at?.slice(0,10)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${goal.completed ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                <span className={goal.completed ? 'line-through text-gray-400' : ''}>{goal.completed ? '완료' : '진행중'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Goals; 