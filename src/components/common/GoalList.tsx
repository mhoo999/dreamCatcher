import { Goal } from '../../types/goal';
import GoalCard from './GoalCard';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface GoalListProps {
  goals: Goal[];
  onToggleCompleted?: (goal: Goal) => void;
  onEdit?: (goal: Goal, updates: Partial<Goal>) => void;
  onDelete?: (goal: Goal) => void;
  onPriorityChange?: (goals: Goal[]) => void;
}

export default function GoalList({ goals, onToggleCompleted, onEdit, onDelete, onPriorityChange }: GoalListProps) {
  if (!goals || goals.length === 0) {
    return <div className="text-gray-400 text-center py-8">아직 목표가 없습니다.</div>;
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || result.destination.index === result.source.index) return;
    const reordered = Array.from(goals);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    if (onPriorityChange) onPriorityChange(reordered);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="goal-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {goals.map((goal, idx) => (
              <Draggable key={goal.id} draggableId={goal.id} index={idx}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <GoalCard goal={goal} onToggleCompleted={onToggleCompleted} onEdit={onEdit} onDelete={onDelete} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
} 