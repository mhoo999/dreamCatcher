import React, { useState } from 'react';
import Card from '../components/common/Card';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Goal } from '../types/goal';

const DreamInput: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [deadline, setDeadline] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGoals, setAiGoals] = useState<string | null>(null);
  const [goalSaveResult, setGoalSaveResult] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setAiGoals(null);
    setGoalSaveResult(null);
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }
    // 1. 꿈 저장 및 id 받아오기
    let dreamRow;
    try {
      const { data, error } = await supabase
        .from('dreams')
        .insert([
          {
            user_id: user.id,
            title,
            description,
            tags,
            deadline: deadline || null,
          }
        ])
        .select()
        .single();
      if (error || !data) {
        setError('저장 실패: ' + (error?.message || '')); return;
      }
      dreamRow = data;
    } catch (err: any) {
      setError('저장 실패: ' + err.message); return;
    }
    setSuccess(true);
    setTitle(''); setDescription(''); setTags(''); setDeadline('');
    // 2. AI 목표 생성
    setAiLoading(true);
    try {
      const res = await fetch('/api/generate-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dream: `${title} ${description}`, deadline }),
      });
      const data = await res.json();
      if (res.ok && data.goals) {
        setAiGoals(data.goals);
        // 3. 목표 파싱 및 저장
        const lines = data.goals
          .split(/\n|\r/)
          .map((line: string) => line.trim())
          .filter((line: string) => line && (/^\d+\.|^- /.test(line) || line.length > 3));
        // 번호/대시 제거
        const parsedGoals = lines.map((line: string) => line.replace(/^\d+\.\s*|^-\s*/, '').trim()).filter(Boolean);
        if (parsedGoals.length === 0) {
          setGoalSaveResult('AI 목표 파싱 실패: 저장된 목표가 없습니다.');
        } else {
          // Supabase에 목표 저장
          const results = await Promise.all(parsedGoals.map(async (goalTitle: string) => {
            try {
              await supabase.from('goals').insert({
                dream_id: dreamRow.id,
                title: goalTitle,
                completed: false,
                status: 'proposed',
              });
              return true;
            } catch {
              return false;
            }
          }));
          if (results.every(Boolean)) {
            setGoalSaveResult('AI 목표가 성공적으로 저장되었습니다!');
          } else {
            setGoalSaveResult('일부 목표 저장에 실패했습니다.');
          }
        }
      } else {
        setAiGoals('AI 목표 생성에 실패했습니다.');
      }
    } catch (e) {
      setAiGoals('AI 목표 생성 중 오류가 발생했습니다.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-[430px] mx-auto w-full px-4 py-8 flex flex-col items-center justify-center">
      <Card>
        <h2 className="text-lg font-semibold text-primary mb-4">새로운 꿈 입력</h2>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            className="border rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="꿈 제목"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            className="border rounded-lg px-3 py-2 text-base min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="꿈에 대한 설명"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
          <input
            type="text"
            className="border rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="태그 (쉼표로 구분)"
            value={tags}
            onChange={e => setTags(e.target.value)}
          />
          <input
            type="date"
            className="border rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="마감일 (선택)"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
          />
          <button
            type="submit"
            className="bg-gradient-to-br from-primary to-secondary text-white font-bold rounded-lg py-2 mt-2 shadow-card hover:opacity-90 transition"
            disabled={aiLoading}
          >
            {aiLoading ? 'AI 목표 생성 중...' : '저장하기'}
          </button>
        </form>
        {success && <div className="text-green-500 mt-2">꿈이 저장되었습니다!</div>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {aiLoading && <div className="text-blue-500 mt-2">AI 목표를 생성 중입니다...</div>}
        {aiGoals && (
          <div className="mt-4 p-3 bg-gray-50 rounded text-sm whitespace-pre-line border border-gray-200">
            <div className="font-semibold text-primary mb-1">AI가 제안한 목표</div>
            {aiGoals}
          </div>
        )}
        {goalSaveResult && <div className="text-blue-600 mt-2">{goalSaveResult}</div>}
      </Card>
    </div>
  );
};

export default DreamInput; 