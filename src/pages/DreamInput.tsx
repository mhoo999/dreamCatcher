import { useState } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

const DreamInput = () => {
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
    <form onSubmit={handleSubmit} style={{ maxWidth: 480, margin: '0 auto', padding: 32 }}>
      <h2>꿈 입력</h2>
      <input
        type="text"
        placeholder="꿈 제목"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 12 }}
      />
      <textarea
        placeholder="꿈에 대한 설명"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
        rows={4}
        style={{ width: '100%', marginBottom: 12 }}
      />
      <input
        type="text"
        placeholder="태그 (쉼표로 구분)"
        value={tags}
        onChange={e => setTags(e.target.value)}
        style={{ width: '100%', marginBottom: 12 }}
      />
      <button type="submit" style={{ width: '100%', fontSize: 16 }}>
        저장
      </button>
      {success && <div style={{ color: 'green', marginTop: 16 }}>꿈이 저장되었습니다!</div>}
      {error && <div style={{ color: 'red', marginTop: 16 }}>{error}</div>}
    </form>
  );
};

export default DreamInput; 