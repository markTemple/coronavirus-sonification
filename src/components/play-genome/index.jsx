import React, { useState, useEffect, useRef, useReducer } from 'react';
import Tone from 'tone';
import { Song, Track, Instrument } from 'reactronica';
import { useIndex, useGenome } from '../../hooks';
import * as MAPS from '../../utilities/maps';
import { Button } from '../button';

import './style.css';

//var frame = MAPS.frameCount();
const counter = MAPS.frameCount();
//console.log(counter());

// const reducer = (state, action) => {
//   switch(action.type) {

//   }
// }

export function PlayGenome() {
  const [genome, getGenome] = useGenome();
  const [index, actions] = useIndex();
  const direction = useRef(false);
  // const { synthNotes } = useReducer(reducer);

  //const oscGC = new Tone.Oscillator().toMaster()
  /*
  const oscGC = new Tone.PolySynth(1, Tone.Synth, {
    oscillator: { type: 'sine' },
  }).toMaster();

  var distortion = new Tone.Distortion(1.0);
  var tremolo = new Tone.Tremolo().start();
  const oscGCDIST = new Tone.PolySynth(1, Tone.Synth, {
    oscillator: { type: 'sawtooth' },
  }).chain(distortion, Tone.Master);
  const oscGCTREM = new Tone.PolySynth(1, Tone.Synth, {
    oscillator: { type: 'sawtooth' },
  }).chain(tremolo, Tone.Master);

  const monosynth = new Tone.MembraneSynth({
    pitchDecay: 0.01,
    octaves: 6,
    oscillator: {
      type: 'square4',
    },
    envelope: {
      attack: 0.001,
      decay: 0.2,
      sustain: 0,
    },
  }).toMaster();
  //monosynth.volume.value = -20

  const synth0 = new Tone.PolySynth(1, Tone.Synth, {
    oscillator: { type: 'triangle' },
  }).toMaster();
  const synth1 = new Tone.PolySynth(1, Tone.Synth, {
    oscillator: { type: 'square' },
  }).toMaster();
  const synth2 = new Tone.PolySynth(1, Tone.Synth, {
    oscillator: { type: 'sawtooth' },
  }).toMaster();
  const synths = [synth0, synth1, synth2];
  */

  const [isSynthEnabled, setIsSynthEnabled] = useState([false, false, false]);
  function setSynthStatus(index, value) {
    const updated = [...isSynthEnabled];
    updated[index] = value;
    setIsSynthEnabled(updated);
  }

  // function playBase() {
  //   const base = genome[index];
  //   /*console.log(base);*/
  //   // monosynth.triggerAttackRelease(MAPS.BASE_MAP[base], '2n');
  // }

  function getBaseNotes() {
    const base = genome[index];

    return [{ name: MAPS.BASE_MAP[base], duration: '2n' }];
  }

  const baseNotes = getBaseNotes();
  // console.log(baseNotes);

  function playTwoBase() {
    const twoBase = genome.substring(index, index + 2);
    /*console.log(base);*/
    // if (index % 2 === 0)
    //   oscGCTREM.triggerAttackRelease(MAPS.TWOBASE_MAP[twoBase], '8n');
  }

  // function playCodon() {
  //   const codon = genome.substring(index, index + 3);
  //   const frame012 = index % 3;
  //   if (codon === 'TGA' || codon === 'TAG' || codon === 'TAA') {
  //     setSynthStatus(frame012, false);
  //   }
  //   if (codon === 'ATG') {
  //     setSynthStatus(frame012, true);
  //   }
  //   //add conditional to play first ATG change to add effect to only ATG?
  //   if (isSynthEnabled[frame012] || codon === 'ATG') {
  //     // synths[frame012].triggerAttackRelease(MAPS.CODON_MAP[codon], '16n');
  //   }
  // }

  function getCodonNotes() {
    const codon = genome.substring(index, index + 3);
    const frame012 = index % 3;

    if (codon === 'TGA' || codon === 'TAG' || codon === 'TAA') {
    }

    if (codon === 'ATG') {
    }

    return [
      {
        name: MAPS.CODON_MAP[codon],
        duration: '16n',
        frame012,
      },
    ];
  }

  const codonNotes = getCodonNotes();
  const codonF1Notes = codonNotes.filter(note => note.frame012 === 0);
  const codonF2Notes = codonNotes.filter(note => note.frame012 === 1);
  const codonF3Notes = codonNotes.filter(note => note.frame012 === 2);
  console.log(codonF1Notes);

  let Array10bpGCratio = MAPS.calcMotif_GC(
    genome.substring(index, index + 10),
    0,
    10
  );
  function base10GC() {
    //console.log(Array10bpGCratio)
    //change to oscillate wildly
    // oscGC.triggerAttackRelease(880 * Array10bpGCratio[1], '4n');
  }
  //base10GC()

  let Array100bpGCratio = MAPS.calcMotif_GC(
    genome.substring(index, index + 100),
    0,
    100
  );
  function base100GC() {
    // if (index % 50 === 0)
    //   oscGCDIST.triggerAttackRelease(880 * Array100bpGCratio[1], '2n');
  }

  //if start/stop in each frame do this
  const codon = genome.substring(index, index + 3);
  const frame012 = index % 3;

  function colorCodon() {
    if (isSynthEnabled[frame012] === true) {
      return <span className="start"> {codon}</span>;
    } else if (isSynthEnabled[frame012] === false) {
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

  // useEffect(playBase, [index]);
  // useEffect(playCodon, [index]);
  useEffect(base10GC, [index]);
  useEffect(base100GC, [index]);
  useEffect(playTwoBase, [index]);

  // console.log(index);

  useEffect(() => {
    Tone.Transport.scheduleRepeat(() => {
      direction.current ? actions.decrement() : actions.increment();
    }, '32n');
    return () => {
      Tone.Transport.cancel();
    };
  }, []);

  function Feature(feature, i) {
    return (
      <>
        <br />
        <Button key={i} onClick={() => actions.set(feature.start - 1)}>
          {feature.gene}
        </Button>{' '}
        {feature.product}
      </>
    );
  }

  return (
    <>
      <p>Track 1 base {genome[index]}</p>
      <p>Track 2 codonF1{codonF1}</p>
      <p>Track 3 codonF2{codonF2}</p>
      <p>Track 4 codonF3{codonF3}</p>
      <p>Track 5 GC Content 10 base {Array10bpGCratio[1]}</p>
      <p>Track 6 GC Content 100 base {Array100bpGCratio[1]}</p>
      <p>Track 7 playTwoBase {genome.substring(index, index + 2)}</p>
      <Button onClick={play}>Play</Button>
      <Button onClick={stop}>Stop</Button>
      <Button onClick={reverse}>Reverse</Button>
      <hr></hr>
      {/* <Button onClick={playBase}>Play Base</Button> */}
      {/* <Button onClick={playCodon}>Play Codon</Button> */}
      <Button onClick={base10GC}>Each 10bp GC ratio</Button>
      <Button onClick={base100GC}>Play 100 GCcontent</Button>
      <Button onClick={playTwoBase}>Play diNucleotide</Button>
      <hr></hr>
      {MAPS.geneBank_json.map(Feature)}

      <Song>
        <Track>
          <Instrument type={'synth'} notes={baseNotes} />
        </Track>
        <Track>
          <Instrument type={'synth'} notes={codonF1Notes} />
        </Track>
        <Track>
          <Instrument type={'synth'} notes={codonF2Notes} />
        </Track>
        <Track>
          <Instrument type={'synth'} notes={codonF3Notes} />
        </Track>
      </Song>
    </>
  );
}
