import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Card from '../components/common/Card';
import { ArrowLeft } from 'phosphor-react';
import { Dream } from '../types/dream';
import GoalList from '../components/common/GoalList';

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
    <div className="flex flex-col items-center justify-center py-8 min-h-screen w-full">
      <div className="w-full px-4">
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
                <GoalList goals={dream.goals} />
              </div>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default DreamDetail; 