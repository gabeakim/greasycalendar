import React from 'react';
import styles from './DragoverBox.module.css';

export default function dragoverBox({ visible, x, y, height }) {
    return (
        <>
            <div className={styles["overlay-box"]} style={{ height: height ? height : '95%', top: y ? y : "50%", left: x ? x : "50%", transform: `${x ? '' : 'translateX(-50%)'} ${y ? 'translateY(-50%)' : 'translateY(-50%)'}`, visibility: visible ? "visible" : "hidden" }}></div >
        </>
    );
}