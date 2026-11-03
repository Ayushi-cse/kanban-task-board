import React, { useState } from 'react';
import { PlusCircle, AlertCircle, Sparkles } from 'lucide-react';
import { PRIORITY_OPTIONS } from '../constants/columns';

/**
 * Task creation form component.
 * Captures user input for task title and priority level, then triggers
 * the parent callback to inject a new task object directly into the "To Do" column.
 */
export default function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [inputError, setInputError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setInputError('Please enter a task description before adding.');
      return;
    }

    if (trimmedTitle.length < 3) {
      setInputError('Task title must be at least 3 characters long.');
      return;
    }

    // Invoke lifted state callback passed down from parent App
    onAddTask({
      title: trimmedTitle,
      priority,
    });

    // Reset local component state
    setTitle('');
    setPriority('Medium');
    setInputError('');
  };

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
    if (inputError) {
      setInputError('');
    }
  };

  return (
    <div className="task-form-card">
      <div className="task-form-header">
        <div className="form-heading-group">
          <Sparkles size={16} className="text-primary-500" />
          <h2 className="form-title">Create New Task</h2>
        </div>
        <span className="form-tag">Phase 1 &amp; Phase 2</span>
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-fields-row">
          {/* Text Input */}
          <div className="form-input-container">
            <input
              type="text"
              value={title}
              onChange={handleChangeTitle}
              placeholder="What needs to be done? (e.g. Implement API rate limiter)"
              className={`task-input ${inputError ? 'input-error' : ''}`}
              maxLength={120}
              aria-label="New task title"
            />
            {inputError && (
              <p className="error-message">
                <AlertCircle size={14} />
                <span>{inputError}</span>
              </p>
            )}
          </div>

          {/* Priority Select Dropdown */}
          <div className="priority-select-container">
            <label htmlFor="priority-select" className="sr-only">
              Priority
            </label>
            <select
              id="priority-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={`priority-select priority-select-${priority.toLowerCase()}`}
              aria-label="Task priority"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Add Button */}
          <button type="submit" className="btn-primary" aria-label="Add task to To Do">
            <PlusCircle size={18} />
            <span>Add Task</span>
          </button>
        </div>
      </form>
    </div>
  );
}
