import { useAuth } from '../../contexts/AuthContext';

const LogoutButton = () => {
  const { signOut, loading, error } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div>
      <button onClick={handleLogout} disabled={loading} style={{ width: '100%' }}>
        {loading ? '로그아웃 중...' : '로그아웃'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
};

export default LogoutButton; 