import React, { useState, useEffect } from 'react'

import './style.css'

export function Input ({ validator, onChange, className }) {
  const [value, setValue] = useState('')

  const _onChange = (event) => setValue(event.target.value)
  const _onKeyUp = (event) => {
    if (event.key !== 'Enter') return
    if (!validator(value)) return
    onChange(value)
  }

  return (
    <input
      className={className}
      onChange={_onChange}
      placeholder={value}
      value={value}
      onKeyUp={_onKeyUp}
    ></input>
  )
}
