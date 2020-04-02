import React from 'react'
import PropTypes from 'prop-types'

import './style.css'

GenomeDisplay.propTypes = {
  children: PropTypes.string.isRequired
}

export function GenomeDisplay ({ children: genome, ...props }) {
  let result = []

  const regex = /(ATG)/g;
  const foundReg = genome.match(regex);
  //console.log(foundReg)

  if (genome.includes('ATG')){
  //  console.log('found')
  }

  const searchTerm = 'ATG';
  const indexOfFirst = genome.indexOf(searchTerm);
  //console.log(indexOfFirst)

  /*
    Loop through the genome string and extract all ATG and replace with span.
  */
  let string = genome
  while (string.length) {
    if (string.startsWith('ATG')) {
      result.push(
        <span className='start'>ATG</span>
      )
      string = string.substring(3)
    }

    if (string.startsWith('TGA')) {
      result.push(
        <span className='stop'>TGA</span>
      )
      string = string.substring(3)
    }

    if (string.startsWith('TAG')) {
      result.push(
        <span className='stop'>TAG</span>
      )
      string = string.substring(3)
    }

    if (string.startsWith('TAA')) {
      result.push(
        <span className='stop'>TAA</span>
      )
      string = string.substring(3)
    } else {
      result.push(string[0])
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


  // for (var i = 0; i < genome.length; i++) {
  //   //console.log(genome.charAt(i));
  //   if ((genome.slice(i, i+3)) === 'ATG') {
  //     console.log(i)
  //     console.log('found ATG')
  //     newStr += `<p span={{ ClassName: 'green' }}>`+'ATG'+ '</span>'
  //     console.log(newStr)
  //   }else {
  //     newStr += genome.slice(i, i+3)
  //   }
  // }

  return (
    <span {...props}>
      {result}
    </span>
  )
}
