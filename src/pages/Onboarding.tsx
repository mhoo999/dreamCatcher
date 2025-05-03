import React from 'react';
import Card from '../components/common/Card';
import { useNavigate } from 'react-router-dom';
import { Sparkle, CloudMoon, Target, UserCircle } from 'phosphor-react';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="w-full max-w-app px-4">
        <Card className="bg-gradient-to-br from-primary to-secondary text-white mb-6 flex flex-col items-center">
          <Sparkle size={48} weight="fill" className="mb-2" />
          <h1 className="text-2xl font-bold mb-2">DreamCatcher에 오신 걸 환영합니다!</h1>
          <p className="mb-4 text-white/90 text-center">꿈을 기록하고, AI가 목표를 제안하며, 감성적인 앱뷰로 당신의 성장을 함께합니다.</p>
        </Card>
        <div className="flex flex-col gap-4 mb-6">
          <Card className="flex items-center gap-3">
            <CloudMoon size={28} className="text-primary" />
            <div>
              <div className="font-semibold text-primary">꿈 기록</div>
              <div className="text-xs text-gray-500">매일의 꿈을 쉽고 감성적으로 기록</div>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <Target size={28} className="text-primary" />
            <div>
              <div className="font-semibold text-primary">AI 목표 제안</div>
              <div className="text-xs text-gray-500">꿈을 바탕으로 맞춤형 목표 자동 생성</div>
            </div>
          </Card>
          <Card className="flex items-center gap-3">
            <UserCircle size={28} className="text-primary" />
            <div>
              <div className="font-semibold text-primary">나만의 앱뷰</div>
              <div className="text-xs text-gray-500">모바일앱 스타일의 감성적 UI/UX</div>
            </div>
          </Card>
        </div>
        <button
          className="w-full bg-gradient-to-br from-primary to-secondary text-white font-bold rounded-lg py-3 shadow-card hover:opacity-90 transition text-lg"
          onClick={() => navigate('/dashboard')}
        >
          시작하기
        </button>
      </div>
    </div>
  );
};

export default Onboarding; 