import React from 'react'

import './style.css'

export function Button ({ children, ...props }) {
  return (
    <button {...props}>
      {children}
    </button>
  )
}
