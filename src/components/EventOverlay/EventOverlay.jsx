import React from 'react';
import styles from './EventOverlay.module.css';

export default function EventOverlay({ x, y, height, text, color }) {
    return (
        <>
            <div
                className={styles["overlay-box"]}
                style={{
                    height: height ? height : '95%', top: (y !== undefined) ? y : "50%",
                    left: (x !== undefined) ? x : "50%",
                    transform: `${(x !== undefined) ? '' : 'translateX(-50%)'} ${(y !== undefined) ? '' : 'translateY(-50%)'}`,
                    opacity: 0.5,
                    backgroundColor: color || 'blue',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-start',
                    color: 'white'
                }}>
                {text}
            </div >
        </>
    );
}