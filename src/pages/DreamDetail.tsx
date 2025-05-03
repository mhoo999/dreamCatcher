import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Card from '../components/common/Card';
import { ArrowLeft } from 'phosphor-react';
import { Dream } from '../types/dream';
import GoalList from '../components/common/GoalList';
import DreamDeleteButton from '../components/common/DreamDeleteButton';
import { createGoal, updateGoal, deleteGoal } from '../services/supabase';
import { Goal } from '../types/goal';

const DreamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dream, setDream] = useState<Dream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [goalUpdating, setGoalUpdating] = useState<string | null>(null);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [adding, setAdding] = useState(false);
  const [priorityUpdating, setPriorityUpdating] = useState(false);

  const fetchDream = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('dreams')
      .select('*, goals:dream_goals(*)')
      .eq('id', id)
      .single();
    if (error || !data) {
      setError('꿈 정보를 불러올 수 없습니다.');
      setDream(null);
    } else {
      setDream({
        ...data,
        goals: data.goals || [],
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDream();
    // eslint-disable-next-line
  }, [id]);

  // 목표 완료 상태 토글 핸들러
  const handleToggleCompleted = async (goal: any) => {
    if (!goal || !goal.id) return;
    setGoalUpdating(goal.id);
    const { error } = await supabase
      .from('goals')
      .update({ completed: !goal.completed })
      .eq('id', goal.id);
    setGoalUpdating(null);
    if (!error) {
      fetchDream(); // 상태 변경 후 새로고침
    } else {
      alert('목표 상태 변경에 실패했습니다.');
    }
  };

  // 목표 추가 핸들러
  const handleAddGoal = async () => {
    if (!newGoalTitle.trim() || !id) return;
    setAdding(true);
    try {
      await createGoal({
        title: newGoalTitle.trim(),
        completed: false,
        status: 'proposed',
        dream_id: id,
      } as any);
      setNewGoalTitle('');
      fetchDream();
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
      fetchDream();
    } catch (e) {
      alert('목표 수정에 실패했습니다.');
    }
  };

  // 목표 삭제 핸들러
  const handleDeleteGoal = async (goal: Goal) => {
    if (!window.confirm('정말로 이 목표를 삭제하시겠습니까?')) return;
    try {
      await deleteGoal(goal.id);
      fetchDream();
    } catch (e) {
      alert('목표 삭제에 실패했습니다.');
    }
  };

  // 목표 우선순위 변경 핸들러
  const handlePriorityChange = async (reorderedGoals: Goal[]) => {
    setPriorityUpdating(true);
    try {
      // 순서대로 priority 필드 업데이트 (priority: 1,2,3...)
      await Promise.all(
        reorderedGoals.map((goal, idx) => updateGoal(goal.id, { priority: idx + 1 }))
      );
      fetchDream();
    } catch (e) {
      alert('목표 우선순위 변경에 실패했습니다.');
    } finally {
      setPriorityUpdating(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-[600px]">
        <button
          className="mb-4 flex items-center gap-1 text-primary hover:underline"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} /> 뒤로가기
        </button>
        {loading ? (
          <Card><div className="text-gray-400 text-center py-8">꿈 정보를 불러오는 중...</div></Card>
        ) : error ? (
          <Card><div className="text-red-500 text-center py-8">{error}</div></Card>
        ) : dream ? (
          <>
            <Card>
              <h2 className="text-xl font-bold text-primary mb-2">{dream.title}</h2>
              <div className="text-xs text-gray-400 mb-2">{dream.deadline ? dream.deadline : dream.created_at?.slice(0,10)}</div>
              <p className="text-gray-700 mb-3 whitespace-pre-line">{dream.description}</p>
              <div className="mt-4">
                <h3 className="font-semibold text-base mb-2">연결된 목표</h3>
                <div className="w-full max-w-[430px] mb-4 flex gap-2">
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
                <GoalList
                  goals={dream.goals}
                  onToggleCompleted={handleToggleCompleted}
                  onEdit={handleEditGoal}
                  onDelete={handleDeleteGoal}
                  onPriorityChange={handlePriorityChange}
                />
                {goalUpdating && <div className="text-xs text-blue-500 mt-2">상태 변경 중...</div>}
                {priorityUpdating && <div className="text-xs text-purple-500 mt-2">우선순위 변경 중...</div>}
              </div>
              <div className="mt-8 flex justify-end">
                <DreamDeleteButton dreamId={dream.id} onDeleted={() => navigate('/')} />
              </div>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default DreamDetail; 