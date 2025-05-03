import React from 'react';
import BottomTabBar from './BottomTabBar';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="max-w-app mx-auto min-h-screen bg-background flex flex-col relative shadow-none">
      {children}
      <BottomTabBar />
    </div>
  );
};

export default AppShell; 