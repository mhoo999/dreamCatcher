import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { House, CloudMoon, Target, UserCircle } from 'phosphor-react';

const tabs = [
  { label: '홈', path: '/dashboard', icon: House },
  { label: '꿈', path: '/dream-input', icon: CloudMoon },
  { label: '목표', path: '/goals', icon: Target },
  { label: '프로필', path: '/profile', icon: UserCircle },
];

const BottomTabBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="max-w-app mx-auto fixed bottom-0 left-0 right-0 flex justify-between items-center bg-white rounded-t-tab shadow-tab py-2 px-4 z-50">
      {tabs.map(tab => {
        const isActive = location.pathname.startsWith(tab.path);
        const Icon = tab.icon;
        return (
          <button
            key={tab.path}
            className={`flex-1 flex flex-col items-center gap-0.5 py-1 px-2 text-center transition-colors ${isActive ? 'text-primary font-bold' : 'text-gray-400'}`}
            onClick={() => navigate(tab.path)}
          >
            <Icon size={26} weight={isActive ? 'fill' : 'regular'} />
            <span className="text-xs mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomTabBar; 