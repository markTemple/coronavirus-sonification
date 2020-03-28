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

  const genomeSub = genome.substring(index-40, index+41)
  // function makeComplementary (seq) {
  //   return seq.replace(/./g, (char) => MAPS.COMPLEMENTARY_MAP[char])
  // }

  // const genSubComp = makeComplementary(genomeSub);
  const indexChar = genome.substr(index, +1);
  //console.log(indexChar);

  let dotfill40 = '........................................';
  function moveDot () {
    if (index <= 40) {
      dotfill40 = dotfill40.slice(index);
    }else{
      dotfill40 = '';
    }
  }
  moveDot();

  let rnaFeature = 'default';
  for(var feature of MAPS.geneBank_json){
  if ( (index+1 >= feature.start) && (index <= feature.end) ) {
      rnaFeature = feature
      //buttonIndex.current = MAPS.geneBank_json.indexOf(feature)
    }
  }

  return (
    <>
      <h2>{MAPS.source}</h2>
            {/* <Button onClick={getGenome}>Load Genome</Button> */}
      <p style={{ whiteSpace:'pre' }}>                                        {index+1}</p>
      <p style={{ whiteSpace:'pre' }}>                                        {indexChar}</p>
      {/* <p>{dotSliced} </p> */}
      <p>{dotfill40 + genomeSub}</p>
      {/* <p>{dotfill40 + genSubComp}</p> */}
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


