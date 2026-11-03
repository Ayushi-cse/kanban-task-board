import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import SearchBar from './components/SearchBar';
import KanbanBoard from './components/KanbanBoard';
import { INITIAL_TASKS } from './constants/initialTasks';
import { STORAGE_KEY } from './constants/columns';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';
import './App.css';

/**
 * Root Application Component
 *
 * Implements the core React State Architecture:
 * - State Management with `useState`
 * - Lifting State Up for cross-component mutations (Add, Delete, Move, Inline Edit)
 * - Persistent sync with browser `localStorage`
 * - Real-time filtering with `useMemo`
 */
export default function App() {
  // -------------------------------------------------------------
  // Phase 2: State Persistence with localStorage
  // -------------------------------------------------------------
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Failed to parse tasks from localStorage:', err);
    }
    return INITIAL_TASKS;
  });

  // Keep localStorage continuously synchronized with React state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Failed to save tasks to localStorage:', err);
    }
  }, [tasks]);

  // -------------------------------------------------------------
  // Phase 3: Real-Time Search & Priority Filter State
  // -------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);

  // Helper to trigger temporary UI feedback toasts
  const triggerToast = (text, type = 'info') => {
    setToastMessage({ text, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // -------------------------------------------------------------
  // Phase 1: State Handlers (Add, Delete, Move, Inline Edit)
  // -------------------------------------------------------------

  /**
   * Add Task: Injects a new task object directly into the "To Do" state array.
   */
  const handleAddTask = ({ title, priority }) => {
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      status: 'todo', // Always initiates in the "To Do" column
      priority: priority || 'Medium',
      createdAt: new Date().toISOString(),
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
    triggerToast(`Added "${title.slice(0, 24)}..." to To Do`, 'success');
  };

  /**
   * Delete Task: Universal delete action on each rendered card.
   */
  const handleDeleteTask = (taskId) => {
    const targetTask = tasks.find((t) => t.id === taskId);
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
    triggerToast(`Deleted task "${targetTask?.title?.slice(0, 20) || 'item'}"`, 'warning');
  };

  /**
   * Move Task: Mutates the column state (To Do -> In Progress -> Done).
   * Also invoked by HTML5 Drag-and-Drop dropzones.
   */
  const handleMoveTask = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          if (task.status === newStatus) return task;
          return { ...task, status: newStatus };
        }
        return task;
      })
    );
  };

  /**
   * Inline Edit Task: Updates properties (e.g. title) of an existing task.
   */
  const handleUpdateTask = (taskId, updates) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
    triggerToast('Task updated successfully', 'info');
  };

  /**
   * Reset Board: Restores sample sprint tasks to demonstrate clean states.
   */
  const handleResetTasks = () => {
    if (window.confirm('Reset board back to default demo tasks?')) {
      setTasks(INITIAL_TASKS);
      setSearchQuery('');
      setPriorityFilter('All');
      triggerToast('Board reset to default demo sprint', 'info');
    }
  };

  // -------------------------------------------------------------
  // Real-Time Filter Computation (Memoized)
  // -------------------------------------------------------------
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Text Search Filter (Case-insensitive match on task title)
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase());

      // 2. Priority Filter (All, High, Medium, Low)
      const matchesPriority =
        priorityFilter === 'All' || task.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [tasks, searchQuery, priorityFilter]);

  return (
    <div className="app-shell">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <aside
          className={`app-toast toast-${toastMessage.type}`}
          role="status"
          aria-live="polite"
        >
          {toastMessage.type === 'success' && <CheckCircle size={16} />}
          {toastMessage.type === 'warning' && <AlertTriangle size={16} />}
          {toastMessage.type === 'info' && <Info size={16} />}
          <span>{toastMessage.text}</span>
        </aside>
      )}

      {/* Header with Sprint Stats & Controls */}
      <Header tasks={tasks} onResetTasks={handleResetTasks} />

      {/* Main Workspace Layout */}
      <div className="workspace-container">
        {/* Phase 1 & 2: Task Creation Form */}
        <TaskForm onAddTask={handleAddTask} />

        {/* Phase 3: Real-Time Search & Priority Filters */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          filteredCount={filteredTasks.length}
          totalCount={tasks.length}
        />

        {/* Kanban Board (3 Columns: To Do, In Progress, Done) */}
        <KanbanBoard
          tasks={filteredTasks}
          onDeleteTask={handleDeleteTask}
          onUpdateTask={handleUpdateTask}
          onMoveTask={handleMoveTask}
        />
      </div>

      {/* Enterprise Footer */}
      <footer className="app-footer">
        <p>
          Sprint 05: Kanban Task Board &bull; Prodesk IT React Onboarding &bull; Built with
          Vite &amp; React.js
        </p>
      </footer>
    </div>
  );
}
