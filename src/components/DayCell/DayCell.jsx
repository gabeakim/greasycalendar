import React from 'react';
import styles from './DayCell.module.css';
import DragoverBox from '../DragoverBox/DragoverBox';

export default function DayCell({ day, isToday, position = { top: false, left: false } }) {
    const [dragOverHighlight, setDragoverHighlight] = React.useState(false)
    const dragCounter = React.useRef(0);
    const dropZoneRef = React.useRef(null);
    const cls = [styles.dayCell];
    if (!day) cls.push(styles.empty);
    if (isToday) cls.push(styles.today);
    if (position.top) cls.push(styles.top);
    if (position.left) cls.push(styles.left);

    return (
        <div
            className={cls.join(' ')}
            ref={dropZoneRef}
            onDragEnter={(e) => {
                e.preventDefault();
                if (e.target === dropZoneRef.current || dropZoneRef.current.contains(e.target)) {
                    dragCounter.current++;
                    setDragoverHighlight(day && true)
                }
            }}
            onDragLeave={(e) => {
                e.preventDefault();
                if (dragCounter.current > 0) {
                    dragCounter.current--;
                }
                if (dragCounter.current === 0) {
                    setDragoverHighlight(false)
                }
            }}
            onDrop={(e) => {
                e.preventDefault();
                dragCounter.current = 0;
                setDragoverHighlight(false);
            }}>
            <DragoverBox visible={dragOverHighlight} />
            {day ? day.getDate() : ''}
        </div>
    );
}
