import React, { useRef } from 'react'
import PropTypes from 'prop-types'

SlidingStringWindow.propTypes = {
  initial: PropTypes.string.isRequired,
  insert: PropTypes.string,
  replace: PropTypes.string,
  reset: PropTypes.bool,
}

export function SlidingStringWindow ({ initial, insert, replace, reset = false }) {
  const string = useRef(initial);

  const length = string.current.length

  if (insert) {
    string.current = string.current
      .substring(insert.length, length) + insert
  }

  if (replace) {
    string.current = string.current
      .substring(0, length - replace.length) + replace
  }

  if (reset) {
    string.current = initial
  }

  return (
    <p style={{ whiteSpace: 'pre' }}>
      {string.current}
    </p>
  )
}
