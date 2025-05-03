import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { fetchAllGoals } from '../services/supabase';
import { Goal } from '../types/goal';

const Goals: React.FC = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchGoals = () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError('목표 목록을 불러오지 못했습니다: ' + error.message);
          setGoals([]);
        } else {
          setGoals(
            (data || []).map(g => ({
              ...g,
              date: g.created_at ? g.created_at.slice(0, 10) : '',
            }))
          );
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGoals();
    // eslint-disable-next-line
  }, [user]);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAddSuccess(false);
    if (!user) {
      setAddError('로그인이 필요합니다.');
      return;
    }
    if (!title.trim() || !description.trim()) {
      setAddError('제목과 설명을 입력하세요.');
      return;
    }
    const { error } = await supabase.from('goals').insert([
      {
        user_id: user.id,
        title,
        description,
        status: 'active',
      }
    ]);
    if (error) {
      setAddError('저장 실패: ' + error.message);
    } else {
      setAddSuccess(true);
      setTitle('');
      setDescription('');
      fetchGoals();
    }
  };

  const handleComplete = async (goalId: number) => {
    setUpdatingId(goalId);
    await supabase.from('goals').update({ status: 'done' }).eq('id', goalId);
    setUpdatingId(null);
    fetchGoals();
  };

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
    <div className="container mx-auto px-4 py-8 max-w-app">
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