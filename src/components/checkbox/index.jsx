import React from 'react'

export function Checkbox ({ default: defaultChecked, onClick }) {
  return (
    <input
      type='checkbox'
      defaultChecked={defaultChecked}
      onClick={(e) => onClick(e.target.checked)}
    >
    </input>
  )
}
