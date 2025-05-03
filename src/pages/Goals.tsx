import React, { useEffect, useState } from 'react';
import { fetchAllGoals } from '../services/supabase';
import { Goal } from '../types/goal';
import GoalList from '../components/common/GoalList';

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
      ) : (
        <GoalList goals={goals} />
      )}
    </div>
  );
};

export default Goals; 