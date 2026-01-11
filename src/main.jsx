import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Calendar from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Calendar resolution="month" date={new Date()} />
  </StrictMode>,
)
