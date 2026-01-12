import React from 'react';
import styles from './Day.module.css';
import DragoverBox from '../DragoverBox/DragoverBox';
import EventOverlay from '../EventOverlay/EventOverlay';

function formatHour(h) {
    const am = h < 12 || h === 24;
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:00 ${am ? 'AM' : 'PM'}`;
}

export default function Day({ showNowLine = true, visibleRanges = [[0, 24 * 60 * 60]], minuteHeight = 1, date = new Date(), tasks = [], dragTask, first = true, dropTask }) {
    const [now, setNow] = React.useState(new Date());

    const [dragOverHighlight, setDragoverHighlight] = React.useState({ active: false, positionSet: false, y: 0, height: 0 })
    const dragCounter = React.useRef(0);
    const dropZoneRef = React.useRef(null);


    function dragoverHandler(e) {
        e.preventDefault();
        if (dropZoneRef.current) {
            var rect = dropZoneRef.current.getBoundingClientRect();
            const snapSize = minuteHeight * 30;
            const rawY = e.clientY - rect.top
            const snappedY = Math.round(rawY / snapSize) * snapSize;
            const height = (dragTask.duration) * minuteHeight
            setDragoverHighlight({ ...dragOverHighlight, positionSet: true, y: snappedY, height: `${height}px` });
        }
    }

    function dragEnterHandler(e) {
        e.preventDefault();
        if (e.target === dropZoneRef.current || dropZoneRef.current.contains(e.target)) {
            dragCounter.current++;
            setDragoverHighlight({ ...dragOverHighlight, active: true });
        }
    }

    function dragLeaveHandler(e) {
        e.preventDefault();
        if (dragCounter.current > 0) {
            dragCounter.current--;
        }
        if (dragCounter.current === 0) {
            setDragoverHighlight({ ...dragOverHighlight, active: false, positionSet: false });
        }
    }

    function dropHandler(e) {
        e.preventDefault();
        dragCounter.current = 0;
        var rect = dropZoneRef.current.getBoundingClientRect();
        const snapSize = minuteHeight * 30;
        const rawY = e.clientY - rect.top
        const snappedY = Math.round(rawY / snapSize) * snapSize;
        dropTask(dragTask.id, timeFromPX(date, rect.height, snappedY));
        setDragoverHighlight({ ...dragOverHighlight, active: false, positionSet: false });
    }

    React.useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 30_000);
        return () => clearInterval(t);
    }, []);

    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const topPercent = (minutesSinceMidnight / (24 * 60)) * 100;
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayHeight = minuteHeight * 1440; // pixels for full day
    const hourHeight = minuteHeight * 60; // pixels per hour row

    // visibleRanges is now specified in seconds-of-day: 0..86399
    const clamp = (v, min, max) => Math.max(min, Math.min(max, Number(v) || 0));

    const visibleSeconds = (visibleRanges || [])
        .map(([s, e]) => [clamp(s, 0, 86399), clamp(e, 0, 86399)])
        .filter(([s, e]) => e >= s)
        .sort((a, b) => a[0] - b[0]);

    // complement -> dark ranges in seconds
    const darkRanges = [];
    let cursorSec = 0;
    visibleSeconds.forEach(([s, e]) => {
        if (s > cursorSec) darkRanges.push([cursorSec, s - 1]);
        cursorSec = Math.max(cursorSec, e + 1);
    });
    if (cursorSec <= 86399) darkRanges.push([cursorSec, 86399]);

    return (
        <div className={styles.dayWrap}>
            <div
                ref={dropZoneRef}
                onDragOver={dragoverHandler}
                onDragEnter={dragEnterHandler}
                onDragLeave={dragLeaveHandler}
                onDrop={dropHandler}
                className={styles.day}
                data-day="true"
                style={{ height: `${dayHeight}px`, borderLeft: `${first ? '1px solid #e6e6e6' : 'none'}` }}
            >
                <DragoverBox visible={dragOverHighlight.active && dragOverHighlight.positionSet} y={dragOverHighlight.y} height={dragOverHighlight.height} />

                {tasks.map((task) => {
                    return (<EventOverlay key={task.id} y={(pxFromTime(date, dayHeight, task.start))} height={task.duration * minuteHeight} text={task.label} color={task.color} />)
                })}

                {hours.map((h) => (
                    <div key={h} className={styles.hour} style={{ height: `${hourHeight}px` }}>
                        <div className={styles.hourLabel}>{formatHour(h)}</div>
                        <div className={styles.hourBody} />
                    </div>
                ))}

                {/* dark overlays (complement of visibleRanges) - darkRanges are in seconds-of-day */}
                {darkRanges.map(([startSec, endSec], i) => {
                    const topPct = (startSec / 86400) * 100;
                    const heightPct = ((endSec - startSec + 1) / 86400) * 100;
                    return (
                        <div
                            key={`dark-${i}`}
                            className={styles.overlayDark}
                            style={{ top: `${topPct}%`, height: `${heightPct}%` }}
                        />
                    );
                })}

                {showNowLine && (
                    <div
                        className={styles.nowLine}
                        style={{ top: `${topPercent}%` }}
                        aria-hidden
                    />
                )}
            </div>
        </div >
    );
}

function timeFromPX(date, rectHeight, topPX) {
    const msInDay = 86400000;
    const msFromMidnight = Math.floor(topPX / rectHeight * msInDay);
    return new Date(date.getTime() + msFromMidnight);
}

function pxFromTime(date, rectHeight, time) {
    const msInDay = 86400000;
    const midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const msFromMidnight = time - midnight;
    return (msFromMidnight / msInDay) * rectHeight;
}