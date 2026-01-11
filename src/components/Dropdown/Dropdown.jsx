import { useState, useRef, useEffect } from 'react'
import styles from './Dropdown.module.css'

function Dropdown({ closeCTX, options, style }) {
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          closeCTX();
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <>
      <ul class={styles['dropdownMenu']} style={style}
        ref={wrapperRef}>
        {options.map((item, index) => (
          <li key={index}>{item}</li> // Using index as a key if no stable ID is available
        ))}
      </ul>
    </>
  )
}

export default Dropdown
