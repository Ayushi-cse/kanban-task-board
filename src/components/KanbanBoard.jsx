import React, { useState } from 'react';
import { COLUMNS } from '../constants/columns';
import KanbanColumn from './KanbanColumn';

/**
 * KanbanBoard Component
 * Main 3-column board layout rendering "To Do", "In Progress", and "Done".
 * Distributes tasks to their respective columns based on their `status` property.
 */
export default function KanbanBoard({
  tasks,
  onDeleteTask,
  onUpdateTask,
  onMoveTask,
}) {
  const [activeDragId, setActiveDragId] = useState(null);

  const handleDragStart = (id) => {
    setActiveDragId(id);
  };

  const handleDragEnd = () => {
    setActiveDragId(null);
  };

  return (
    <main className="kanban-board-container">
      <div className="kanban-columns-grid">
        {COLUMNS.map((column) => {
          // Filter tasks belonging strictly to this column status
          const columnTasks = tasks.filter((task) => task.status === column.id);

          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={columnTasks}
              onDeleteTask={onDeleteTask}
              onUpdateTask={onUpdateTask}
              onMoveTask={onMoveTask}
              activeDragId={activeDragId}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          );
        })}
      </div>
    </main>
  );
}
