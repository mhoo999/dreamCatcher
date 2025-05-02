import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 32 }}>
      <h1>대시보드</h1>
      <p>환영합니다, {user?.email} 님!</p>
      <p>이곳에서 꿈, 목표, 진행 상황을 관리할 수 있습니다.</p>
    </div>
  );
};

export default Dashboard; 