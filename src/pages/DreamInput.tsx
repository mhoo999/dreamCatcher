import React, { useState } from 'react';
import Card from '../components/common/Card';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

const DreamInput: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }
    const { error } = await supabase.from('dreams').insert([
      {
        user_id: user.id,
        title,
        description,
        tags,
      }
    ]);
    if (error) {
      setError('저장 실패: ' + error.message);
      setSuccess(false);
    } else {
      setSuccess(true);
      setTitle('');
      setDescription('');
      setTags('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-app px-4">
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
            <button
              type="submit"
              className="bg-gradient-to-br from-primary to-secondary text-white font-bold rounded-lg py-2 mt-2 shadow-card hover:opacity-90 transition"
            >
              저장하기
            </button>
          </form>
          {success && <div className="text-green-500 mt-2">꿈이 저장되었습니다!</div>}
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </Card>
      </div>
    </div>
  );
};

export default DreamInput; 