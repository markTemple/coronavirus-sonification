import React, { useState, useEffect, useRef, Fragment } from 'react';
import Tone from 'tone';
import { Song, Track, Instrument } from 'reactronica';
import { useIndex, useGenome } from '../../hooks';
import * as MAPS from '../../utilities/maps';
import { Button } from '../button';

import './style.css';

//var frame = MAPS.frameCount();
//const counter = MAPS.frameCount();
//console.log(counter());

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
    return [{ name: MAPS.BASE_MAP[base], duration: '2n', motif: base }];
  }
  const baseNotes = getBaseNotes();
  // console.log(baseNotes);

  //0 is initial which is currentGATCcount
  const GATCcount = useRef(0)

  function GATCcounter(base) {
    //console.log(base)
    if ( (base == 'C') || (base == 'G') ) GATCcount.current += 1
    if ( (base == 'A') || (base == 'T') ) GATCcount.current -= 1
    return GATCcount.current
  }
GATCcounter(baseNotes[0].motif)

  function playTwoBase() {
    const twoBase = genome.substring(index, index + 2);
    return [{ name: MAPS.TWOBASE_MAP[twoBase], duration: '3n' }];
    /*console.log(base);*/
    if (index % 2 === 0) return [{ name: MAPS.TWOBASE_MAP[twoBase], duration: '3n', motif: twoBase }];
  }
  const twobaseNotes = playTwoBase();

  function getCodonNotes() {
    const codon = genome.substring(index, index + 3);
    const frame012 = index % 3;
    const playcount = 0;

    if (codon === 'TGA' || codon === 'TAG' || codon === 'TAA') {
      //console.log('stop')
      setSynthStatus(frame012, false);
    }
    if (codon === 'ATG') {
      //console.log('start')
      setSynthStatus(frame012, true);
    }
    return [
      {
        name: MAPS.CODON_MAP[codon],
        duration: '8n',
        frame012: frame012,
        isSynthEnabled: isSynthEnabled.current[frame012]
      },
    ];
  }
  const codonNotes = getCodonNotes();

const codonF1Notes = codonNotes.filter(note => note.frame012 === 0 && note.isSynthEnabled);
const codonF2Notes = codonNotes.filter(note => note.frame012 === 1 && note.isSynthEnabled);
const codonF3Notes = codonNotes.filter(note => note.frame012 === 2 && note.isSynthEnabled);

  let Array10bpGCratio = MAPS.calcMotif_GC(
    genome.substring(index, index + 10),
    0,
    10
  );

  let noooo = 'C1'
  function base10GC() {
    //console.log(Array10bpGCratio[0].ratio)
    //change to oscillate wildly
    if(Array10bpGCratio[0].ratio <= 0.5) noooo = 'C3'
    if(Array10bpGCratio[0].ratio > 0.5) noooo = 'C4'
    return [{ name: noooo, duration: '8n' }];
  }
  const tenGCnote = base10GC();
  //console.log(tenGCnote[0].name)

  let Array100bpGCratio = MAPS.calcMotif_GC(
    genome.substring(index, index + 100),
    0,
    100
  );
  let noooo100 = ''
  function base100GC() {
    // if (index % 50 === 0)
    //   oscGCDIST.triggerAttackRelease(880 * Array100bpGCratio[1], '2n');
        // mapp Array100bpGCratio[1] to note replace C6
        if(Array100bpGCratio[0].ratio <= 0.5) noooo100 = 'C5'
        if(Array100bpGCratio[0].ratio > 0.5) noooo100 = 'C6'
        return [{ name: noooo100, duration: '16n' }];
  }
  const tentensGCnote = base100GC();
  //console.log('10x10 = ',tentensGCnote[0].name)

  //if start/stop in each frame do this
  const codon = genome.substring(index, index + 3);
  const frame012 = index % 3;

  function colorCodon() {
    if (isSynthEnabled.current[frame012] === true) {
      return <span className="start"> {codon}</span>;
    } else if (isSynthEnabled.current[frame012] === false) {
      return <span className="stop"> {codon}</span>;
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
    return (
      <Fragment key={i}>
        <Button onClick={() => actions.set(feature.start - 1)}>
        {/* {feature.gene} */}
        <p style={{ whiteSpace:'pre' }}>{feature.button_label}</p></Button>{' '}
        {/* {feature.product} */}
      </Fragment>
    );
  }

  return (
    <>
      {MAPS.geneBank_json.map(Feature)}

      <p> 1 base {genome[index]} {GATCcount.current} </p>
      <p> 2 playTwoBase {twobaseNotes[0].name}</p>

      <p> 3a codonF1{codonF1}</p>
      <p> 3b codonF2{codonF2}</p>
      <p> 3c codonF3{codonF3}</p>

      <p> 4 GC Content 10 base {tenGCnote[0].name}</p>
      <p> 5 GC Content 100 base {tentensGCnote[0].name}</p>

      <Button onClick={play}>Play</Button>
      <Button onClick={stop}>Stop</Button>
      {/* <Button onClick={reverse}>Reverse</Button>
      <Button onClick={playBase}>Play Base</Button> */}
      {/* <Button onClick={playCodon}>Play Codon</Button>
      <Button onClick={base10GC}>Each 10bp GC ratio</Button>
      <Button onClick={base100GC}>Play 100 GCcontent</Button>
      <Button onClick={playTwoBase}>Play diNucleotide</Button>*/}

      <Song>
        <Track>
          <Instrument type={'synth'} notes={baseNotes} />
        </Track>
        <Track>
          <Instrument type={'synth'} notes={twobaseNotes} />
        </Track>
        <Track >
          <Instrument type={'synth'} notes={codonF1Notes} />
        </Track>
        <Track>
          <Instrument type={'synth'} notes={codonF2Notes} />
        </Track>
        <Track>
          <Instrument type={'synth'} notes={codonF3Notes} />
        </Track>
       <Track>
          <Instrument type={'synth'} notes={tenGCnote} />
        </Track>
         <Track>
          <Instrument type={'synth'} notes={tentensGCnote} />
        </Track>
      </Song>
    </>
  );
}
