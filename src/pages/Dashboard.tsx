import React, { useEffect, useState } from 'react';
import DreamCard from '../components/dream/DreamCard';
import { fetchUserDreams } from '../services/supabase';
import { Dream } from '../types/dream';

function calculateProgress(dream: Dream) {
  if (!dream.goals || dream.goals.length === 0) return 0;
  const completed = dream.goals.filter(g => g.completed).length;
  return Math.round((completed / dream.goals.length) * 100);
}

const sortOptions = [
  { value: 'created_desc', label: '생성일(최신순)' },
  { value: 'created_asc', label: '생성일(오래된순)' },
  { value: 'deadline_asc', label: '마감일(임박순)' },
  { value: 'deadline_desc', label: '마감일(늦은순)' },
  { value: 'title_asc', label: '제목(가나다순)' },
  { value: 'progress_desc', label: '진행률(높은순)' },
  { value: 'progress_asc', label: '진행률(낮은순)' },
];

const filterOptions = [
  { value: 'all', label: '전체' },
  { value: 'deadline_soon', label: '마감 임박(7일 이내)' },
  { value: 'deadline_passed', label: '마감 지난 꿈' },
  { value: 'progress_100', label: '완료(100%)' },
  { value: 'progress_incomplete', label: '진행중(<100%)' },
];

const Dashboard: React.FC = () => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('created_desc');
  const [filter, setFilter] = useState('all');

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

  // 필터링
  let filtered = dreams;
  const now = new Date();
  if (filter === 'deadline_soon') {
    filtered = dreams.filter(d => d.deadline && (new Date(d.deadline).getTime() - now.getTime()) / (1000*60*60*24) <= 7 && new Date(d.deadline) >= now);
  } else if (filter === 'deadline_passed') {
    filtered = dreams.filter(d => d.deadline && new Date(d.deadline) < now);
  } else if (filter === 'progress_100') {
    filtered = dreams.filter(d => calculateProgress(d) === 100);
  } else if (filter === 'progress_incomplete') {
    filtered = dreams.filter(d => calculateProgress(d) < 100);
  }

  // 정렬
  let sorted = [...filtered];
  sorted.sort((a, b) => {
    if (sort === 'created_desc') return b.created_at.localeCompare(a.created_at);
    if (sort === 'created_asc') return a.created_at.localeCompare(b.created_at);
    if (sort === 'deadline_asc') return (a.deadline || '').localeCompare(b.deadline || '');
    if (sort === 'deadline_desc') return (b.deadline || '').localeCompare(a.deadline || '');
    if (sort === 'title_asc') return a.title.localeCompare(b.title);
    if (sort === 'progress_desc') return calculateProgress(b) - calculateProgress(a);
    if (sort === 'progress_asc') return calculateProgress(a) - calculateProgress(b);
    return 0;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-app">
      <h1 className="text-2xl font-bold mb-6">내 꿈 목록</h1>
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <label className="text-sm font-medium">정렬:</label>
        <select className="border rounded px-2 py-1 text-sm" value={sort} onChange={e => setSort(e.target.value)}>
          {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <label className="text-sm font-medium ml-4">필터:</label>
        <select className="border rounded px-2 py-1 text-sm" value={filter} onChange={e => setFilter(e.target.value)}>
          {filterOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center py-12">로딩 중...</div>
      ) : sorted.length === 0 ? (
        <div className="text-center text-gray-400 py-12">조건에 맞는 꿈이 없습니다.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map(dream => (
            <DreamCard key={dream.id} dream={dream} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 