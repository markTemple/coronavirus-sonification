import React, { useEffect, useRef } from 'react'
import { useIndex, useGenome, useMarkstamp } from '../hooks'
import { Button } from '../components/button'
import { Input } from '../components/input'
import { PlayGenome } from '../components/play-genome'

//  import single array?
import * as MAPS from '../utilities/maps';

export function Home () {
  const [index, actions] = useIndex()
  const [genome, getGenome] = useGenome()
  const [markstamp, getMarkstamp] = useMarkstamp()


  return (
    <>

      <PlayGenome />





      {/* <Button onClick={getGenome}>Load Genome</Button>
      <Input onChange={actions.set} validator={(value) => Number.isInteger(Number(value))} />
      <br /> */}
    </>
  )
}
  // <p>{markstamp}</p>
  // <Button onClick={getMarkstamp}>Load Markstamp</Button>


