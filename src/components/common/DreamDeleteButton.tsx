import React, { useState } from 'react';
import { supabase } from '../../services/supabase';

interface DreamDeleteButtonProps {
  dreamId: string;
  onDeleted: () => void;
}

const DreamDeleteButton: React.FC<DreamDeleteButtonProps> = ({ dreamId, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 꿈을 삭제하시겠습니까? 관련 목표도 모두 삭제됩니다.')) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.from('dreams').delete().eq('id', dreamId);
    setLoading(false);
    if (!error) {
      onDeleted();
    } else {
      setError('삭제에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div>
      <button
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow disabled:opacity-60"
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? '삭제 중...' : '꿈 삭제'}
      </button>
      {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
};

export default DreamDeleteButton; 