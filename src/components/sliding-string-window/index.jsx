// @ts-check
import React, { useRef, useState, useEffect } from 'react'
import PropTypes, { element } from 'prop-types'
import { getPlayhead } from '../../state/playhead'
import { useSelector } from '../../state/store'

const value = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    content: PropTypes.string,
    props: PropTypes.object
  })
])

//insert; bit like push string and pop equal bit off other end
//replace; chop of end in lenth to match new bit

//(reset back to initial )
SlidingStringWindow.propTypes = {
  initial: value,
  insert: value,
  replace: value,
  reset: PropTypes.bool,
}

const convertToObject = (value) => {
  if (typeof value === 'object') return value
  return { content: value }
}

export function SlidingStringWindow ({ initial, insert, replace, reset = false }) {
  const playhead = useSelector(getPlayhead)
  initial = convertToObject(initial)
  insert = convertToObject(insert)
  replace = convertToObject(replace)

  const elements = useRef([initial])

  useEffect(() => {
    if (reset) {
      elements.current.length = 0
      elements.current.push(initial)
    }

    if (insert.content) {
      let remainder = insert.content.length

      while (remainder) {
        const index = 0
        const string = elements.current[index].content

        if (string.length <= remainder) {
          elements.current.splice(index, 1)
          remainder -= string.length
        } else {
          elements.current[index].content = string.substring(remainder)
          remainder = 0
        }
      }

      elements.current.push(insert)
    }

    if (replace.content) {
      let remainder = replace.content.length

      while (remainder) {
        const index = elements.current.length - 1
        const string = elements.current[index].content

        if (string.length <= remainder) {
          elements.current.splice(index, 1)
          remainder -= string.length
        } else {
          elements.current[index].content = string.substring(0, string.length - remainder)
          remainder = 0
        }
      }

      elements.current.push(replace)
    }
  }, [playhead])

  return (
    <>
      {elements.current.map((element, index) => (
        <span
          key={index}
          {...element.props}
          // style={{ whiteSpace: 'pre', ...element.props?.style }}
          style={{...element.props?.style }}
        >
          {element.content}
        </span>
      ))}
    </>
  )
}
