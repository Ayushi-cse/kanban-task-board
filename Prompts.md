# AI Engineering Pair Programming Log & QA Protocol (`Prompts.md`)

This document records the prompt engineering iterations, state management architectural decisions, comprehensive QA testing matrix, and the complete 3-minute QA demo video script for **Sprint 05: Kanban Task Board Module**.

---

## 🧠 Part 1: AI Pair Programming & Engineering Prompt Iterations

### 🤖 Prompt 1: Component Architecture & Single Source of Truth
**Engineer Query:**
> "I am designing Phase 1 of our Trello-style Kanban board in React using Vite. To fulfill modern declarative principles, we cannot manipulate the DOM directly. How should I architect the component hierarchy and state flow so that tasks across 'To Do', 'In Progress', and 'Done' live in a single source of truth without duplicating state or causing desynchronization during mutations?"

**Engineering Analysis & Takeaways:**
- **Lifting State Up**: Rather than maintaining 3 disconnected state arrays (`todoTasks`, `inProgressTasks`, `doneTasks`), we maintain a unified `tasks` array at the parent `App.jsx` level, where each task has an immutable `status` discriminator (`'todo' | 'in_progress' | 'done'`).
- **Derived Column Slices**: Child columns (`KanbanColumn`) receive filtered slices via `.filter(t => t.status === column.id)` or through column mapping. This eliminates synchronization bugs where a task might accidentally exist in multiple columns simultaneously.
- **Unidirectional Data Flow**: State setter callbacks (`handleAddTask`, `handleDeleteTask`, `handleMoveTask`, `handleUpdateTask`) are passed down as pure props, allowing children to trigger transitions without owning the state.

---

### 🤖 Prompt 2: Phase 2 Inline Editing State Toggle & Keyboard Accessibility
**Engineer Query:**
> "In Phase 2, clicking a task title must convert it into an editable input field. How should I structure local vs lifted state for inline editing so that typing does not trigger full board re-renders, and how do we ensure keyboard accessibility (Enter to commit, Escape to cancel)?"

**Engineering Analysis & Takeaways:**
- **Local Component State for Drafts**: Built an isolated `isEditing` boolean and `editedTitle` string inside `TaskCard.jsx`. While typing, only the specific card re-renders; the global `App` state is untouched until the user commits the edit.
- **Focus Lifecycle Management**: Attached a React `useRef` to the input element coupled with a `useEffect` hook:
  ```javascript
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  ```
- **Keyboard Event Interception**: Handled `onKeyDown` with key guards:
  - `Enter`: Validates non-empty input, calls parent `onUpdateTask(task.id, { title })`, and toggles `isEditing: false`.
  - `Escape`: Reverts `editedTitle` to the original `task.title` and exits edit mode without mutating state.

---

### 🤖 Prompt 3: Phase 2 Priority Classification & Conditional CSS Architecture
**Engineer Query:**
> "Phase 2 requires a priority dropdown (High, Medium, Low) during task creation and conditional CSS rendering: High = Red border, Medium = Yellow border, Low = Green border. How should we write these class definitions to ensure modularity, theme consistency, and immediate visual distinction?"

**Engineering Analysis & Takeaways:**
- **Tokenized CSS Architecture**: Defined explicit design tokens in `index.css`:
  - `--priority-high: #ef4444` (Red 500)
  - `--priority-medium: #f59e0b` (Amber/Yellow 500)
  - `--priority-low: #10b981` (Emerald/Green 500)
- **Conditional Border Mapping Function**: Encapsulated dynamic class computation within a helper `getPriorityBorderClass(priority)`:
  - `High` ➔ `.card-border-high` (5px solid red left border + tinted border ring)
  - `Medium` ➔ `.card-border-medium` (5px solid yellow left border)
  - `Low` ➔ `.card-border-low` (5px solid green left border)
- **Select Dropdown Dynamic Border**: The priority `<select>` dropdown dynamically adapts its left border color to match the selected priority, giving users instant visual feedback before clicking "Add Task".

---

### 🤖 Prompt 4: Phase 2 State Persistence & Hydration Defense
**Engineer Query:**
> "How do we implement browser `localStorage` persistence in React so that hard refreshes retain the user's board state, while preventing JSON parse crashes or empty boards on first load?"

**Engineering Analysis & Takeaways:**
- **Lazy Initial State**: Passed an initializer function to `useState(() => { ... })` in `App.jsx`. This executes synchronously once during component mounting rather than re-reading `localStorage` on every render:
  ```javascript
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('kanban_tasks_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.warn('Failed to parse localStorage tasks:', err);
    }
    return INITIAL_TASKS; // Realistic fallback seed
  });
  ```
- **Automated Sync Effect**: A single `useEffect([tasks])` serializes the current state back to `localStorage` on any state transition.
- **Fail-Safe Seed Data**: Included realistic seed engineering tasks in `INITIAL_TASKS`, ensuring evaluators are immediately greeted with a populated, interactive board.

