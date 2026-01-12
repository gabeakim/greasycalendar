import React, { useState } from 'react';
import MonthView from '../MonthView/MonthView';
import Week from '../Week/Week';
import Day from '../Day/Day';
import styles from './Calendar.module.css';

export default function Calendar({ tasks, dragTask, dropTask }) {
    const [current, setCurrent] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });
    const [view, setView] = useState('month'); // month, week, day

    function prev() {
        setCurrent(d => {
            const nd = new Date(d);
            if (view === 'month') return new Date(nd.getFullYear(), nd.getMonth() - 1, 1);
            if (view === 'week') { nd.setDate(nd.getDate() - 7); return nd; }
            // day
            nd.setDate(nd.getDate() - 1);
            return nd;
        });
    }

    function next() {
        setCurrent(d => {
            const nd = new Date(d);
            if (view === 'month') return new Date(nd.getFullYear(), nd.getMonth() + 1, 1);
            if (view === 'week') { nd.setDate(nd.getDate() + 7); return nd; }
            // day
            nd.setDate(nd.getDate() + 1);
            return nd;
        });
    }

    return (
        <div className={styles.calendarRoot}>
            <div className={styles.calendarHeader}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onClick={prev} className={styles.navButton}>&lt;</button>
                    <div className={styles.calendarTitle}>
                        {view === 'month' && current.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
                        {view === 'week' && (() => {
                            const wkStart = new Date(current);
                            wkStart.setDate(current.getDate() - current.getDay());
                            const wkEnd = new Date(wkStart);
                            wkEnd.setDate(wkStart.getDate() + 6);
                            return `${wkStart.toLocaleDateString()} - ${wkEnd.toLocaleDateString()}`;
                        })()}
                        {view === 'day' && current.toLocaleDateString()}
                    </div>
                    <button onClick={next} className={styles.navButton}>&gt;</button>
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                            aria-label="Previous view"
                            onClick={() => {
                                const views = ['month', 'week', 'day'];
                                const i = views.indexOf(view);
                                const ni = (i - 1 + views.length) % views.length;
                                const v = views[ni];
                                setView(v);
                                setCurrent(curr => {
                                    const c = new Date(curr);
                                    if (v === 'month') return new Date(c.getFullYear(), c.getMonth(), 1);
                                    return v === 'week' ? c : new Date(c.getFullYear(), c.getMonth(), c.getDate());
                                });
                            }}
                            className={styles.navButton}
                        >&lt;</button>

                        <div style={{ minWidth: 72, textAlign: 'center' }}>{view.charAt(0).toUpperCase() + view.slice(1)}</div>

                        <button
                            aria-label="Next view"
                            onClick={() => {
                                const views = ['month', 'week', 'day'];
                                const i = views.indexOf(view);
                                const ni = (i + 1) % views.length;
                                const v = views[ni];
                                setView(v);
                                setCurrent(curr => {
                                    const c = new Date(curr);
                                    if (v === 'month') return new Date(c.getFullYear(), c.getMonth(), 1);
                                    return v === 'week' ? c : new Date(c.getFullYear(), c.getMonth(), c.getDate());
                                });
                            }}
                            className={styles.navButton}
                        >&gt;</button>
                    </div>

                    {/* granularity removed; keep view selector only */}
                </div>
            </div>
            {view === 'month' && <MonthView monthStart={current} tasks={filterMonthTasks(current, tasks)} dragTask={dragTask} dropTask={dropTask} />}
            {view === 'week' && <Week startDate={current} tasks={filterWeekTasks(current, tasks)} dragTask={dragTask} dropTask={dropTask} />}
            {view === 'day' && <Day date={current} tasks={filterDayTasks(current, tasks)} dragTask={dragTask} dropTask={dropTask} />}
        </div>
    );
}

function toTaskDate(task) {
    if (!task) return null;
    if (typeof task.getDate === 'function') {
        try {
            const d = task.getDate();
            return d instanceof Date ? d : new Date(d);
        } catch (e) {
            return null;
        }
    }
    if (task.date) return new Date(task.date);
    if (task.start) return new Date(task.start);
    if (task.datetime) return new Date(task.datetime);
    return null;
}

function filterMonthTasks(monthStart, tasks) {
    if (!Array.isArray(tasks)) return [];
    return tasks.filter(t => {
        const d = toTaskDate(t);
        return d && d.getFullYear() === monthStart.getFullYear() && d.getMonth() === monthStart.getMonth();
    });
}

function filterWeekTasks(startDate, tasks) {
    if (!Array.isArray(tasks)) return [];
    const wkStart = new Date(startDate);
    wkStart.setDate(startDate.getDate() - startDate.getDay());
    wkStart.setHours(0, 0, 0, 0);
    const wkEnd = new Date(wkStart);
    wkEnd.setDate(wkStart.getDate() + 6);
    wkEnd.setHours(23, 59, 59, 999);
    return tasks.filter(t => {
        const d = toTaskDate(t);
        return d && d >= wkStart && d <= wkEnd;
    });
}

function filterDayTasks(dayDate, tasks) {
    if (!Array.isArray(tasks)) return [];
    const dayStart = new Date(dayDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayDate);
    dayEnd.setHours(23, 59, 59, 999);
    return tasks.filter(t => {
        const d = toTaskDate(t);
        return d && d >= dayStart && d <= dayEnd;
    });
}
