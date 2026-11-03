import React from 'react';
import { Kanban, Sparkles, RotateCcw, CheckCircle2 } from 'lucide-react';

/**
 * Top application header displaying brand identity, sprint context,
 * and quick-utility actions.
 */
export default function Header({ tasks, onResetTasks }) {
  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;
  const progressPercent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand & Sprint Title */}
        <div className="brand-group">
          <div className="brand-icon-wrapper">
            <Kanban className="brand-icon" size={24} />
          </div>
          <div>
            <div className="brand-title-row">
              <h1 className="brand-title">SprintFlow</h1>
              <span className="badge-sprint">Sprint 05</span>
            </div>
            <p className="brand-subtitle">
              Enterprise React Kanban Board &bull; State-Driven Architecture
            </p>
          </div>
        </div>

        {/* Sprint Completion Progress & Utilities */}
        <div className="header-actions">
          <div className="progress-card" title={`${doneCount} of ${total} tasks finished`}>
            <div className="progress-info">
              <span className="progress-label">
                <CheckCircle2 size={14} className="text-emerald-500" />
                Sprint Velocity
              </span>
              <span className="progress-value">{progressPercent}%</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onResetTasks}
            className="btn-secondary btn-icon"
            title="Reset board to default sample sprint tasks"
          >
            <RotateCcw size={16} />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
}
