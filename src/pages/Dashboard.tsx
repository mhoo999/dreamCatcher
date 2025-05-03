import React, { useEffect, useState } from 'react';
import DreamCard from '../components/dream/DreamCard';
import { fetchUserDreams } from '../services/supabase';
import { Dream } from '../types/dream';

const Dashboard: React.FC = () => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);

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