import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Card from '../components/common/Card';
import { ArrowLeft } from 'phosphor-react';
import { Dream, DreamGoal } from '../types/dream';

const DreamDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dream, setDream] = useState<Dream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    supabase
      .from('dreams')
      .select('*, goals:dream_goals(*)')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
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
      });
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center py-8 min-h-screen">
      <div className="w-full max-w-app px-4">
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
              {dream.goals && dream.goals.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-base mb-2">연결된 목표</h3>
                  <ul className="flex flex-col gap-2">
                    {dream.goals.map(goal => (
                      <li key={goal.id} className="flex items-center gap-2 text-sm">
                        <span className={`inline-block w-2 h-2 rounded-full ${goal.completed ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        <span className={goal.completed ? 'line-through text-gray-400' : ''}>{goal.title}</span>
                        <span className="ml-auto text-xs text-gray-400">{goal.created_at?.slice(0,10)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {dream.goals && dream.goals.length === 0 && (
                <div className="mt-4 text-xs text-gray-400">아직 연결된 목표가 없습니다.</div>
              )}
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default DreamDetail; 