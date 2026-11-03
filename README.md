# SprintFlow // Modern React Kanban Board

[![React 18](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4.11-646CFF.svg)](https://vitejs.dev/)
[![Deployment: Vercel](https://img.shields.io/badge/Deployment-Vercel-black.svg)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A high-performance, Trello-style Task Management Board architected in modern **React.js** using the **Vite** toolchain. Built as part of **Sprint 05: React Onboarding & Declarative State Architecture**, this enterprise module demonstrates mastery over Component Architecture, React Hooks (`useState`, `useEffect`, `useMemo`), Lifting State Up, HTML5 Drag-and-Drop, and Browser Persistence.

---

## 🚀 Key Features by Sprint Phase

### Phase 1: Base MVP & Component Logic (P0 Mandatory)
- **3-Column Workflow Architecture**: Structured columns for **To Do**, **In Progress**, and **Done** with dynamic task counters and status badges.
- **Controlled Task Injection**: Dedicated task creation form capturing user input and injecting new task objects into the "To Do" state array.
- **Universal Delete Action**: Immediate card removal with instant state synchronization and user feedback.
- **Column Mutation Controls**: Accessible directional action buttons (`<` and `>`) allowing tasks to move seamlessly between workflow columns.

### Phase 2: UI/UX Polish & State Persistence (P1 Priority)
- **Inline Task Editing**: Click any task title to toggle it into an editable input field with automatic focus, `Enter` key to commit changes, and `Escape` key to revert.
- **Three-Tier Priority System**: Selectable dropdown during task creation with conditionally rendered borders:
  - 🔴 **High Priority**: Vibrant Red border (`#ef4444`)
  - 🟡 **Medium Priority**: Amber/Yellow border (`#f59e0b`)
  - 🟢 **Low Priority**: Emerald/Green border (`#10b981`)
- **Persistent State Storage**: Integrated with browser `localStorage`. All tasks, edits, priority updates, and column states persist across hard browser reloads (`Ctrl+F5`).

### Phase 3: Advanced Interactions (P2 Elite)
- **HTML5 Drag-and-Drop**: Smooth, physical dragging of cards between columns with semi-transparent dragging states, column drop-zone highlights, and drop event coordinates.
- **Real-Time Data Filtering**: Instant search input filtering tasks by title across all three columns without mutating the underlying persistent state.
- **Priority Filter Pills**: Instant one-click filter pills (`All`, `High`, `Medium`, `Low`) to isolate critical sprint items.
- **Sprint Velocity Tracker**: Dynamic sprint progress indicator in the navigation header reflecting the percentage of completed tasks.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: React 18.3+ (Strict Mode)
- **Build Tool**: Vite 5
- **Styling**: Modern CSS Design Tokens & CSS Custom Properties (Dark enterprise theme)
- **Icons**: Lucide React
- **Persistence**: Web Storage API (`localStorage`)
- **Deployment Target**: Vercel / Netlify / GitHub Pages

### Component Hierarchy
```
src/
├── App.jsx                     # Root component, single-source-of-truth state, localStorage sync
├── App.css                     # Component design system, animations, priority borders
├── index.css                   # Global tokens, reset, typography
├── main.jsx                    # React 18 root mounting
├── constants/
│   ├── columns.js              # Column configurations, priority options, storage keys
│   └── initialTasks.js         # Realistic demo sprint data
└── components/
    ├── Header.jsx              # Navigation bar, sprint velocity progress, demo reset
    ├── TaskForm.jsx            # Controlled input, priority select dropdown, input validation
    ├── SearchBar.jsx           # Real-time search query, priority filter pills, match counts
    ├── KanbanBoard.jsx         # 3-column grid container and drag coordinator
    ├── KanbanColumn.jsx        # Column header, task counter badge, drop-zone event listeners
    └── TaskCard.jsx            # Inline title editing, priority borders, drag handles, move/delete actions
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- Node.js version 18.0 or higher
- npm (Node Package Manager)

### Installation Steps

1. **Clone or navigate to the repository:**
   ```bash
   cd kanban-task-board
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Start the local Vite development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   ```
   http://localhost:3000
   ```

5. **Execute a production build:**
   ```bash
   npm run build
   ```

---

## 🚢 Vercel Deployment Protocol (Step-by-Step)

Per Sprint instructions, **Localhost links will fail QA evaluation**. Follow these steps to deploy your live build to Vercel:

1. **Initialize Git & Commit:**
   ```bash
   git init
   git add .
   git commit -m "feat: complete Sprint 05 Kanban Task Board (Phase 1, 2 & 3)"
   ```

2. **Push to GitHub:**
   - Create a new repository on [GitHub](https://github.com/new) named `kanban-task-board`.
   - Link and push your local branch:
     ```bash
     git remote add origin https://github.com/YOUR_USERNAME/kanban-task-board.git
     git branch -M main
     git push -u origin main
     ```

3. **Deploy on Vercel:**
   - Log into [Vercel](https://vercel.com/).
   - Click **"Add New Project"** ➔ **"Import Git Repository"**.
   - Select your `kanban-task-board` repository.
   - Vercel automatically detects Vite:
     - **Framework Preset**: Vite
     - **Build Command**: `vite build`
     - **Output Directory**: `dist`
   - Click **"Deploy"**. Your live production URL will be ready in under 60 seconds.

---

## 🧪 QA Testing & Demo Video

- **QA Testing Matrix**: Refer to [Prompts.md](Prompts.md#part-2-comprehensive-qa-verification-matrix) for test cases covering all phases.
- **3-Minute QA Video Script**: Refer to [Prompts.md](Prompts.md#part-3-3-minute-qa-demo-video-script) for the exact script, screen actions, and timing guide.

---

## 📄 License
This project is open-source under the MIT License.
