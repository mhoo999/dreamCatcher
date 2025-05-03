import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import Card from '../components/common/Card';
import { useNavigate } from 'react-router-dom';

interface Dream {
  id: number;
  title: string;
  description: string;
  date: string;
  tags?: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    supabase
      .from('dreams')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError('꿈 목록을 불러오지 못했습니다: ' + error.message);
          setDreams([]);
        } else {
          setDreams(
            (data || []).map(d => ({
              ...d,
              date: d.created_at ? d.created_at.slice(0, 10) : '',
            }))
          );
        }
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-app px-4">
        <Card className="bg-gradient-to-br from-primary to-secondary mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">DreamCatcher</h1>
          <p className="text-white/90">감성적이고 현대적인 모바일 앱 스타일의 데모 카드입니다.</p>
        </Card>
        <h2 className="text-lg font-semibold text-primary mb-3">나의 꿈 피드</h2>
        {loading ? (
          <div className="text-gray-400 text-center py-8">꿈을 불러오는 중...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : dreams.length === 0 ? (
          <div className="text-gray-400 text-center py-8">아직 등록된 꿈이 없습니다.<br/>오른쪽 하단 탭에서 꿈을 입력해보세요!</div>
        ) : (
          <div className="flex flex-col gap-4">
            {dreams.map(dream => (
              <Card
                key={dream.id}
                className="cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/dream/${dream.id}`)}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-base text-primary">{dream.title}</span>
                    <span className="text-xs text-gray-400">{dream.date}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{dream.description}</p>
                  {dream.tags && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {dream.tags.split(',').map(tag => (
                        <span key={tag} className="bg-primary/10 text-primary text-xs rounded px-2 py-0.5">#{tag.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 