---

### 🤖 Prompt 5: Phase 3 Real-Time Search & Drag-and-Drop Interaction
**Engineer Query:**
> "In Phase 3, we need real-time data filtering and physical drag-and-drop between columns. How do we implement high-performance real-time search without mutating state arrays, and how do we coordinate drag events between cards and column drop targets?"

**Engineering Analysis & Takeaways:**
- **Non-Destructive Memoized Filtering**: Implemented `useMemo` in `App.jsx` taking `[tasks, searchQuery, priorityFilter]` as dependencies. Original `tasks` array remains pristine in memory and `localStorage`, while the visible UI dynamically responds to keystrokes.
- **HTML5 Drag-and-Drop Pipeline**:
  1. **Card (`TaskCard.jsx`)**: Declared `draggable={!isEditing}`. On `dragStart`, sets `e.dataTransfer.setData('text/plain', task.id)` and applies `.task-card-dragging` (semi-transparent, rotated).
  2. **Column Dropzone (`KanbanColumn.jsx`)**: Listens to `onDragOver` (`e.preventDefault()`), `onDragEnter`, `onDragLeave` (toggles `.column-drop-active`), and `onDrop`.
  3. **Drop Resolution**: Retrieves task ID from dataTransfer and dispatches `onMoveTask(droppedTaskId, column.id)`.
- **Dual Interaction Grace (Accessibility)**: Kept directional move buttons (`<` and `>`) alongside drag-and-drop. This guarantees full keyboard accessibility and touch screen compliance while fulfilling both Phase 1 and Phase 3 requirements.

---

## 🧪 Part 2: Comprehensive QA Verification Matrix

| Test ID | Category | Action / Input | Expected Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **TC-01** | UI Architecture | Initial page load in browser | 3 columns ("To Do", "In Progress", "Done") render cleanly with respective counts and badges. | **PASSED** ✅ |
| **TC-02** | Phase 1: Add Task | Enter "Deploy staging cluster" + Select "High" + Click "Add Task" | New card injected at top of "To Do" column with red border and toast notification. | **PASSED** ✅ |
| **TC-03** | Phase 1: Validation | Submit empty or whitespace task title | Form shows friendly error message; task is not created. | **PASSED** ✅ |
| **TC-04** | Phase 1: Move Buttons | Click `>` button on a "To Do" card | Task smoothly shifts from "To Do" to "In Progress". Velocity counter recalculates. | **PASSED** ✅ |
| **TC-05** | Phase 1: Move to Done | Click `>` button on an "In Progress" card | Task transitions to "Done". Sprint velocity percentage updates in header. | **PASSED** ✅ |
| **TC-06** | Phase 1: Delete Task | Click trash icon on any card | Task is immediately excised from state and persistent storage; toast notification confirms. | **PASSED** ✅ |
| **TC-07** | Phase 2: Inline Edit | Click on card title text | Title switches to active `<input>` field with save (check) and cancel (X) buttons. | **PASSED** ✅ |
| **TC-08** | Phase 2: Edit Commit | Type new title and press `Enter` | Title updates in state; card reverts to display mode with updated text. | **PASSED** ✅ |
| **TC-09** | Phase 2: Edit Cancel | Type changes and press `Escape` | Changes are discarded; card title reverts to original text. | **PASSED** ✅ |
| **TC-10** | Phase 2: Priority CSS | Check High, Medium, Low cards | High displays Red left border; Medium displays Yellow; Low displays Green. | **PASSED** ✅ |
| **TC-11** | Phase 2: Persistence | Make additions, edits, and moves, then trigger hard browser refresh (`Ctrl+F5`) | All tasks, column positions, edits, and priorities remain 100% intact from `localStorage`. | **PASSED** ✅ |
| **TC-12** | Phase 3: Drag & Drop | Drag a card from "To Do" and drop over "Done" column | Target column illuminates with blue dashed border; on release, card moves to "Done". | **PASSED** ✅ |
| **TC-13** | Phase 3: Real-Time Search | Type "middleware" into global search bar | Board filters in real-time, showing only matching cards and updating count to "Showing 1 of X tasks". | **PASSED** ✅ |
| **TC-14** | Phase 3: Priority Filter | Click "High" priority pill | Only High-priority tasks across all columns are displayed. | **PASSED** ✅ |
| **TC-15** | Demo Reset | Click "Reset Demo" button in header | Prompts user confirmation, then restores initial sprint tasks and clears search queries. | **PASSED** ✅ |

---

## 🎬 Part 3: 3-Minute QA Demo Video Script

**Presenter:** Associate Frontend Engineer  
**Sprint:** Sprint 05 — Kanban Task Board Module  
**Target Audience:** Engineering Evaluator / Prodesk IT Review Committee  
**Total Duration:** 3 minutes (180 seconds)

