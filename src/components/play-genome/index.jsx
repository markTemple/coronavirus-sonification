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

  const [displayMode, setDisplayMode] = useState('translation')
  const toggleDisplayMode = () =>
    setDisplayMode(displayMode === 'translation' ? 'transcription' : 'translation')

  const isSynthEnabled = useRef([false, false, false])
  function setSynthStatus(index, value) {
    isSynthEnabled.current[index] = value
  }

  let bpm = '90'
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
    return [{ name: MAPS.BASE_MAP[base], duration: '16n', motif: base }];
  }
  const baseNotes = getBaseNotes();
  // console.log(baseNotes);

  const GAUCcount = useRef(0)
  const GUACbase = baseNotes[0].motif
  if (GUACbase === 'C' || GUACbase === 'G') GAUCcount.current++;
  if (GUACbase === 'A' || GUACbase === 'U') GAUCcount.current--;

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

    if (codon === 'UGA' || codon === 'UAG' || codon === 'UAA') {
      setSynthStatus(frame012, false);
    }
    if (codon === 'AUG') {
      setSynthStatus(frame012, true);
    }
    if(frameshift) {
      isSynthEnabled.current[0] = true
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

  // get item from genebank
  const geneBankItem_atIndex = MAPS.geneBank_json
    .find(feature => index + 1 >= feature.start && index < feature.end)

  let orf1 = useRef(null);
  let orf2 = useRef(null);
  let orf3 = useRef(null);

  if(geneBankItem_atIndex.type === 'p'){
    if(frame012 === 0 && geneBankItem_atIndex.start %3 === 1) orf1.current = geneBankItem_atIndex.product
    if(frame012 === 1 && geneBankItem_atIndex.start %3 === 2) orf2.current = geneBankItem_atIndex.product
    if(frame012 === 2 && geneBankItem_atIndex.start %3 === 0) orf3.current = geneBankItem_atIndex.product
}
if(geneBankItem_atIndex.type === 'u'){
  orf1.current = null
  orf2.current = null
  orf3.current = null
}

// TRS data was manually added to the GeneBank json file
// these motif strings are made into array and played as individual notes
function getTRSnotes(trsBase) {
  return [{ name: MAPS.TRS_MAP[trsBase], duration: '16n'}];
}

let trs_seqArray = useRef(null)
let TRSseq = null
if (geneBankItem_atIndex.trs_start === index + 1) {
  trs_seqArray.current = geneBankItem_atIndex.trs_seq.split('')
  // TRSseq = geneBankItem_atIndex.trs_seq
}
if (geneBankItem_atIndex.trs_seq === null) trs_seqArray.current = null
const trsBase = trs_seqArray.current?.shift()
let getTRSnote = null
if(trsBase) getTRSnote = getTRSnotes(trsBase);
// cleavage sites in the 1ab polyprotein taken fron Nature supplementary data
// a composed sequence of notes are used to sonify these
// nsp data stored in natSup_json (Nature Supplementary data)

const nspCleavageItem_atIndex = MAPS.nspCleavageData_json
    .find(feature => index > feature.nt_start -10 && index < feature.nt_start -1)
  const nspNotes = ['C5','E5','G5','B6','C5','E5','G5','B7'];
  // const metaP_end = ['B7','G6','E6','C6','B6','G5','E5','C5'];

  const mNoteCount = useRef(null);
  let metaNote = [];

  function playMeta(noteArr) {
    metaNote = [{name: noteArr[mNoteCount.current], duration: '2n'}]
    mNoteCount.current++
    if(mNoteCount.current === noteArr.length) mNoteCount.current = null
  }

  let printNSPtxt = [null,null]
  if(nspCleavageItem_atIndex) {
    playMeta(nspNotes)
    bpm = '30'
    printNSPtxt = [nspCleavageItem_atIndex.name, nspCleavageItem_atIndex.aa_res]
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

  const genomeSub = genome.substring(index - 40, index + 41)
  function makeComplementary(seq) {
    return seq.replace(/./g, (char) => MAPS.ANTICODON_MAP[char])
  }
  const indexChar = genome.substr(index, +3);
  const antiCodon = makeComplementary(indexChar);

  let dotfill40 = `                                        `;
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

//sonification hacks

const given_seconds = (rnaFeature.end+1 - rnaFeature.start)/6
const dateObj = new Date(given_seconds * 1000);

function convertBPtoTime(given_seconds) {
  // let hours = dateObj.getUTCHours();
  let minutes = dateObj.getUTCMinutes();
  let seconds = dateObj.getSeconds();

  // let timeString = hours.toString().padStart(2, '0')
  //     + ':' + minutes.toString().padStart(2, '0')
  //     + ':' + seconds.toString().padStart(2, '0');
      let timeString = minutes.toString().padStart(2, '0')
      + ':' + seconds.toString().padStart(2, '0');
  return timeString;
}
convertBPtoTime(given_seconds)
//console.log(convertBPtoTime())

return (
    <>
      <h2>{MAPS.source}</h2>
      <p><span className='six'>{rnaFeature.gene}</span> extends from {rnaFeature.start} to {rnaFeature.end} bp
        ({rnaFeature.end+1 - rnaFeature.start} bp in length)
      </p>

      <hr />
      <p style={{ whiteSpace: 'pre' }}>Sonification of RNA translation to produce an amino acid chain. Audio time
        <span className='six'> {convertBPtoTime()}
        </span> (hh:mm:ss)
      </p>
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

      <div>
      <p className='pre drop'>
        <span>            5`                                      </span>
        <span className='antiC'>{antiCodon}</span>
        <span>                                     3`</span>
      </p>
      <span className='thr'> RNAbp</span>
        <span className='six'> {String(index + 1).padStart(5, '0')}</span>|
        <GenomeDisplay className=' pre'>{dotfill40 + genomeSub}</GenomeDisplay>
      </div>
      <br />

      <Button onClick={play}>Play</Button>
      <Button onClick={stop}>Stop</Button>
      <Button onClick={actions.increment}>Increment</Button>
      <Button onClick={actions.decrement}>Decrement</Button>
      <br />
      <br />
      <br />

      {MAPS.geneBank_json.map(Feature)}

      <div className='row'>
        <div className='column'>
          <p> Nucleotide at Playhead {genome[index]} {GAUCcount.current} {baseNotes[0].name}</p>
          <p> Di-Nucleotide at Playhead {twobaseNotes[0].motif} {twobaseNotes[0].name}</p>
          <p> GC Content over 10 base {tenGCnote[0].ratio} {tenGCnote[0].name} {/*tenGCnote[0].motif*/}</p>
          <p> GC Content over 100 base {tentensGCnote[0].ratio} {tentensGCnote[0].name} {/*tentensGCnote[0].motif*/}</p>
        </div>
        <div className='column'>
          <p>
            Frame 1 Codon to AA residue:
            <span className='frame1'>{codonF1}</span>
            <span className='circle2 frame1'>{codonF1Notes[0]?.motif}</span>
          </p>
          <p>
            Frame 2 Codon to AA residue:
            <span className='frame2'>{codonF2}</span>
            <span className='circle2 frame2'>{codonF2Notes[0]?.motif}</span>
          </p>
          <p>
            Frame 3 Codon to AA residue:
            <span className='frame3'>{codonF3}</span>
            <span className='circle2 frame3'>{codonF3Notes[0]?.motif}</span>
          </p>
          {
          printNSPtxt[0] &&
          <p>Polyprotein cleavage to {printNSPtxt[0]}, {printNSPtxt[1]} AA residues</p>
          }
        </div>
      </div>

      <Button onClick={toggleDisplayMode}>Switch to replicase-transcriptase of genomic RNA</Button>
      {/* <Button onClick={playBase}>Play Base</Button> */}
      {/* <Button onClick={playCodon}>Play Codon</Button>
      <Button onClick={base10GC}>Each 10bp GC ratio</Button>
      <Button onClick={base100GC}>Play 100 GCcontent</Button>
      <Button onClick={playTwoBase}>Play diNucleotide</Button>*/}
      {/* <p> {rnaFeature.product} {rnaFeature.protein_id}</p> */}
      <hr />

      <Song bpm={bpm}>
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
          <Instrument type={'amSynth'} notes={getTRSnote} />
          <Effect type='feedbackDelay' wet={0.5} /> </Track>
        {/* do something as orf length reaches every 50th AA residue*/}
        <Track volume={-3} pan={0.5} >
          <Instrument type={'amSynth'} notes={metaNote} />
          <Effect type='feedbackDelay' wet={0.5} /> </Track>
        {/* do something as orf length reaches every 50th AA residue */}
        </Song>
    </>
  );
}

