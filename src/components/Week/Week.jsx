import React from 'react';
import Day from '../Day/Day';
import styles from './Week.module.css';

const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function secondsSinceMidnight(date = new Date()) {
    return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
}

export default function Week({ startDate = new Date(), showGlobalNowLine = true, minuteHeight = 1, tasks = [], dragTask }) {
    const s = new Date(startDate);
    const dayIndex = s.getDay();
    s.setDate(s.getDate() - dayIndex);

    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(s);
        d.setDate(s.getDate() + i);
        return d;
    });

    const wrapRef = React.useRef(null);
    const [now, setNow] = React.useState(new Date());
    React.useEffect(() => {
        if (!showGlobalNowLine) return;
        const id = setInterval(() => setNow(new Date()), 30_000);
        return () => clearInterval(id);
    }, [showGlobalNowLine]);

    return (
        <div className={styles.weekWrap} ref={wrapRef}>
            {days.map((d, idx) => (
                <div key={idx} className={styles.dayColumn}>
                    <div className={styles.header}>
                        <div className={styles.weekday}>{weekdayNames[d.getDay()]}</div>
                        <div className={styles.date}>{d.toLocaleDateString()}</div>
                    </div>
                    <div className={styles.dayInner}>
                        <Day date={d} tasks={filterDayTasks(d, tasks)} showNowLine={false} minuteHeight={minuteHeight} dragTask={dragTask} />
                    </div>
                </div>
            ))}

            {showGlobalNowLine && wrapRef.current && (() => {
                const firstDay = wrapRef.current.querySelector('[data-day="true"]');
                if (!firstDay) return null;
                const wrapRect = wrapRef.current.getBoundingClientRect();
                const dayRect = firstDay.getBoundingClientRect();
                const offsetTop = dayRect.top - wrapRect.top;
                const dayHeight = firstDay.offsetHeight || 1440;
                const topPx = offsetTop + (secondsSinceMidnight(now) / 86400) * dayHeight;

                return (
                    <div
                        className={styles.globalNowLine}
                        style={{ top: `${topPx}px` }}
                        aria-hidden
                    />
                );
            })()}
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
