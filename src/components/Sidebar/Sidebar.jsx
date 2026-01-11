import React from 'react';
import styles from './Sidebar.module.css';

// Controlled Sidebar: collapsing is determined by the `collapsed` prop.
// Provide `onToggle` to handle user toggle actions externally.
export default function Sidebar({ collapsed = false, children }) {
    return (
        <aside className={collapsed ? `${styles.root} ${styles.collapsed}` : styles.root}>
            <div className={styles.content} aria-hidden={collapsed}>
                {children}
            </div>
        </aside>
    );
}
