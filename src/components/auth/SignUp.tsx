import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const SignUp = () => {
  const { signUp, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(email, password);
    if (!error) setSuccess(true);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: '0 auto' }}>
      <h2>회원가입</h2>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        style={{ width: '100%', marginBottom: 8 }}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        minLength={6}
        style={{ width: '100%', marginBottom: 8 }}
      />
      <button type="submit" disabled={loading} style={{ width: '100%' }}>
        {loading ? '가입 중...' : '회원가입'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: 8 }}>가입 완료! 이메일을 확인하세요.</div>}
    </form>
  );
};

export default SignUp; 