import React from 'react'

import './style.css'

export function Button ({ children, onClick, className }) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  )
}
