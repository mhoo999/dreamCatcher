import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 32, textAlign: 'center' }}>
      <h1>드림캐쳐에 오신 것을 환영합니다!</h1>
      <p>드림캐쳐는 당신의 꿈을 구체적인 목표와 실행 계획으로 바꿔주는 성장형 목표 관리 앱입니다.</p>
      <ul style={{ textAlign: 'left', margin: '24px auto', maxWidth: 400 }}>
        <li>꿈을 시각화하고 저장</li>
        <li>AI가 일간/주간/월간 목표 자동 제안</li>
        <li>목표 진행 상황 트래킹 및 피드백</li>
        <li>동기부여 콘텐츠와 알림 제공</li>
      </ul>
      <button style={{ marginTop: 32, fontSize: 18, padding: '12px 32px' }} onClick={() => navigate('/dream-input')}>
        꿈 입력 시작
      </button>
    </div>
  );
};

export default Onboarding; 