import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Goal {
  id: number;
  title: string;
  description: string;
  status: string;
  date: string;
}

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

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-app px-4">
        <Card className="mb-4">
          <h2 className="text-lg font-semibold text-primary mb-2">새 목표 추가</h2>
          <form className="flex flex-col gap-2" onSubmit={handleAddGoal}>
            <input
              type="text"
              className="border rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="목표 제목"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <textarea
              className="border rounded-lg px-3 py-2 text-base min-h-[60px] focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="목표 설명"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-gradient-to-br from-primary to-secondary text-white font-bold rounded-lg py-2 mt-2 shadow-card hover:opacity-90 transition"
            >
              저장하기
            </button>
          </form>
          {addSuccess && <div className="text-green-500 mt-2">목표가 저장되었습니다!</div>}
          {addError && <div className="text-red-500 mt-2">{addError}</div>}
        </Card>
        <h2 className="text-lg font-semibold text-primary mb-3">나의 목표</h2>
        {loading ? (
          <div className="text-gray-400 text-center py-8">목표를 불러오는 중...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : goals.length === 0 ? (
          <div className="text-gray-400 text-center py-8">아직 등록된 목표가 없습니다.<br/>AI 기반 목표 제안 기능을 통해 목표를 생성해보세요!</div>
        ) : (
          <div className="flex flex-col gap-4">
            {goals.map(goal => (
              <Card key={goal.id}>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-base text-primary">{goal.title}</span>
                    <span className="text-xs text-gray-400">{goal.date}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-1">{goal.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block text-xs rounded px-2 py-0.5 ${goal.status === 'done' ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>{goal.status === 'done' ? '완료' : '진행중'}</span>
                    <button
                      className={`ml-2 text-xs rounded px-2 py-0.5 border transition ${goal.status === 'done' ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-primary text-white border-primary hover:opacity-90'} ${updatingId === goal.id ? 'opacity-60' : ''}`}
                      onClick={() => handleComplete(goal.id)}
                      disabled={goal.status === 'done' || updatingId === goal.id}
                    >
                      {goal.status === 'done' ? '완료됨' : updatingId === goal.id ? '처리중...' : '완료'}
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals; 