import React, { useEffect } from 'react'
import { useIndex, useGenome, useMarkstamp } from '../hooks'

import { Button } from '../components/button'
import { Input } from '../components/input'
import { PlayGenome } from '../components/play-genome'

//  import single array?
import { COMPLEMENTARY_MAP } from '../utilities/maps'

export function Home () {
  const [index, actions] = useIndex()
  const [genome, getGenome] = useGenome()
  const [markstamp, getMarkstamp] = useMarkstamp()

  const genomeSub = genome.substring(index-40, index+41)
  function makeComplementary (seq) {
    return seq.replace(/./g, (char) => COMPLEMENTARY_MAP[char])
  }

//  const genSubComp = makeComplementary(genomeSub);
  const indexChar = genome.substr(index, +1);
  //console.log(indexChar);

//  if(!reversed) return dotfill = '....>'
//  if(reversed) return dotfill = '<....'
  let dotfill = '........................................';
  function moveDot () {
    if (index <= 40) {
      dotfill = dotfill.slice(index);
    }else{
      dotfill = '';
    }
  }
moveDot();

  useEffect(getGenome, [])

//don't show comp for viral RNA just show plus strand <p>{dotfill + genSubComp}</p>
  return (
    <>
      <h1>Auto-Matic Cyto-Matic Gene-o-Matic Tone-o-Matic for the people</h1>
      <Button onClick={getGenome}>Load Genome</Button>
      <p>........................................{indexChar}........................................</p>
      <p>{dotfill + genomeSub}</p>
      <p>{index}</p>
      <Input onChange={actions.set} validator={(value) => Number.isInteger(Number(value))} />
      <br />
      <Button onClick={actions.increment}>Increment</Button>
      <Button onClick={actions.decrement}>Decrement</Button><hr></hr>
      <PlayGenome />
    </>
  )
}
/*
      <p>{markstamp}</p>
      <Button onClick={getMarkstamp}>Load Markstamp</Button>
*/


