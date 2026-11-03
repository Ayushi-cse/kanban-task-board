# Sprint 05: Kanban Task Board — Engineering Specification

## 📌 Executive Overview
- **Project**: Kanban Task Board (Trello-Style Workflow Management)
- **Role**: Junior Full Stack Developer / React Engineering Trainee
- **Module**: Sprint 05 — React Onboarding, Declarative State & Prop Drilling
- **Tech Stack**: React 18, Vite 5, JavaScript (ES6+), HTML5 Drag and Drop API, LocalStorage API, Lucide React Icons, Modern Modular CSS.
- **Architectural Directive**: Zero direct DOM manipulation (`document.getElementById` is strictly prohibited). The UI is a pure function of state.

---

## 🎯 Engineering Objectives & Deliverable Matrix

### Phase 1: Base MVP & Component Logic (Mandatory Deliverables — P0)
*Fulfills the baseline functional requirement for grading eligibility.*

| Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **UI Architecture** | 3-column layout: **To Do**, **In Progress**, and **Done** with dynamic counter badges and responsive column containers. | Complete ✅ |
| **Add Task** | Controlled form capturing task title and priority, injecting a new task object directly into the "To Do" array state. | Complete ✅ |
| **Delete Task** | Universal delete action button on each rendered card invoking lifted state excision in `App.jsx`. | Complete ✅ |
| **Move Task** | Directional action buttons (`<` and `>`) on each card mutating column state from "To Do" ➔ "In Progress" ➔ "Done". | Complete ✅ |

---

### Phase 2: UI/UX Polish & Persistence (Priority 1 Features — P1)
*Demonstrates advanced state handling, conditional styling, and persistence.*

| Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **Inline Editing** | Toggle state where clicking a task card converts the title into an editable input field with auto-focus, Enter to commit, and Escape to cancel. | Complete ✅ |
| **Priority System** | Dropdown during task creation (High, Medium, Low). Conditionally renders CSS based on priority: **High = Red border**, **Medium = Yellow border**, **Low = Green border**. | Complete ✅ |
| **State Persistence** | React state hooked into browser `localStorage`. Complete board state, column assignments, and task edits persist across hard page refreshes (`Ctrl+F5`). | Complete ✅ |

---

### Phase 3: Advanced Interactions (Priority 2 Features — P2)
*Engineers aiming for top engineering ratings.*

| Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **Drag-and-Drop Architecture** | Physical dragging of cards across columns using HTML5 Drag-and-Drop (`draggable`, `onDragStart`, `onDragOver`, `onDrop`) with visual hover dropzone feedback. | Complete ✅ |
| **Data Filtering** | Global search input filtering cards by title in real-time, coupled with priority pill filter buttons and match count badge. | Complete ✅ |
| **Dual Accessibility** | Seamless synergy of physical drag-and-drop and accessible directional move buttons for complete keyboard/screen-reader compliance. | Complete ✅ |

---

## 🏗️ Component Architecture Tree

```
App.jsx (Root State & LocalStorage Synchronization)
 ├── Header.jsx (Sprint Velocity, Branding, Reset Demo)
 ├── TaskForm.jsx (Controlled Inputs: Title, Priority Dropdown, Validation)
 ├── SearchBar.jsx (Global Real-time Search & Priority Filter Pills)
 └── KanbanBoard.jsx (3-Column Layout Container)
      └── KanbanColumn.jsx (Column Dropzone & Card List)
           └── TaskCard.jsx (Inline Editing, Priority Border, Drag Handle, Delete & Move Actions)
```

---

## 📋 Evaluation Rubric Alignment

| Criteria | Scoring Requirement | Sprint 05 Implementation |
| :--- | :--- | :--- |
| **State Management** | Master `useState` and state lifting; no global Redux or direct DOM calls. | Single source of truth in `App.jsx`, props drilled to child components cleanly. |
| **Vite Initialization** | Bootstrapped with modern Vite toolchain; `create-react-app` deprecated. | Bootstrapped using Vite 5 + `@vitejs/plugin-react`. |
| **Priority Styling** | High = Red, Medium = Yellow, Low = Green. | Prominent custom borders and badges mapped directly via `card-border-*`. |
| **Persistence** | Data must survive hard browser refresh. | Synchronized with `localStorage.getItem` and `useEffect`. |
| **Documentation** | `Prompts.md` pair programming log, QA matrix, and video script. | Fully authored in `Prompts.md`. |
| **Deployment** | Deployed live to Vercel (Localhost links fail QA). | Automated Vite production build ready for 1-click Vercel deployment. |
