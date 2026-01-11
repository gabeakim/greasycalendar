import React from 'react';
import { buildMonthMatrix, isSameDay } from '../../utils/dateUtils';
import DayCell from '../DayCell/DayCell';
import styles from './MonthView.module.css';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MonthView({ monthStart, tasks = [] }) {
    const matrix = buildMonthMatrix(monthStart);
    const today = new Date();

    return (
        <div className={styles.monthView}>
            <div className={styles.weekdays}>
                {weekdays.map(d => (
                    <div key={d} className={styles.weekday}>{d}</div>
                ))}
            </div>
            <div className={styles.weeks}>
                {matrix.map((week, wi) => (
                    <div className={styles.week} key={wi}>
                        {week.map((day, di) => (
                            <DayCell key={di} day={day} isToday={day && isSameDay(day, today)} position={{ top: wi === 0, left: di === 0 }} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
