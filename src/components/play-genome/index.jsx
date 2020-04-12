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

  const [mode, setmode] = useState('trl')
  const togglemode = () => {
    setmode(mode === 'trl' ? 'tsc' : 'trl')
    // actions.set(mode === 'tsc' ? 0 : 29902)
  }

let bpm = null
if(mode === 'tsc') {
  direction.current = true
  bpm = 130
  }
if(mode === 'trl') {
  direction.current = false
  bpm = 90
  }

const isSynthEnabled = useRef([false, false, false])
  function setSynthStatus(index, value) {
    isSynthEnabled.current[index] = value
  }

//-1frameshift hack
//-1 AT 13468 THIS WORKS due to 123123 numbering
//end 21550 to allow last stop codon to take effect then read
// rest of genome in F3 normal without frameshift
  let frameshift = ''
  if( (index >= 13466-1) && (index < 21550) ){
    frameshift = index -2
  }

  function getBaseNotes() {
    const base = genome[index];
    if(mode === 'trl') return [{ name: MAPS.BASE_MAP[base], duration: '8n', motif: base }];
    else return[{ name: MAPS.BASE_MAP_micro[base], duration: '32n', motif: base }];
  }
  const baseNotes = getBaseNotes();

  // trigger note on repeat base
  let baseInc = useRef(1);
  function getSameBaseNotes(baseInc) {
    const base = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8']
    const base_2 = ['A1', 'Bb2', 'C3', 'Bb4', 'C5', 'Bb6', 'C7', 'Bb8']
    const base_micro = [440.00, 452.89, 466.16, 479.82, 493.88, 508.36, 523.25, 538.58]

    if(mode === 'trl') return [{ name: base[baseInc.current], duration: '8n', motif: base }];
    else return [{ name: base_micro[baseInc.current], duration: '16n', motif: base }];
    }
  let sameBaseNotes = ''

if( (genome[index] === genome[index- 1] ) && (genome[index] === genome[index- 2] ) ) {
  sameBaseNotes = getSameBaseNotes(baseInc);
  baseInc.current++
  }

