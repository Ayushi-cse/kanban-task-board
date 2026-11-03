import React, { useState } from 'react';
import { Inbox, CheckCircle2, Clock, CircleDot, ArrowDownCircle } from 'lucide-react';
import TaskCard from './TaskCard';

/**
 * KanbanColumn Component
 * Represents a discrete workflow state (To Do, In Progress, Done).
 * Acts as both a rendering container and an HTML5 Drag-and-Drop dropzone.
 */
export default function KanbanColumn({
  column,
  tasks,
  onDeleteTask,
  onUpdateTask,
  onMoveTask,
  activeDragId,
  onDragStart,
  onDragEnd,
}) {
  const [isOver, setIsOver] = useState(false);

  // Pick appropriate icon based on column identity
  const renderColumnIcon = () => {
    switch (column.id) {
      case 'todo':
        return <CircleDot size={18} className="text-blue-500" />;
      case 'in_progress':
        return <Clock size={18} className="text-amber-500 animate-pulse-slow" />;
      case 'done':
        return <CheckCircle2 size={18} className="text-emerald-500" />;
      default:
        return <Inbox size={18} />;
    }
  };

  // HTML5 Drag & Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (e) => {
    // Only set isOver to false if leaving the column element itself
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);

    const droppedTaskId = e.dataTransfer.getData('text/plain') || activeDragId;
    if (droppedTaskId) {
      onMoveTask(droppedTaskId, column.id);
    }
  };

  return (
    <section
      className={`kanban-column column-${column.id} ${
        isOver ? 'column-drop-active' : ''
      }`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-label={`${column.title} column with ${tasks.length} tasks`}
    >
      {/* Column Header */}
      <div className="column-header">
        <div className="column-title-group">
          {renderColumnIcon()}
          <h3 className="column-title">{column.title}</h3>
        </div>
        <span
          className={`column-count-badge ${column.badgeClass}`}
          title={`${tasks.length} task${tasks.length === 1 ? '' : 's'}`}
        >
          {tasks.length}
        </span>
      </div>

      {/* Task List / Drop Zone */}
      <div className="column-task-list" role="list">
        {/* Visual drop indicator when hovering */}
        {isOver && (
          <div className="drop-target-hint">
            <ArrowDownCircle size={16} />
            <span>Drop task into {column.title}</span>
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="empty-column-state">
            <Inbox size={28} className="empty-column-icon" />
            <p className="empty-column-title">No tasks in {column.title}</p>
            <p className="empty-column-subtitle">
              {column.id === 'todo'
                ? 'Create a new task above to populate this column.'
                : 'Drag tasks here or use card move buttons.'}
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDeleteTask={onDeleteTask}
              onUpdateTask={onUpdateTask}
              onMoveTask={onMoveTask}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
    </section>
  );
}
