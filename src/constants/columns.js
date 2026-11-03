/**
 * Column definitions for the Kanban Task Board.
 * Keeps column identifiers, display titles, and theme colors centralized
 * so UI components avoid hardcoded strings.
 */
export const COLUMNS = [
  {
    id: 'todo',
    title: 'To Do',
    badgeClass: 'badge-todo',
    accentColor: '#3b82f6', // Tailwind blue-500
    description: 'Tasks waiting to be picked up',
  },
  {
    id: 'in_progress',
    title: 'In Progress',
    badgeClass: 'badge-in-progress',
    accentColor: '#f59e0b', // Tailwind amber-500
    description: 'Actively in engineering development',
  },
  {
    id: 'done',
    title: 'Done',
    badgeClass: 'badge-done',
    accentColor: '#10b981', // Tailwind emerald-500
    description: 'Passed QA and deployed to staging/prod',
  },
];

export const PRIORITY_OPTIONS = [
  { value: 'Low', label: 'Low Priority', color: '#10b981', borderClass: 'border-priority-low' },
  { value: 'Medium', label: 'Medium Priority', color: '#f59e0b', borderClass: 'border-priority-medium' },
  { value: 'High', label: 'High Priority', color: '#ef4444', borderClass: 'border-priority-high' },
];

export const STORAGE_KEY = 'kanban_tasks_v1';