if(baseInc.current === 7) baseInc.current = 0

  const GAUCcount = useRef(0)
  const GUACbase = baseNotes[0].motif
  if (GUACbase === 'C' || GUACbase === 'G') GAUCcount.current++;
  if (GUACbase === 'A' || GUACbase === 'U') GAUCcount.current--;

  function playTwoBase() {
    const twoBase = genome.substring(index, index + 2);
    /*console.log(base);*/
    // if (index % 2 === 0) {
      if(mode === 'tsc') return [{ name: MAPS.TWOBASE_MAP_micro[twoBase], duration: '2n', motif: twoBase }];
      if(mode === 'trl') return [{ name: MAPS.TWOBASE_MAP[twoBase], duration: '2n', motif: twoBase }];
    }
  const twobaseNotes = playTwoBase();


  function getCodonNotes() {
    const codon = genome.substring(index, index + 3);
    const frame012 = index % 3;

    if (codon === 'UGA' || codon === 'UAG' || codon === 'UAA') {
      setSynthStatus(frame012, false);
    }
    if (codon === 'AUG') {
      setSynthStatus(frame012, true);
    }
    if(frameshift) {
      isSynthEnabled.current[0] = true
    }

    if(mode === 'trl'){ //play codons
      return {
        name: MAPS.CODON_MAP[codon]?.Note,
        duration: '2n',
        frame012: frame012,
        isSynthEnabled: isSynthEnabled.current[frame012],
        motif: MAPS.CODON_MAP[codon]?.AA,
        codon: codon,
      }
    }
    if(mode === 'tsc'){ //don't play codons
      return {
        name: MAPS.CODON_MAP_micro[codon]?.Note,
        duration: '4n',
        frame012: frame012,
        isSynthEnabled: true,
        motif: MAPS.CODON_MAP_micro[codon]?.AA,
        codon: codon,
      }
    }else{
      return {
        name: '',
        duration: '',
        frame012: frame012,
        isSynthEnabled: true,
        motif: MAPS.CODON_MAP_micro[codon]?.AA,
        codon: codon,
      }
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
  // C natural minor translation trl [0]
// [0] C, D, Eb, F, G, Ab, Bb
// A Phrygian transcription tsc [1]
// [1] A Bb C D E F G
//
  function ratioToNote(ratio, modulus) {
    let note = {trl: 'C1', tsc: 'A1'}
    if (ratio.ratio < 0.25) note = {trl: 'Eb2', tsc: 392.00}
    else if (ratio.ratio < 0.4) note = {trl: 'Ab2', tsc: 403.48}
    else if (ratio.ratio < 0.45) note = {trl: 'Bb2', tsc: 415.30}
    else if (ratio.ratio < 0.5) note = {trl: 'Eb3', tsc: 427.47}
    else if (ratio.ratio < 0.55) note = {trl: 'Ab3', tsc: 440.00}
    else if (ratio.ratio < 0.6) note = {trl: 'Bb3', tsc: 452.89}
    else if (ratio.ratio < 0.75) note = {trl: 'Eb4', tsc: 466.16}
    else if (ratio.ratio <= 1.0) note = {trl: 'Ab4', tsc: 479.82}
    if(mode === 'trl') return [{ name: note.trl, duration: '1m', motif: ratio.motif, ratio: ratio.ratio }];
    else return [{ name: note.tsc, duration: '2n', motif: ratio.motif, ratio: ratio.ratio }];
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

  // get item from genebank
  const gb_Item = MAPS.geneBank_json
    .find(feature => index + 1 >= feature.start && index < feature.end)

  let orf1 = useRef(null);
  let orf2 = useRef(null);
  let orf3 = useRef(null);

  if(gb_Item.type === 'p'){
    if(frame012 === 0 && gb_Item.start %3 === 1) orf1.current = gb_Item.product
    if(frame012 === 1 && gb_Item.start %3 === 2) orf2.current = gb_Item.product
    if(frame012 === 2 && gb_Item.start %3 === 0) orf3.current = gb_Item.product
}
if(gb_Item.type === 'u'){
  orf1.current = null
  orf2.current = null
  orf3.current = null
}




let trs_seqArray = useRef(null)

const trs_Item = MAPS.trs_json
.find(feature => index + 1 >= feature.start && index+1 <= feature.end)

//choose to play from either end depending on playhead direction
if (trs_Item.start === index + 1 && mode === 'trl') {
  trs_seqArray.current = trs_Item.trs_seq.split('')
}
if (trs_Item.end === index + 1 && mode ==='tsc') {
  trs_seqArray.current = trs_Item.trs_seq.split('')
}

if (trs_Item.trs_seq === null) trs_seqArray.current = null

function getTRSnotes(trsBase) {
  if(mode === 'tsc') return [{ name: MAPS.TRS_MAP_micro[trsBase], duration: '16n'}];
  if(mode === 'trl') return [{ name: MAPS.TRS_MAP[trsBase], duration: '4n'}];
}

let getTRSnote = null
if(trs_seqArray.current){
  getTRSnote = getTRSnotes(trs_seqArray.current?.shift());
}





  const nsp_Item = MAPS.nsp_json
    .find(feature => index + 1 >= feature.start && index <= feature.end)

    const nspNotes = ['C5','Eb5','F5','G5','C6','Eb6','F6','F6'];
  // const metaP_end = ['B7','G6','E6','C6','B6','G5','E5','C5'];
  const mNoteCount = useRef(null);
  let nspNote = null;

  function playNSP(noteArr) {
    nspNote = [{name: noteArr[mNoteCount.current], duration: '2n'}]
    mNoteCount.current++
    if(mNoteCount.current === noteArr.length) mNoteCount.current = null
  }

    if(index+1 >= nsp_Item.end - 8 && nsp_Item.start < 21551 ) {
      playNSP(nspNotes)
      bpm = 30
    }


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

  const play_transcription = () => {
    Tone.Transport.start();
  }

  const play_translation = () => {
    Tone.Transport.start();
  }

  useEffect(() => {
    Tone.Transport.scheduleRepeat(() => {
      direction.current ? actions.decrement() : actions.increment();
    }, '16n');
    return () => {
      Tone.Transport.cancel();
    };
  }, []);


  function buttonSTART(codon) {
    const style = {}
    if (codon === 'AUG') {
      return <div>Start <span className='buttonEffect start'>  </span></div>
    }else{
    return <div>Start </div>
    }
  }

  function buttonSTOP(codon) {
    const style = {}
  if (codon === 'UGA' || codon === 'UAG' || codon === 'UAA' ) {
    return <div>Stop <span className='buttonEffect'>  </span></div>
  }else{
  return <div>Stop </div>
  }
}

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
            GAUCcount.current = 0
            orf1.current = ''
            orf2.current = ''
            orf3.current = ''
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

  function TRS_feature(feature, i) {
    const style = {}
    let seqlen = feature.trs_seq.length
    //console.log(seq)
    //add moer things to call here as const's
 //   console.log(feature.trs_seq.length)

    if (index + 1 >= feature.start && index <= feature.end -1) {
      style.backgroundColor = '#1396ba'
    }
    // include a reset GC count on click
    return (
      <Fragment key={i}>
        <Button
          onClick={() => {
            actions.set(feature.end -1)
            setSynthStatus(0, false)
            setSynthStatus(1, false)
            setSynthStatus(2, false)
            GAUCcount.current = 0
            orf1.current = ''
            orf2.current = ''
            orf3.current = ''
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

  function makeComplementary(seq) {
    return seq.replace(/./g, (char) => MAPS.ANTICODON_MAP[char])
  }
  const genomeSub = genome.substring(index - 40, index + 41)
  const genomeSubComplement= makeComplementary(genome.substring(index, index + 41))
  const indexChar3 = genome.substr(index, +3);
  const antiCodon = makeComplementary(indexChar3);

  let dotfill40 = `                                        `;
  let DNAfill40 = `                                        `;
  function moveDot() {
    if (index <= 40) {
      dotfill40 = dotfill40.slice(index);
    } else {
      dotfill40 = '';
    }
  }
  moveDot();

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

  const SW_DNA_PropStyle = {
    content: genome[index],
    props: {
      className: 'frame3',
    }
  }


  //sonification hacks
const trl_time = (gb_Item.end+1 - gb_Item.start)/6
const tsc_time = (trs_Item.end+1 - trs_Item.start)/9

function convertBPtoTime(given_seconds) {
  // let hours = dateObj.getUTCHours();
const dateObj = new Date(given_seconds * 1000);
  let minutes = dateObj.getUTCMinutes();
  let seconds = dateObj.getSeconds();

  // let timeString = hours.toString().padStart(2, '0')
  //     + ':' + minutes.toString().padStart(2, '0')
  //     + ':' + seconds.toString().padStart(2, '0');
      let timeString = minutes.toString().padStart(2, '0')
      + ':' + seconds.toString().padStart(2, '0');
  return timeString;
}

//const arrays with translation then transcription values
let subHeadings = {
  rnaRegion:
    {trl: gb_Item.gene,
    tsc: trs_Item.button_label},
  rnaBegin:
    {trl: gb_Item.start,
    tsc: trs_Item.start},
  rnaEnd:
    {trl: gb_Item.end,
    tsc: trs_Item.end},
  rnaLength:
    {trl: gb_Item.end + 1 - gb_Item.start,
    tsc: trs_Item.end + 1 - trs_Item.start},
  sonifySub:
    {trl: 'Sonification of translation of plus RNA strand to make proteins',
    tsc: 'Sonification of transcription of RNA to make the minus strand RNA'},
  sonifyTime:
    {trl: convertBPtoTime(trl_time),
    tsc: convertBPtoTime(tsc_time)},
    modeTitle:
    {trl: ` ribosomal polypeptide synthesis 5'->3'`,
    tsc: ` (-) replicase RNA strand synthesis 3'<- 5'`},
  printNSP:
    {trl: (nsp_Item.end-1 - index+1),
    tsc: (index+1 - nsp_Item.start+1)},
  printTRS:
    {trl: (trs_Item.end-1 - index+1) + ' ' + trs_Item.trs_seq,
    tsc: (index+1 - trs_Item.start+1) + ' ' + trs_Item.trs_seq},
  }

  return (
    <>
      <h2>{MAPS.source}</h2>
      <p><span className='six'>{subHeadings.rnaRegion[mode]} </span>
      extends from {subHeadings.rnaBegin[mode]} to {subHeadings.rnaEnd[mode]} bp
        ({subHeadings.rnaLength[mode]} bp in length)
      </p>
      <hr />
      <p style={{ whiteSpace: 'pre' }}>{subHeadings.sonifySub[mode]} Audio time
        <span className='six'> {subHeadings.sonifyTime[mode]}
        </span> (hh:mm:ss)
      </p>
      <br />

{ mode === 'tsc' ? '' :
<div>
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
          {
            orf1.current &&
            <div className='triangle-left f1'></div>
          }
  <span className='six orf'>{orf1.current}</span>
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
          {
            orf2.current &&
            <div className='triangle-left f2'></div>
          }
  <span className='six orf'>{orf2.current}</span>
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
        {
          orf3.current &&
          <div className='triangle-left f3'></div>
        }
        <span className='six orf'>{orf3.current}</span>
      </div>

      <div className='ribosomeSmall'></div>
      <div className='ribosomeBig'></div>
      <div className='playhead'></div>
      <span className='antiC'>{antiCodon}</span>

</div>
}
      <div>
      <div>
      <p className='pre'>
        <span>Total 29903|5`                                      </span>
        <span>                                        3`</span>
      </p>
      </div><span className='thr'> RNA +</span>
        <span className='six'> {String(index + 1).padStart(5, '0')}</span>|
        <GenomeDisplay className=' pre'>{dotfill40 + genomeSub}</GenomeDisplay>
      </div>
{ direction.current &&
        <div>
        <div className='replicase'></div>
        <div className='replicase p1'></div>
        <div className='replicase p2'></div>
        <div className='replicase p3'></div>
        <div className='replicase p4'></div>
        <div className='replicase p5'></div>
        <div className='replicase p6'></div>
        <div className='replicase p7'></div>
          <span className='thr'> RNA -</span>
            <span className='six'> {String( genome.length - (index + 1) ).padStart(5, '0')}</span>|
            <GenomeDisplay className=' pre'>{DNAfill40 + genomeSubComplement}</GenomeDisplay>
            <p className='pre'>            3`                                                                              5`</p>
        </div>
}
      <br />

      <br />
      <Button onClick={play}><span className='pre'> Play </span></Button>
      <Button onClick={stop}><span className='pre'> Pause </span></Button>
      <Button onClick={actions.increment}><span className='pre'> Increment </span></Button>
      <Button onClick={actions.decrement}><span className='pre'> Decrement </span></Button>
      <span> {subHeadings.modeTitle[mode]}</span>
      <br />
      <br />
      <Button onClick={togglemode}><span className='pre'> Switch Mode </span></Button>
      <br />
      <br />
      {mode === 'trl' && MAPS.geneBank_json.map(Feature)}
      {mode === 'tsc' && MAPS.trs_json.map(TRS_feature)}

      <div className='row'>
        <div className='column'>
          <p> Nucleotide at Playhead: {genome[index]} {GAUCcount.current} {baseNotes[0].name}</p>
          <p> Di-Nucleotide at Playhead: {twobaseNotes[0].motif} {twobaseNotes[0].name}</p>
          <p> Codon at Playhead: {codon} {codonNote.name}</p>
          <p> Amino Acid at Playhead: {codonNote.motif}</p>
          <p> GC Content over 10 base: {tenGCnote[0].ratio} {tenGCnote[0].name} {/*tenGCnote[0].motif*/}</p>
          <p> GC Content over 100 base: {tentensGCnote[0].ratio} {tentensGCnote[0].name} {/*tentensGCnote[0].motif*/}</p>
        </div>
        <div className='column'>
        <p>
        {buttonSTART(codon)}
        {buttonSTOP(codon)}
        <p>Region {nsp_Item.name}: <span className='six'> {subHeadings.printNSP[mode]}</span></p>
        <p>Countdown till next TRS: <span className='six'> {subHeadings.printTRS[mode]}</span></p>

        </p>
        </div>
      </div>
      <hr />

      <Song bpm={bpm} >
      <Track volume={-9} pan={-0.3} >
          <Instrument type={'synth'} notes={baseNotes} />
        </Track>
        <Track volume={-9} pan={-0.3} >
          <Instrument type={'amSynth'} notes={sameBaseNotes} />
        </Track>
        <Track volume={-9} pan={0.3} >
          <Instrument type={'synth'} notes={twobaseNotes} />
          <Effect type='feedbackDelay' wet={0.2} />
        </Track>
        <Track volume={-10} pan={-0.9} >
          <Instrument type={'synth'} oscillator={{ type: 'triangle' }}
            notes={codonF1Notes} />
          <Effect type='distortion' />
        </Track>
        <Track volume={-12} pan={0} >
          <Instrument type={'synth'} oscillator={{ type: 'triangle' }}
            notes={codonF2Notes} />
          <Effect type='distortion' />
        </Track>
        <Track volume={-10} pan={0.9} >
          <Instrument type={'synth'} oscillator={{ type: 'triangle' }}
            notes={codonF3Notes} />
          <Effect type='distortion' />
        </Track>
        <Track volume={-9} pan={-0.9} >
          <Instrument type={'amSynth'} notes={tenGCnote} />
          <Effect type='feedbackDelay' wet={0.4} /> </Track>
        <Track volume={-9} pan={0.9} >
          <Instrument type={'amSynth'} notes={tentensGCnote} />
          <Effect type='feedbackDelay' wet={0.4} /> </Track>
        <Track volume={-2} pan={0.5} >
          <Instrument type={'amSynth'} notes={getTRSnote} />
          <Effect type='feedbackDelay' wet={0.5} /> </Track>
        {/* do something as orf length reaches every 50th AA residue */}
        <Track volume={-6} pan={0.5} >
          <Instrument type={'amSynth'} notes={nspNote} />
          <Effect type='feedbackDelay' wet={0.5} /> </Track>
        {/* do something as orf length reaches every 50th AA residue */}
        </Song>
    </>
  );
}

