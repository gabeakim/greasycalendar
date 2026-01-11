import React from 'react';
import styles from './DayCell.module.css';
import DragoverBox from '../DragoverBox/DragoverBox';

export default function DayCell({ day, isToday, position = { top: false, left: false } }) {
    const [dragOverHighlight, setDragoverHighlight] = React.useState(false)
    const dragCounter = React.useRef(0);
    const dropZoneRef = React.useRef(null);
    function dragEnterHandler(e) {
        e.preventDefault();
        if (e.target === dropZoneRef.current || dropZoneRef.current.contains(e.target)) {
            dragCounter.current++;
            setDragoverHighlight(day && true);
        }
    }
    function dragLeaveHandler(e) {
        e.preventDefault();
        if (dragCounter.current > 0) {
            dragCounter.current--;
        }
        if (dragCounter.current === 0) {
            setDragoverHighlight(false);
        }
    }
    function dropHandler(e) {
        e.preventDefault();
        dragCounter.current = 0;
        setDragoverHighlight(false);
    }

    const cls = [styles.dayCell];
    if (!day) cls.push(styles.empty);
    if (isToday) cls.push(styles.today);
    if (position.top) cls.push(styles.top);
    if (position.left) cls.push(styles.left);

    return (
        <div
            className={cls.join(' ')}
            ref={dropZoneRef}
            onDragEnter={dragEnterHandler}
            onDragLeave={dragLeaveHandler}
            onDrop={dropHandler}>
            <DragoverBox visible={dragOverHighlight} />
            {day ? day.getDate() : ''}
        </div>
    );
}
