import { useEffect } from 'react';
import { supabase } from '../services/supabase';

const TestSupabase = () => {
  useEffect(() => {
    const testConnection = async () => {
      // 실제 테이블이 없어도 에러 메시지가 다르면 연결 자체는 성공
      const { data, error } = await supabase.from('test').select('*').limit(1);
      if (error) {
        console.error('Supabase 연결 실패 또는 테이블 없음:', error.message);
      } else {
        console.log('Supabase 연결 성공:', data);
      }
    };
    testConnection();
  }, []);

  return <div>Supabase 연결 테스트 중... (브라우저 콘솔을 확인하세요)</div>;
};

export default TestSupabase; 