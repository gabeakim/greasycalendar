import React from "react";
import './App.css'
import Sidebar from './components/Sidebar/Sidebar';
import Calendar from './components/Calendar/Calendar';
import Chip from './components/Chip/Chip';
import Task from "./utils/Task";

export default function App() {
  const [dragTask, setDragTask] = React.useState(null);
  const [collapsed, setCollapsed] = React.useState(false);
  const [tasks, setTasks] = React.useState(() => [
    new Task({ label: 'b', color: 'red' }),
    new Task({ label: 'a', color: 'blue' }),
    new Task({ label: 'Meeting', color: 'purple', start: Date.now(), duration: 60 }),
    new Task({ label: 'Workout', color: 'green', start: Date.now(), duration: 30 })
  ]);

  React.useEffect(() => {
    try { localStorage.setItem('sidebar-collapsed', collapsed ? '1' : '0'); } catch (e) { }
  }, [collapsed]);

  return (
    <div className="app-root">
      <div className="app-layout">
        <Sidebar collapsed={collapsed}>
          <div className="sidebar-chips" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tasks.map((t) => (
              <Chip key={t.id} chipData={t} setDragTask={setDragTask} />
            ))}
          </div>
        </Sidebar>
        <div className="sidebar-column">
          <button
            className={`sidebar-pin-btn ${collapsed ? '' : 'open'}`}
            aria-label="Pinned Action"
            onClick={() => { setCollapsed(!collapsed) }}
          >
            {/* Hamburger SVG */}
            <svg className="icon icon-hamburger" width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="0" y="0" width="20" height="2" rx="1" fill="currentColor" />
              <rect x="0" y="6" width="20" height="2" rx="1" fill="currentColor" />
              <rect x="0" y="12" width="20" height="2" rx="1" fill="currentColor" />
            </svg>

            {/* Left arrow SVG (chevron) */}
            <svg className="icon icon-arrow" width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M11 2 L5 7 L11 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <main className="main-content">
          <h1>Calendar</h1>
          <Calendar tasks={tasks.filter(t => t.getStart() !== null)} dragTask={dragTask} />
        </main>
      </div>
    </div >
  );
}