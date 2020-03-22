import React, { useState, useEffect, useRef } from 'react'
import Tone from 'tone'
import { useIndex, useGenome } from '../../hooks'
import * as MAPS from '../../utilities/maps'
import { Button } from '../button'

import './style.css'

//var frame = MAPS.frameCount();
const counter = MAPS.frameCount();
//console.log(counter());

export function PlayGenome () {
  const [genome, getGenome] = useGenome()
  const [index, actions] = useIndex()
  const direction = useRef(false)

  //const oscGC = new Tone.Oscillator().toMaster()
  const oscGC = new Tone.PolySynth(1, Tone.Synth, {oscillator: {type: "sine"}}).toMaster()

  var distortion = new Tone.Distortion(0.1)
  var tremolo = new Tone.Tremolo().start()
  const oscGCDIST = new Tone.PolySynth(1, Tone.Synth, {oscillator: {type: "sine"}}).chain(distortion, Tone.Master)
  const oscGCTREM = new Tone.PolySynth(1, Tone.Synth, {oscillator: {type: "sine"}}).chain(tremolo, Tone.Master)

  const monosynth = new Tone.MembraneSynth({
    "pitchDecay" : 0.01,
    "octaves" : 6,
    "oscillator" : {
      "type" : "square4"
    },
    "envelope" : {
      "attack" : 0.001,
      "decay" : 0.1,
      "sustain" : 0
    }
  }).toMaster()
  //monosynth.volume.value = -20
  const monosynth2 = new Tone.PolySynth(1, Tone.Synth, {oscillator: {type: "sine"}}).toMaster()

  const synth0 = new Tone.PolySynth(1, Tone.Synth, {oscillator: {type: "triangle"}}).toMaster()
  const synth1 = new Tone.PolySynth(1, Tone.Synth, {oscillator: {type: "square"}}).toMaster()
  const synth2 = new Tone.PolySynth(1, Tone.Synth, {oscillator: {type: "sawtooth"}}).toMaster()
  const synths = [synth0, synth1, synth2]

  const [isSynthEnabled, setIsSynthEnabled] = useState([false, false, false])
  function setSynthStatus (index, value) {
    const updated = [...isSynthEnabled]
    updated[index] = value
    setIsSynthEnabled(updated)
  }

  function playBase () {
    const base = genome[index]
    /*console.log(base);*/
    if(base === 'A') {monosynth2.triggerAttackRelease(MAPS.BASE_MAP[base], '8n')}
    else monosynth.triggerAttackRelease(MAPS.BASE_MAP[base], '4n')
  }

  function playTwoBase () {
    const twoBase = genome.substring(index, index + 2)
    /*console.log(base);*/
    if(index % 2 === 0) oscGCTREM.triggerAttackRelease(MAPS.TWOBASE_MAP[twoBase], '8n')
  }

  function playCodon () {
    const codon = genome.substring(index, index + 3)
    const frame012 = index % 3;
    if (codon === 'TGA' || codon === 'TAG' || codon === 'TAA') {
      setSynthStatus(frame012, false)
    }
    if (codon === 'ATG') {
      setSynthStatus(frame012, true)
    }
    //add conditional to play first ATG change to add effect to only ATG?
    if ( (isSynthEnabled[frame012]) || (codon === 'ATG') ) {
      synths[frame012].triggerAttackRelease(MAPS.CODON_MAP[codon], '16n');
    }
  }

  let Array10bpGCratio = MAPS.calcMotif_GC(genome.substring(index, index + 10), 0, 10);
  function base10GC () {
    let note = 'C1'
    if(index % 10 === 0){
      if(Array10bpGCratio[1] <= 0.25) note = 'C2'
      else if(Array10bpGCratio[1] <= 0.5) note = 'C3'
      else if(Array10bpGCratio[1] <= 0.75) note = 'C4'
      else if(Array10bpGCratio[1] <= 1.0) note = 'C5'
    }
    console.log(note)
    //change to oscillate wildly was numerical and a little disonant
    //oscGC.triggerAttackRelease(880*Array10bpGCratio[1], '4n');
    oscGC.triggerAttackRelease(note, '1n');
  }
  //base10GC()

  let Array100bpGCratio = MAPS.calcMotif_GC(genome.substring(index, index + 100), 0, 100);
  function base100GC () {
    if(index % 50 === 0) oscGCDIST.triggerAttackRelease(880*Array100bpGCratio[1], '1m');
  }

  //if start/stop in each frame do this
  const codon = genome.substring(index, index + 3)
  const frame012 = index % 3;

  function colorCodon () {
    if( isSynthEnabled[frame012] === true ) {
      return <span className="start"> {codon}</span>
    }
    else if( isSynthEnabled[frame012] === false ) {
      return <span className="stop"> {codon}</span>
    }else{
      return codon
    }
  }
  let codonF1 = '';
  let codonF2 = '';
  let codonF3 = '';
  if (frame012 === 0 ) codonF1 = colorCodon();
  if (frame012 === 1 ) codonF2 = colorCodon();
  if (frame012 === 2 ) codonF3 = colorCodon();

  const play = () => Tone.Transport.start()
  const stop = () => Tone.Transport.stop()
  const reverse = () => direction.current = !direction.current

  useEffect(playBase, [index])
  useEffect(playCodon, [index])
  useEffect(base10GC, [index])
  useEffect(base100GC, [index])
  useEffect(playTwoBase, [index])

  useEffect(() => {
    Tone.Transport.scheduleRepeat(() => {
      direction.current
        ? actions.decrement()
        : actions.increment()
    }, '8n')
    return () => {
      Tone.Transport.cancel()
    }
  }, [])

  function Feature (feature, i) {
    return (
      <>
        <br />
        <Button
          key={i}
          onClick = {() => actions.set(feature.start-1)}
        >
          {feature.gene}
        </Button> {feature.product}
      </>
    )
  }

  return (
    <>
      <p>Track 1 base {genome[index]}</p>
      <p>Track 2 codonF1{codonF1}</p>
      <p>Track 3 codonF2{codonF2}</p>
      <p>Track 4 codonF3{codonF3}</p>
      <p>Track 5 GC Content 10 base  {Array10bpGCratio[1]}</p>
      <p>Track 6 GC Content 100 base {Array100bpGCratio[1]}</p>
      <p>Track 7 playTwoBase {genome.substring(index, index + 2)}</p>
      <Button onClick={play}>Play</Button>
      <Button onClick={stop}>Stop</Button>
      <Button onClick={reverse}>Reverse</Button><hr></hr>
      <Button onClick={playBase}>Play Base</Button>
      <Button onClick={playCodon}>Play Codon</Button>
      <Button onClick={base10GC}>Each 10bp GC ratio</Button>
      <Button onClick={base100GC}>Play 100 GCcontent</Button>
      <Button onClick={playTwoBase}>Play diNucleotide</Button><hr></hr>
      {MAPS.geneBank_json.map(Feature)}
    </>
  )
}
