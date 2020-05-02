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
    // else if (string.startsWith('UGA')) {
    //   result.push(
    //     <span className='stop'>UGA</span>
    //   )
    //   string = string.substring(3)
    // }

    // else if (string.startsWith('UAG')) {
    //   result.push(
    //     <span className='stop'>UAG</span>
    //   )
    //   string = string.substring(3)
    // }

    // else if (string.startsWith('UAA')) {
    //   result.push(
    //     <span className='stop'>UAA</span>
    //   )
    //   string = string.substring(3)
    // }

     if (string.startsWith('CUCUAAACGAACUU')) {
      result.push(
        <span className='stop'>CUCUAAACGAACUU</span>
      )
      string = string.substring(14)
    }
    else if (string.startsWith('AACUAAACGAACAAUG')) {
      result.push(
        <span className='stop'>AACUAAACGAACAAUG</span>
      )
      string = string.substring(16)
    }
    else if (string.startsWith('ACAUAAACGAACUUAUG')) {
      result.push(
        <span className='stop'>ACAUAAACGAACUUAUG</span>
      )
      string = string.substring(17)
    }
    else if (string.startsWith('AUGAGUACGAACUUAUG')) {
      result.push(
        <span className='stop'>AUGAGUACGAACUUAUG</span>
      )
      string = string.substring(17)
    }
    else if (string.startsWith('GUCUAAACGAACUA')) {
      result.push(
        <span className='stop'>GUCUAAACGAACUA</span>
      )
      string = string.substring(14)
    }
    else if (string.startsWith('UACAUCACGAACGC')) {
      result.push(
        <span className='stop'>UACAUCACGAACGC</span>
      )
      string = string.substring(14)
    }
    else if (string.startsWith('GAUUAAACGAACAUG')) {
      result.push(
        <span className='stop'>GAUUAAACGAACAUG</span>
      )
      string = string.substring(15)
    }
    else if (string.startsWith('GCCUAAACGAACAUG')) {
      result.push(
        <span className='stop'>GCCUAAACGAACAUG</span>
      )
      string = string.substring(15)
    }
    else if (string.startsWith('AUCUAAACGAACAA')) {
      result.push(
        <span className='stop'>AUCUAAACGAACAA</span>
      )
      string = string.substring(14)
    }
    else if (string.startsWith('GCCUAAACUCAUGC')) {
      result.push(
        <span className='stop'>GCCUAAACUCAUGC</span>
      )
      string = string.substring(14)
    }
    else if (string.startsWith('AUG')) {
      result.push(
        <span className='start'>AUG</span>
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
