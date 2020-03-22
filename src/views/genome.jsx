import React, { useEffect } from 'react'
import { useGenome } from '../hooks'

export function Genome () {
  const [genome, getGenome] = useGenome()

  useEffect(getGenome, [])

  return (
    <p>{genome}</p>
  )
}
