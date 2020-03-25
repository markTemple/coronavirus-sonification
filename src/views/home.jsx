import React, { useEffect } from 'react'
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

  const genomeSub = genome.substring(index-40, index+41)
  function makeComplementary (seq) {
    return seq.replace(/./g, (char) => MAPS.COMPLEMENTARY_MAP[char])
  }

  const genSubComp = makeComplementary(genomeSub);
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

  // console.log(MAPS.geneBank_json)
  // console.log(index)

  let rnaFeature = 'untranslated';
  for(var feature of MAPS.geneBank_json){
  if ( (index+1 >= feature.start) && (index <= feature.end) ) {
      rnaFeature = feature
    }
  }
  // console.log('rnaFeature = ', rnaFeature)

  return (
    <>
      <h2>{MAPS.source}</h2>
      {/* <Button onClick={getGenome}>Load Genome</Button> */}
      <p style={{ whiteSpace:'pre' }}>                                        {index+1}</p>
      <p>........................................{indexChar}........................................</p>
      <p>{dotfill + genomeSub}</p>
      {/* <p>{dotfill + genSubComp}</p> */}
      <p> {rnaFeature.gene} extends {rnaFeature.start} from to {rnaFeature.end}  bp</p>
      <p> {rnaFeature.product} {rnaFeature.protein_id}</p>

      <Input onChange={actions.set} validator={(value) => Number.isInteger(Number(value))} />
      <br />
      <Button onClick={actions.increment}>Increment</Button>
      <Button onClick={actions.decrement}>Decrement</Button>
      <hr></hr>
      <PlayGenome />
    </>
  )
}
/*
      <p>{markstamp}</p>
      <Button onClick={getMarkstamp}>Load Markstamp</Button>
*/


