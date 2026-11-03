import React, { useState, useRef, useEffect } from 'react';
import {
  Trash2,
  Edit2,
  Check,
  X,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Clock,
  Tag,
} from 'lucide-react';
import { COLUMNS } from '../constants/columns';

/**
 * TaskCard Component
 *
 * Responsibilities:
 * 1. Conditionally render borders based on priority: High = Red, Medium = Yellow, Low = Green.
 * 2. Toggle inline editing state when clicking on the title or edit icon.
 * 3. Provide universal delete action.
 * 4. Provide action buttons to mutate column state (To Do -> In Progress -> Done).
 * 5. Support HTML5 drag-and-drop physical dragging between columns.
 */
export default function TaskCard({
  task,
  onDeleteTask,
  onUpdateTask,
  onMoveTask,
  onDragStart,
  onDragEnd,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  // Sync internal title state if task prop changes externally
  useEffect(() => {
    setEditedTitle(task.title);
  }, [task.title]);

  // Auto-focus and select text when entering inline edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    const trimmed = editedTitle.trim();
    if (trimmed && trimmed !== task.title) {
      onUpdateTask(task.id, { title: trimmed });
    } else {
      setEditedTitle(task.title); // revert to original if empty
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(task.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  // Determine priority CSS class for conditional border rendering
  // Requirement: High = Red border, Medium = Yellow, Low = Green
  const getPriorityBorderClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'card-border-high'; // Red border
      case 'Medium':
        return 'card-border-medium'; // Yellow border
      case 'Low':
        return 'card-border-low'; // Green border
      default:
        return 'card-border-medium';
    }
  };

  // Determine current column index to enable/disable directional move buttons
  const columnIndex = COLUMNS.findIndex((col) => col.id === task.status);
  const canMoveLeft = columnIndex > 0;
  const canMoveRight = columnIndex < COLUMNS.length - 1;

  const handleMovePrevious = (e) => {
    e.stopPropagation();
    if (canMoveLeft) {
      const prevColumn = COLUMNS[columnIndex - 1].id;
      onMoveTask(task.id, prevColumn);
    }
  };

  const handleMoveNext = (e) => {
    e.stopPropagation();
    if (canMoveRight) {
      const nextColumn = COLUMNS[columnIndex + 1].id;
      onMoveTask(task.id, nextColumn);
    }
  };

  // HTML5 Drag Event Handlers
  const handleDragStartInternal = (e) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    if (onDragStart) {
      onDragStart(task.id);
    }
  };

  const handleDragEndInternal = () => {
    setIsDragging(false);
    if (onDragEnd) {
      onDragEnd();
    }
  };

  // Format creation timestamp into friendly time
  const formatTime = (isoString) => {
    if (!isoString) return 'Active';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Active';
    }
  };

  return (
    <div
      className={`task-card ${getPriorityBorderClass(task.priority)} ${
        isDragging ? 'task-card-dragging' : ''
      }`}
      draggable={!isEditing}
      onDragStart={handleDragStartInternal}
      onDragEnd={handleDragEndInternal}
      role="listitem"
      aria-label={`Task: ${task.title}, Priority: ${task.priority}`}
    >
      {/* Top Meta Bar: Drag Handle, Priority Badge & Delete Action */}
      <div className="card-top-bar">
        <div className="card-meta-left">
          <div
            className="card-drag-handle"
            title="Click and drag to move between columns"
            aria-hidden="true"
          >
            <GripVertical size={16} />
          </div>

          {/* Priority Badge */}
          <span className={`priority-badge priority-badge-${task.priority.toLowerCase()}`}>
            <Tag size={11} />
            <span>{task.priority}</span>
          </span>
        </div>

        {/* Universal Delete Action Button */}
        <button
          type="button"
          onClick={() => onDeleteTask(task.id)}
          className="btn-card-delete"
          title="Delete task permanently"
          aria-label={`Delete task ${task.title}`}
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Main Content Area: Inline Editable Title */}
      <div className="card-content">
        {isEditing ? (
          <div className="inline-edit-wrapper">
            <input
              ref={inputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="inline-edit-input"
              maxLength={120}
              placeholder="Task description..."
            />
            <div className="inline-edit-actions">
              <button
                type="button"
                onClick={handleSaveEdit}
                className="btn-edit-confirm"
                title="Save changes (Enter)"
              >
                <Check size={14} />
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="btn-edit-cancel"
                title="Cancel (Esc)"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div
            className="card-title-view"
            onClick={() => setIsEditing(true)}
            title="Click to edit task title inline"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsEditing(true);
              }
            }}
          >
            <p className="card-title-text">{task.title}</p>
            <span className="card-edit-hint" aria-hidden="true">
              <Edit2 size={13} />
            </span>
          </div>
        )}
      </div>

      {/* Card Footer: Timestamp & Column Navigation Actions */}
      <div className="card-footer">
        <span className="card-timestamp">
          <Clock size={12} />
          <span>{formatTime(task.createdAt)}</span>
        </span>

        {/* Phase 1 Move Task Buttons & Accessible Column Switcher */}
        <div className="card-move-actions">
          <button
            type="button"
            onClick={handleMovePrevious}
            disabled={!canMoveLeft}
            className="btn-move"
            title={
              canMoveLeft
                ? `Move left to ${COLUMNS[columnIndex - 1].title}`
                : 'Already at first column'
            }
            aria-label="Move task to previous column"
          >
            <ChevronLeft size={15} />
          </button>

          <span className="current-column-indicator">
            {COLUMNS[columnIndex]?.title}
          </span>

          <button
            type="button"
            onClick={handleMoveNext}
            disabled={!canMoveRight}
            className="btn-move"
            title={
              canMoveRight
                ? `Move right to ${COLUMNS[columnIndex + 1].title}`
                : 'Already in Done'
            }
            aria-label="Move task to next column"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