```
[0:00 - 0:25] Introduction & Architectural Overview
[Camera on screen showing the running Kanban Board at localhost:3000 / Vercel]
Speaker:
"Hello team and engineering evaluators. This is my Sprint 05 submission for the
Kanban Task Board module.
Per our engineering guidelines, modern enterprise web apps are entirely state-driven.
There is zero imperative DOM manipulation in this codebase—no document.getElementById
or querySelectors. Everything is controlled via React's declarative state model,
leveraging useState hooks, unidirectional data flow, and prop lifting.
The project is bootstrapped with Vite, completely avoiding deprecated create-react-app tooling."

[0:25 - 0:55] Phase 1: MVP Core Functionality (P0 Deliverables)
[Action: Mouse hovers over the 3 columns: To Do, In Progress, Done]
Speaker:
"Let's inspect our Phase 1 P0 baseline requirements.
Here is our 3-column architecture: 'To Do', 'In Progress', and 'Done'.
To demonstrate task creation, let's type 'Implement OAuth 2.0 PKCE flow',
select High priority, and submit.
Notice how the new task is immediately injected into our 'To Do' state array.
Now let's demonstrate column mutation using our action buttons. Clicking the chevron
shifts the card from 'To Do' to 'In Progress', and clicking it again advances it to 'Done'.
Notice how our sprint velocity progress bar in the header automatically updates from
active state calculations.
Finally, clicking the universal delete icon removes the card cleanly from state."

[0:55 - 1:35] Phase 2: UI/UX Polish & State Persistence (P1 Deliverables)
[Action: Click on a task title to demonstrate inline editing, then inspect priority borders]
Speaker:
"Moving to Phase 2. First is inline editing: when I click on any card title,
the component seamlessly toggles into an editable input field. I can update the text,
press the Enter key, and the state updates immediately. If I press Escape, it safely cancels.
Second, observe our priority styling system:
High priority tasks render with a distinct Red border.
Medium priority tasks render with a Yellow/Amber border.
Low priority tasks render with a Green border.
Third, let's verify State Persistence. I'll make a few changes—move a task, create a new one.
Now, watch as I perform a hard refresh with Ctrl+Shift+R...
As you can see, every single task, column status, and priority persists flawlessly
because our React state is synchronized with browser localStorage."

[1:35 - 2:25] Phase 3: Advanced Interactions (P2 Deliverables)
[Action: Drag a card physically across columns, then type into the search bar]
Speaker:
"Now let's examine Phase 3 advanced capabilities.
First: Drag-and-Drop. Instead of relying only on buttons, I can grab any card
by its drag handle and physically drag it across the board. Notice the target column
highlighting with a drop-zone indicator. Dropping it updates the card's column state
smoothly.
Second: Real-Time Data Filtering. In our global search bar, typing 'audit' filters
our rendered cards across all three columns instantly with zero lag.
We also added priority filter pills—clicking 'High' filters down to only mission-critical tasks.
Notice that clearing the filter restores our complete state with zero data loss,
demonstrating that our filtering uses memoized derived state rather than mutating the original array."

[2:25 - 3:00] Deployment, Code Quality & Wrap-Up
[Action: Show terminal running Vite build cleanly and preview Vercel production deployment]
Speaker:
"Under the hood, the component architecture is organized cleanly into modular components:
App, Header, TaskForm, SearchBar, KanbanBoard, KanbanColumn, and TaskCard.
The build runs cleanly with vite build in under 4 seconds, node_modules is properly excluded
in .gitignore, and the application is deployed live on Vercel.
Thank you for your time, and I look forward to your feedback during our upcoming All-Hands standup!"
```

---

## 💡 Part 4: Architectural Decisions & Self-Assessment

### 1. Why HTML5 Native Drag & Drop over heavy external libraries?
While external libraries like `react-beautiful-dnd` are popular, many suffer from React 18/19 strict-mode incompatibilities and bulky bundle footprints (100KB+). By implementing native HTML5 drag-and-drop events (`onDragStart`, `onDragOver`, `onDrop`), we achieve:
- Zero external drag dependency overhead.
- Flawless performance on modern evergreen browsers.
- Direct alignment with browser event standards.

### 2. Retaining Action Buttons Alongside Drag & Drop
Rather than completely removing the Move buttons, we kept compact directional controls. This guarantees **accessibility (WCAG 2.1 compliance)** for users navigating via keyboard or mobile touch devices where drag gestures can be cumbersome.

### 3. LocalStorage Defensive Parsing
Storage failures often occur due to corrupted browser caches or manual edits. Wrapping serialization and deserialization in defensive `try/catch` blocks with an automatic `INITIAL_TASKS` fallback prevents white-screen crashes for end users.
