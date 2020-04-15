import React from 'react'
import PropTypes from 'prop-types'

import './style.css'

GenomeDisplay.propTypes = {
  children: PropTypes.string.isRequired
}

export function GenomeDisplay ({ children: genome, ...props }) {
  let result = []
  /*
    Loop through the genome string and extract all AUG and replace with span.
  */

  let string = genome
  while (string.length) {
    if (string.startsWith('AUG')) {
      result.push(
        <span className='start'>AUG</span>
      )
      string = string.substring(3)
    }
    else if (string.startsWith('UGA')) {
      result.push(
        <span className='stop'>UGA</span>
      )
      string = string.substring(3)
    }

    else if (string.startsWith('UAG')) {
      result.push(
        <span className='stop'>UAG</span>
      )
      string = string.substring(3)
    }

    else if (string.startsWith('UAA')) {
      result.push(
        <span className='stop'>UAA</span>
      )
      string = string.substring(3)
    }

    else {
      result.push(
        <span className='base'>{string[0]}</span>
      )
      string = string.substring(1)
    }
  }

  /*
    Iterate throught the result array and combine all single character strings
    into one larger string.
  */
  result = result.reduce((result, value) => {
    const index = result.length - 1
    if (
      typeof value === 'string' &&
      typeof result[index] === 'string'
    ) {
      result[index] = result[index] + value
    } else {
      result.push(value)
    }

    return result
  }, [])

  return (
    <span {...props}>
      {result}
    </span>
  )
}
