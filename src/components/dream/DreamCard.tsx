import { useNavigate } from 'react-router-dom';
import { Dream } from '../../types/dream';

interface DreamCardProps {
  dream: Dream;
}

export default function DreamCard({ dream }: DreamCardProps) {
  const navigate = useNavigate();
  const progress = calculateProgress(dream);

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 cursor-pointer"
      onClick={() => navigate(`/dreams/${dream.id}`)}
    >
      <h3 className="font-semibold text-lg mb-2 truncate">{dream.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{dream.description}</p>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span>마감일: {dream.deadline ? dream.deadline : '없음'}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-right text-xs mt-1">{progress}%</div>
    </div>
  );
}

function calculateProgress(dream: Dream): number {
  if (!dream.goals || dream.goals.length === 0) return 0;
  const completedGoals = dream.goals.filter(goal => goal.completed).length;
  return Math.round((completedGoals / dream.goals.length) * 100);
} 