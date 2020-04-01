import React, { useState, useEffect, useRef, Fragment } from 'react';
import Tone from 'tone';
import { Song, Track, Instrument, Effect } from 'reactronica';
import { useIndex, useGenome } from '../../hooks';
import * as MAPS from '../../utilities/maps';
import { Button } from '../button';
import { SlidingStringWindow } from '../sliding-string-window'

import './style.css';
import { GenomeDisplay } from '../genome-display';

export function PlayGenome() {
  const [genome, getGenome] = useGenome();
  const [index, actions] = useIndex();
  const direction = useRef(false);

  const isSynthEnabled = useRef([false, false, false])
  function setSynthStatus(index, value) {
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
    if (index % 2 === 0) {
      return [{ name: MAPS.TWOBASE_MAP[twoBase], duration: '2n', motif: twoBase }];
    } else { return [{ name: '', duration: '', motif: '' }]; }
  }
  const twobaseNotes = playTwoBase();

  function getCodonNotes() {
    const codon = genome.substring(index, index + 3);
    const frame012 = index % 3;

    if (codon === 'TGA' || codon === 'TAG' || codon === 'TAA') {
      setSynthStatus(frame012, false);
    }
    if (codon === 'ATG') {
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
    if (ratio.ratio < 0.25) note = 'C2'
    else if (ratio.ratio < 0.5) note = 'C3'
    else if (ratio.ratio < 0.75) note = 'C4'
    else if (ratio.ratio <= 1.0) note = 'C5'
    if (index % modulus) return [{ name: note, duration: '1m', motif: ratio.motif, ratio: ratio.ratio }];
    else return [{ name: '', duration: '', motif: ratio.motif, ratio: ratio.ratio }];
  }

  let Array10bpGCratio =
    MAPS.calcMotif_GC(genome.substring(index, index + 10), 0, 10);
  const tenGCnote = ratioToNote(Array10bpGCratio[0], 4);

  let Array100bpGCratio =
    MAPS.calcMotif_GC(genome.substring(index, index + 100), 0, 100);
  const tentensGCnote = ratioToNote(Array100bpGCratio[0], 10);
  // console.log(tentensGCnote)

  //if start/stop in each frame do this
  const codon = genome.substring(index, index + 3);
  const frame012 = index % 3;

  let metaNote = []
  if (index === 266 - 6) metaNote = [{ name: 'B7', duration: '4n' }]
  if (index === 266 - 5) metaNote = [{ name: 'G6', duration: '4n' }]
  if (index === 266 - 4) metaNote = [{ name: 'E6', duration: '4n' }]
  if (index === 266 - 3) metaNote = [{ name: 'C6', duration: '4n' }]

  if (index === 21563 - 6) metaNote = [{ name: 'B7', duration: '4n' }]
  if (index === 21563 - 5) metaNote = [{ name: 'G6', duration: '4n' }]
  if (index === 21563 - 4) metaNote = [{ name: 'E6', duration: '4n' }]
  if (index === 21563 - 3) metaNote = [{ name: 'C6', duration: '4n' }]

  if (index === 26245 - 6) metaNote = [{ name: 'B7', duration: '4n' }]
  if (index === 26245 - 5) metaNote = [{ name: 'G6', duration: '4n' }]
  if (index === 26245 - 4) metaNote = [{ name: 'E6', duration: '4n' }]
  if (index === 26245 - 3) metaNote = [{ name: 'C6', duration: '4n' }]

  if (index === 26523 - 6) metaNote = [{ name: 'B7', duration: '4n' }]
  if (index === 26523 - 5) metaNote = [{ name: 'G6', duration: '4n' }]
  if (index === 26523 - 4) metaNote = [{ name: 'E6', duration: '4n' }]
  if (index === 26523 - 3) metaNote = [{ name: 'C6', duration: '4n' }]

  if (index === 28274 - 6) metaNote = [{ name: 'B7', duration: '4n' }]
  if (index === 28274 - 5) metaNote = [{ name: 'G6', duration: '4n' }]
  if (index === 28274 - 4) metaNote = [{ name: 'E6', duration: '4n' }]
  if (index === 28274 - 3) metaNote = [{ name: 'C6', duration: '4n' }]

  //ugly color but not cause of colored blanl spave
  function colorCodon() {
    if (isSynthEnabled.current[frame012] === true) {
      return <span className='stop'>{codon}</span>;
    } else if (isSynthEnabled.current[frame012] === false) {
      return <span className='start'>{codon}</span>;
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
    if ((index + 1 >= feature.start) && ((index < feature.end))) {
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
          <p style={{ whiteSpace: 'pre' }}>{feature.button_label}</p>
        </Button>{' '}
        {/* {feature.product} */}
      </Fragment>
    );
  }

  const genomeSub = genome.substring(index - 40, index + 41)
  function makeComplementary(seq) {
    return seq.replace(/./g, (char) => MAPS.ANTICODON_MAP[char])
  }
  const indexChar = genome.substr(index, +3);
  const antiCodon = makeComplementary(indexChar);

  let dotfill40 = '........................................';
  function moveDot() {
    if (index <= 40) {
      dotfill40 = dotfill40.slice(index);
    } else {
      dotfill40 = '';
    }
  }
  moveDot();

  let rnaFeature = 'default';
  for (var feature of MAPS.geneBank_json) {
    if ((index + 1 >= feature.start) && (index <= feature.end)) {
      rnaFeature = feature
      //buttonIndex.current = MAPS.geneBank_json.indexOf(feature)
    }
  }

  // const SW1_PropStyle = {
  //   content: codonF1Notes[0]?.motif,
  //   props: {
  //     id: '',
  //     className: 'frame1',
  //     style: {
  //       backgroundColor: '#ebc844'
  //     }
  //   }
  // }

  const SW1_PropStyle = {
    content: codonF1Notes[0]?.motif,
    props: {
      className: 'frame1 circle',
    }
  }
  const SW2_PropStyle = {
    content: codonF2Notes[0]?.motif,
    props: {
      className: 'frame2 circle',
    }
  }

  const SW3_PropStyle = {
    content: codonF3Notes[0]?.motif,
    props: {
      className: 'frame3 circle',
    }
  }

  return (
    <>
      <h2>{MAPS.source}</h2>
      <p>{rnaFeature.gene} extends from {rnaFeature.start} to {rnaFeature.end} bp</p>
      <hr />
      <p style={{ whiteSpace: 'pre' }}>Sonification of RNA translation to produce an amino acid chain</p>
      <br />
      <div>
        <span>
          Frame1
          <span className='pre'>
            <span className='six'> {String(AA_Count1.current).padStart(4, '0')}</span>
          </span>|
        </span>
        <SlidingStringWindow
          initial='                                           '
          insert=' '
          replace={SW1_PropStyle}
        />
      </div>

      <div>
        <span>
          Frame2
          <span className='pre'>
            <span className='six'> {String(AA_Count2.current).padStart(4, '0')}</span>
          </span>|
        </span>
        <SlidingStringWindow
          initial='                                           '
          insert=' '
          replace={SW2_PropStyle}
        />
      </div>

      <div>
        <span>
          Frame3
          <span className='pre'>
            <span className='six'> {String(AA_Count3.current).padStart(4, '0')}</span>
          </span>|
        </span>
        <SlidingStringWindow
          initial='                                           '
          insert=' '
          replace={SW3_PropStyle}
        />
      </div>

      <p className='pre'>
        <span>            5`                                      </span>
        <span className='antiC'>{antiCodon}</span>
        <span>                                    3`</span>
      </p>

      <div className='ribosomeSmall'></div>
      <div className='ribosomeBig'></div>
      <div className='playhead'></div>

      <div>
        <span className='thr'> RNAbp</span>
        <span className='six'> {String(index + 1).padStart(5, '0')}</span>|
        <GenomeDisplay className='rna'>{dotfill40 + genomeSub}</GenomeDisplay>
      </div>

      <br />
      <Button onClick={play}>Play</Button>
      <Button onClick={stop}>Stop</Button>
      <Button onClick={actions.increment}>Increment</Button>
      <Button onClick={actions.decrement}>Decrement</Button>
      <hr />
      <br />

      {MAPS.geneBank_json.map(Feature)}

      <div className='row'>
        <div className='column'>
          <p> Nucleotide at Playhead {genome[index]} {GATCcount.current} {baseNotes[0].name}</p>
          <p> Di-Nucleotide at Playhead {twobaseNotes[0].motif} {twobaseNotes[0].name}</p>
          <p> GC Content over 10 base {tenGCnote[0].ratio} {tenGCnote[0].name} {/*tenGCnote[0].motif*/}</p>
          <p> GC Content over 100 base {tentensGCnote[0].ratio} {tentensGCnote[0].name} {/*tentensGCnote[0].motif*/}</p>
        </div>
        <div className='column'>
          <p>
            Frame 1 Codon to AA residue:
            <span className='backF1'>{codonF1}</span>
            <span className='circle2 frame1'>{codonF1Notes[0]?.motif}</span>
          </p>
          <p>
            Frame 2 Codon to AA residue:
            <span className='backF2'>{codonF2}</span>
            <span className='circle2 frame2'>{codonF2Notes[0]?.motif}</span>
          </p>
          <p>
            Frame 3 Codon to AA residue:
            <span className='backF3'>{codonF3}</span>
            <span className='circle2 frame3'>{codonF3Notes[0]?.motif}</span>
          </p>
        </div>
      </div>

      {/* <Button onClick={reverse}>Reverse</Button>
      <Button onClick={playBase}>Play Base</Button> */}
      {/* <Button onClick={playCodon}>Play Codon</Button>
      <Button onClick={base10GC}>Each 10bp GC ratio</Button>
      <Button onClick={base100GC}>Play 100 GCcontent</Button>
      <Button onClick={playTwoBase}>Play diNucleotide</Button>*/}
      {/* <p> {rnaFeature.product} {rnaFeature.protein_id}</p> */}
      <hr />

      <Song>
        <Track volume={-8} pan={-0.3} >
          <Instrument type={'synth'} notes={baseNotes} />
        </Track>
        <Track volume={-8} pan={0.3} >
          <Instrument type={'synth'} notes={twobaseNotes} />
          <Effect type='feedbackDelay' wet={0.2} />
        </Track>
        <Track volume={-3} pan={-0.8} >
          <Instrument type={'synth'} oscillator={{ type: 'triangle' }}
            notes={codonF1Notes} />
          <Effect type='distortion' />
        </Track>
        <Track volume={-3} pan={0} >
          <Instrument type={'synth'} oscillator={{ type: 'triangle' }}
            notes={codonF2Notes} />
          <Effect type='distortion' />
        </Track>
        <Track volume={-3} pan={0.8} >
          <Instrument type={'synth'} oscillator={{ type: 'triangle' }}
            notes={codonF3Notes} />
          <Effect type='distortion' />
        </Track>
        <Track volume={-12} pan={-0.5} >
          <Instrument type={'amSynth'} notes={tenGCnote} />
          <Effect type='feedbackDelay' wet={0.2} /> </Track>
        <Track volume={-12} pan={0.5} >
          <Instrument type={'amSynth'} notes={tentensGCnote} />
          <Effect type='feedbackDelay' wet={0.2} /> </Track>
        <Track volume={-3} pan={0.5} >
          <Instrument type={'amSynth'} notes={metaNote} />
          <Effect type='feedbackDelay' wet={0.5} /> </Track>
        {/* do something as orf length reaches every 50th AA residue */}
      </Song>
    </>
  );
}
