import { useState } from 'react';
import { Goal, GoalStatus } from '../../types/goal';

interface GoalCardProps {
  goal: Goal;
  onToggleCompleted?: (goal: Goal) => void;
  onEdit?: (goal: Goal, updates: Partial<Goal>) => void;
  onDelete?: (goal: Goal) => void;
}

const statusColor = {
  proposed: 'bg-gray-300 text-gray-700',
  in_progress: 'bg-blue-200 text-blue-800',
  completed: 'bg-green-200 text-green-800',
  accepted: 'bg-purple-200 text-purple-800',
  rejected: 'bg-red-200 text-red-800',
};

const statusOptions: GoalStatus[] = [
  'proposed',
  'in_progress',
  'completed',
  'accepted',
  'rejected',
];

const statusActions: { status: GoalStatus; label: string; color: string }[] = [
  { status: 'accepted', label: '수락', color: 'bg-green-100 text-green-700 border-green-300' },
  { status: 'rejected', label: '거부', color: 'bg-red-100 text-red-700 border-red-300' },
  { status: 'completed', label: '완료', color: 'bg-blue-100 text-blue-700 border-blue-300' },
];

export default function GoalCard({ goal, onToggleCompleted, onEdit, onDelete }: GoalCardProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(goal.title);
  const [editStatus, setEditStatus] = useState<GoalStatus>(goal.status);
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);

  const handleSave = () => {
    if (onEdit) onEdit(goal, { title: editTitle, status: editStatus });
    setEditing(false);
  };

  const handleStatusChange = (newStatus: GoalStatus) => {
    if (onEdit && goal.status !== newStatus) {
      onEdit(goal, { status: newStatus });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center gap-4 mb-3">
      {typeof goal.priority === 'number' && (
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500 mr-2 border border-gray-300">
          {goal.priority}
        </div>
      )}
      <input
        type="checkbox"
        checked={goal.completed}
        onChange={() => onToggleCompleted && onToggleCompleted(goal)}
        className="w-5 h-5 accent-primary"
      />
      <div className="flex-1">
        {editing ? (
          <div className="flex flex-col gap-2">
            <input
              className="border rounded px-2 py-1 text-base"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
            />
            <select
              className="border rounded px-2 py-1 text-sm"
              value={editStatus}
              onChange={e => setEditStatus(e.target.value as GoalStatus)}
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <div className="flex gap-2 mt-1">
              <button className="px-2 py-1 bg-primary text-white rounded" onClick={handleSave}>저장</button>
              <button className="px-2 py-1 bg-gray-300 rounded" onClick={() => setEditing(false)}>취소</button>
            </div>
          </div>
        ) : (
          <>
            <div className={`font-medium text-base line-clamp-2 mb-1 ${goal.completed ? 'line-through text-gray-400' : ''}`}>{goal.title}</div>
            <div className="flex items-center gap-2 text-xs mb-2">
              <span className={`px-2 py-0.5 rounded ${statusColor[goal.status] || 'bg-gray-200 text-gray-700'}`}>{goal.status}</span>
              <span className="text-gray-400">{goal.created_at?.slice(0, 10)}</span>
            </div>
            <div className="flex gap-2 mb-2">
              {statusActions.map(action => (
                <button
                  key={action.status}
                  className={`px-2 py-1 rounded border text-xs ${action.color} ${goal.status === action.status ? 'ring-2 ring-offset-2' : ''}`}
                  onClick={() => handleStatusChange(action.status)}
                  disabled={goal.status === action.status}
                  type="button"
                >
                  {action.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mb-2">
              <button
                className={`px-2 py-1 rounded bg-green-100 text-green-700 border border-green-300 hover:bg-green-200 transition ${feedback === 'like' ? 'ring-2 ring-green-400' : ''}`}
                onClick={() => setFeedback('like')}
                disabled={!!feedback}
                type="button"
                aria-label="좋아요"
              >
                👍
              </button>
              <button
                className={`px-2 py-1 rounded bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 transition ${feedback === 'dislike' ? 'ring-2 ring-red-400' : ''}`}
                onClick={() => setFeedback('dislike')}
                disabled={!!feedback}
                type="button"
                aria-label="싫어요"
              >
                👎
              </button>
              {feedback === 'like' && <span className="text-green-600 ml-2">감사합니다!</span>}
              {feedback === 'dislike' && <span className="text-red-600 ml-2">더 나은 목표를 위해 노력하겠습니다.</span>}
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col gap-1 items-end">
        {!editing && (
          <>
            <button className="text-xs text-blue-500 hover:underline" onClick={() => setEditing(true)}>수정</button>
            <button className="text-xs text-red-500 hover:underline" onClick={() => onDelete && onDelete(goal)}>삭제</button>
            <select
              className="border rounded px-1 py-0.5 text-xs mt-1"
              value={goal.status}
              onChange={e => onEdit && onEdit(goal, { status: e.target.value as GoalStatus })}
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </>
        )}
      </div>
    </div>
  );
} 