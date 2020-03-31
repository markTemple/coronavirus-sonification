import React, { useState, useEffect, useRef, Fragment } from 'react';
import Tone from 'tone';
import { Song, Track, Instrument, Effect } from 'reactronica';
import { useIndex, useGenome } from '../../hooks';
import * as MAPS from '../../utilities/maps';
import { Button } from '../button';
import { SlidingStringWindow } from '../sliding-string-window'

import './style.css';

export function PlayGenome() {
  const [genome, getGenome] = useGenome();
  const [index, actions] = useIndex();
  const direction = useRef(false);

  const isSynthEnabled = useRef([false, false, false])
  function setSynthStatus (index, value) {
    isSynthEnabled.current[index] = value
  }

  function getBaseNotes() {
    const base = genome[index];
    return [{ name: MAPS.BASE_MAP[base], duration: '16n', motif: base }];
  }
  const baseNotes = getBaseNotes();
  // console.log(baseNotes);

  const GATCcount = useRef(0)
  const GTACbase = baseNotes[0].motif
  if (GTACbase === 'C' || GTACbase === 'G') GATCcount.current++;
  if (GTACbase === 'A' || GTACbase === 'T') GATCcount.current--;

  function playTwoBase() {
    const twoBase = genome.substring(index, index + 2);
    /*console.log(base);*/
    if (index % 2 === 0) {return [{ name: MAPS.TWOBASE_MAP[twoBase], duration: '2n', motif: twoBase }];
  } else { return  [{ name: '', duration: '', motif: '' }]; }
  }
  const twobaseNotes = playTwoBase();

  function getCodonNotes() {
    const codon = genome.substring(index, index + 3);
    const frame012 = index % 3;

    if (codon === 'TGA' || codon === 'TAG' || codon === 'TAA') {
      //console.log('stop')
      setSynthStatus(frame012, false);
    }
    if (codon === 'ATG') {
      //console.log('start')
      setSynthStatus(frame012, true);
    }

    return {
      name: MAPS.CODON_MAP2[codon]?.Note,
      duration: '8n',
      frame012: frame012,
      isSynthEnabled: isSynthEnabled.current[frame012],
      motif: MAPS.CODON_MAP2[codon]?.AA,
      codon: codon,
    }
  }

  const codonF1Notes = [];
  const codonF2Notes = [];
  const codonF3Notes = [];

  const codonNote = getCodonNotes();

  const AA_Count1 = useRef(0)
  const AA_Count2 = useRef(0)
  const AA_Count3 = useRef(0)

  if (codonNote.frame012 === 0) {
    if (codonNote.isSynthEnabled) {
      codonF1Notes.push(codonNote)
      AA_Count1.current++
    } else {
      AA_Count1.current = 0
    }
  }

  if (codonNote.frame012 === 1) {
    if (codonNote.isSynthEnabled) {
      codonF2Notes.push(codonNote)
      AA_Count2.current++
    } else {
      AA_Count2.current = 0
    }
  }

  if (codonNote.frame012 === 2) {
    if (codonNote.isSynthEnabled) {
      codonF3Notes.push(codonNote)
      AA_Count3.current++
    } else {
      AA_Count3.current = 0
    }
  }
  // console.log(codonF1Notes);

  function ratioToNote(ratio, modulus) {
    let note = 'C1'
    if(ratio.ratio < 0.25) note = 'C2'
    else if(ratio.ratio < 0.5) note = 'C3'
    else if(ratio.ratio < 0.75) note = 'C4'
    else if(ratio.ratio <= 1.0) note = 'C5'
    if(index % modulus) return [{ name: note, duration: '1m', motif: ratio.motif, ratio: ratio.ratio}];
    else return [{ name: '', duration: '', motif: ratio.motif, ratio: ratio.ratio}];
  }

  let Array10bpGCratio =
  MAPS.calcMotif_GC(genome.substring(index, index + 10), 0, 10 );
  const tenGCnote = ratioToNote(Array10bpGCratio[0], 4);

  let Array100bpGCratio =
  MAPS.calcMotif_GC(genome.substring(index, index + 100), 0, 100 );
  const tentensGCnote = ratioToNote(Array100bpGCratio[0], 10);
  // console.log(tentensGCnote)

  //if start/stop in each frame do this
  const codon = genome.substring(index, index + 3);
  const frame012 = index % 3;

  let metaNote = []
  if(index === 266 -6) metaNote = [{ name: 'B7', duration: '4n'}]
  if(index === 266 -5) metaNote = [{ name: 'G6', duration: '4n'}]
  if(index === 266 -4) metaNote = [{ name: 'E6', duration: '4n'}]
  if(index === 266 -3) metaNote = [{ name: 'C6', duration: '4n'}]

  if(index === 21563 -6) metaNote = [{ name: 'B7', duration: '4n'}]
  if(index === 21563 -5) metaNote = [{ name: 'G6', duration: '4n'}]
  if(index === 21563 -4) metaNote = [{ name: 'E6', duration: '4n'}]
  if(index === 21563 -3) metaNote = [{ name: 'C6', duration: '4n'}]

  if(index === 26245 -6) metaNote = [{ name: 'B7', duration: '4n'}]
  if(index === 26245 -5) metaNote = [{ name: 'G6', duration: '4n'}]
  if(index === 26245 -4) metaNote = [{ name: 'E6', duration: '4n'}]
  if(index === 26245 -3) metaNote = [{ name: 'C6', duration: '4n'}]

  if(index === 26523 -6) metaNote = [{ name: 'B7', duration: '4n'}]
  if(index === 26523 -5) metaNote = [{ name: 'G6', duration: '4n'}]
  if(index === 26523 -4) metaNote = [{ name: 'E6', duration: '4n'}]
  if(index === 26523 -3) metaNote = [{ name: 'C6', duration: '4n'}]

  if(index === 28274 -6) metaNote = [{ name: 'B7', duration: '4n'}]
  if(index === 28274 -5) metaNote = [{ name: 'G6', duration: '4n'}]
  if(index === 28274 -4) metaNote = [{ name: 'E6', duration: '4n'}]
  if(index === 28274 -3) metaNote = [{ name: 'C6', duration: '4n'}]

  //ugly color but not cause of colored blanl spave
  function colorCodon() {
    if (isSynthEnabled.current[frame012] === true) {
      return <span className="red">{codon}</span>;
    } else if (isSynthEnabled.current[frame012] === false) {
      return <span className="green">{codon}</span>;
    } else {
      return codon;
    }
  }
  let codonF1 = '';
  let codonF2 = '';
  let codonF3 = '';
  if (frame012 === 0) codonF1 = colorCodon();
  if (frame012 === 1) codonF2 = colorCodon();
  if (frame012 === 2) codonF3 = colorCodon();

  const play = () => Tone.Transport.start();
  const stop = () => Tone.Transport.stop();
  const reverse = () => (direction.current = !direction.current);

  useEffect(() => {
    Tone.Transport.scheduleRepeat(() => {
      direction.current ? actions.decrement() : actions.increment();
    }, '16n');
    return () => {
      Tone.Transport.cancel();
    };
  }, []);

  function Feature(feature, i) {
    const style = {}
    //add moer things to call here as const's
    if ( (index+1 >= feature.start) && ((index < feature.end))) {
      style.backgroundColor = '#f08b2c'

    }
    // include a reset GC count on click
    return (
    <Fragment key={i}>
      <Button
        onClick={() => {
          actions.set(feature.start - 1)
          setSynthStatus(0, false)
          setSynthStatus(1, false)
          setSynthStatus(2, false)
          GATCcount.current = 0
        }}
        style={style}
      >
      {/* there is no actual whitespace in button} */}
      <p style={{ whiteSpace:'pre' }}>{feature.button_label}</p>
      </Button>{' '}
      {/* {feature.product} */}
    </Fragment>
    );
}

const genomeSub = genome.substring(index-40, index+41)
function makeComplementary (seq) {
  return seq.replace(/./g, (char) => MAPS.ANTICODON_MAP[char])
}
const indexChar = genome.substr(index, +3);
const antiCodon = makeComplementary(indexChar);

//console.log(antiCodon);

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

{/* <div class="res-circle">
<div class="circle-txt">Ala</div>
</div> */}

    <h2>{MAPS.source}</h2>
    <p> {rnaFeature.gene} extends from {rnaFeature.start} to {rnaFeature.end}  bp</p>
    <hr></hr>
      <span className="res-circle">
        <span className="circle-txt"> {codonF1Notes[0]?.motif}
        </span>
      </span>

      <span className="res-circle">
        <span className="circle-txt">{codonF2Notes[0]?.motif}
        </span>
      </span>

      <span className="res-circle">
        <span className="circle-txt">{codonF3Notes[0]?.motif}
        </span>
      </span>
    <p style={{ whiteSpace:'pre' }}>                             Ribosomal Playhead {index+1}</p>

    <SlidingStringWindow
        initial='                                           '
        insert=' '
        replace={codonF1Notes[0]?.motif}
        frame = '1|'
      />
      <SlidingStringWindow
        initial='                                           '
        insert=' '
        replace={codonF2Notes[0]?.motif}
        frame = '2|'
      />
      <SlidingStringWindow
        initial='                                           '
        insert=' '
        replace={codonF3Notes[0]?.motif}
        frame = '3|'
      />
      <p>RNA Seq|<span className="rna" > {dotfill40 + genomeSub}</span></p>
      <p style={{ whiteSpace:'pre' }}>        5`                                       <span className="antiC">{antiCodon}</span>                                    3`</p>

      <Button onClick={play}>Play</Button>
      <Button onClick={stop}>Stop</Button>
      <Button onClick={actions.increment}>Increment</Button>
      <Button onClick={actions.decrement}>Decrement</Button><hr></hr>

      <p> Current ORF length = {AA_Count1.current} Codon <span className="backF1">{codonF1} {codonF1Notes[0]?.motif}</span></p>
      <p> Current ORF length = {AA_Count2.current} Codon <span className="backF2">{codonF2} {codonF2Notes[0]?.motif}</span></p>
      <p> Current ORF length = {AA_Count3.current} Codon <span className="backF3">{codonF3} {codonF3Notes[0]?.motif}</span></p>

      {MAPS.geneBank_json.map(Feature)}


      <p> Nucleotide at Playhead {genome[index]} {GATCcount.current} {baseNotes[0].name}</p>
      <p> Di-Nucleotide at Playhead {twobaseNotes[0].motif} {twobaseNotes[0].name} </p>

      <p> GC Content over 10 base {tenGCnote[0].ratio} {tenGCnote[0].name} {/*tenGCnote[0].motif*/}</p>
      <p> GC Content over 100 base {tentensGCnote[0].ratio} {tentensGCnote[0].name} {/*tentensGCnote[0].motif*/}</p>


      {/* <Button onClick={reverse}>Reverse</Button>
      <Button onClick={playBase}>Play Base</Button> */}
      {/* <Button onClick={playCodon}>Play Codon</Button>
      <Button onClick={base10GC}>Each 10bp GC ratio</Button>
      <Button onClick={base100GC}>Play 100 GCcontent</Button>
      <Button onClick={playTwoBase}>Play diNucleotide</Button>*/}
      {/* <p> {rnaFeature.product} {rnaFeature.protein_id}</p> */}
      <hr></hr>

      <Song>
        <Track volume={-8} pan={-0.3} >
          <Instrument type={'synth'} notes={baseNotes} />
        </Track>
        <Track volume={-8} pan={0.3} >
          <Instrument type={'synth'} notes={twobaseNotes} />
          <Effect type="feedbackDelay" wet={0.2} />
        </Track>
        <Track volume={-3} pan={-0.8} >
          <Instrument type={'synth'} oscillator={{type: 'triangle'}}
            notes={codonF1Notes} />
          <Effect type="distortion" />
        </Track>
        <Track volume={-3} pan={0} >
          <Instrument type={'synth'} oscillator={{type: 'triangle'}}
            notes={codonF2Notes} />
          <Effect type="distortion" />
        </Track>
        <Track volume={-3} pan={0.8} >
        <Instrument type={'synth'} oscillator={{type: 'triangle'}}
          notes={codonF3Notes} />
          <Effect type="distortion" />
        </Track>
        <Track volume={-12} pan={-0.5} >
          <Instrument type={'amSynth'} notes={tenGCnote} />
          <Effect type="feedbackDelay" wet={0.2} /> </Track>
        <Track volume={-12} pan={0.5} >
          <Instrument type={'amSynth'} notes={tentensGCnote} />
          <Effect type="feedbackDelay" wet={0.2} /> </Track>
        <Track volume={-3} pan={0.5} >
          <Instrument type={'amSynth'} notes={metaNote} />
        <Effect type="feedbackDelay" wet={0.5} /> </Track>
      </Song>
    </>
  );
}
