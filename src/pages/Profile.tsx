import React from 'react';
import Card from '../components/common/Card';

const Profile: React.FC = () => {
  return (
    <div className="max-w-[430px] mx-auto w-full px-4 py-8 flex flex-col items-center justify-center">
      <Card>
        <h2 className="text-lg font-semibold text-primary mb-1">프로필</h2>
        <p className="text-gray-700">여기에 사용자 정보/설정 UI가 표시됩니다.</p>
      </Card>
    </div>
  );
};

export default Profile; 