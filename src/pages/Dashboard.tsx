import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import Card from '../components/common/Card';
import { useNavigate } from 'react-router-dom';
import DreamCard from '../components/dream/DreamCard';
import { fetchUserDreams } from '../services/supabase';
import { Dream } from '../types/dream';

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

  useEffect(() => {
    async function loadDreams() {
      try {
        const data = await fetchUserDreams();
        setDreams(data);
      } catch (error) {
        console.error('Failed to load dreams:', error);
      } finally {
        setLoading(false);
      }
    }
    loadDreams();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-app">
      <h1 className="text-2xl font-bold mb-6">내 꿈 목록</h1>
      {loading ? (
        <div className="flex justify-center py-12">로딩 중...</div>
      ) : dreams.length === 0 ? (
        <div className="text-center text-gray-400 py-12">아직 등록된 꿈이 없습니다.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dreams.map(dream => (
            <DreamCard key={dream.id} dream={dream} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 