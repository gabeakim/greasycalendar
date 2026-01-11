import { useState } from 'react'
import styles from './Chip.module.css'
import Dropdown from '../Dropdown/Dropdown.jsx';

function Chip({ chipData, setDragTask }) {
  const [ctxMenu, setCTX] = useState({ active: false, style: {} });

  const closeCTX = () => {
    setCTX({ active: false, style: {} });
  }

  const handleContext = (e) => {
    e.preventDefault();
    setCTX({ active: true, style: { top: e.clientY + 'px', left: e.clientX + 'px', position: 'absolute' } });
  };

  const Dropdown2 = ctxMenu.active ? <Dropdown closeCTX={closeCTX} style={ctxMenu.style} options={['option1', 'option2', 'option3']} /> : null;

  return (
    <>
      {Dropdown2}
      <div className={styles['chipWrapper']}
        draggable="true"
        onDragStart={() => { setDragTask(chipData) }}
        onContextMenu={handleContext}
      >
        <div className={styles['chipStrip']} style={{ backgroundColor: chipData.getColor() }}></div>
        <span className={styles['chipText']}>{chipData.label}</span>
      </div>
    </>
  )
}

export default Chip
