import React, { useState, useEffect, useRef, Fragment } from 'react';
import Tone from 'tone';
import { Song, Track, Instrument, Effect } from 'reactronica';
import * as MAPS from '../../utilities/maps';
import { Button } from '../button';
import { SlidingStringWindow } from '../sliding-string-window'
import { GenomeDisplay } from '../genome-display';

import './style.css';
import { useDispatch, useSelector } from '../../state/store';
import { Controls } from '../controls';
import { genome } from '../../genome'
import { getPlayhead, setPlayhead } from '../../state/playhead';
import { controlsReverse, getReversed, controlsSetDirection } from '../../state/controls';
import {
  getBase, getDinucleotide, getCodon,
  getBases10, getBases100
} from '../../utilities/motifs';


export function PlayGenome() {
  const dispatch = useDispatch()
  const index = useSelector(getPlayhead)
  const isReversed = useSelector(getReversed)

  // functions in motifs file
  const base = getBase(index)
  const twoBase = getDinucleotide(index)
  const codon = getCodon(index)
  const Bases10 = getBases10(index)
  const Bases100 = getBases100(index)


  const [mode, setmode] = useState('trl')
  const togglemode = () => {
    setmode(mode === 'trl' ? 'tsc' : 'trl')
    // actions.set(mode === 'tsc' ? 0 : 29902)
  }
  const frame012 = index % 3;

  let bpm = null
  if (mode === 'tsc') {
    dispatch(controlsSetDirection(true))
    bpm = 130
  }

  if (mode === 'trl') {
    dispatch(controlsSetDirection(false))
    bpm = 90
  }

  const isSynthEnabled = useRef([false, false, false])

  // get item from genebank
  const gb_Item = MAPS.geneBank_json
    .find(feature => index >= feature.start && index <= feature.end)
  const nsp_Item = MAPS.nsp_json
    .find(feature => index >= feature.start && index <= feature.end)
  const trs_Item = MAPS.trs_json
    .find(feature => index >= feature.end && index <= feature.start)

  //-1frameshift hack
  //-1 AT 13468 THIS WORKS due to 123123 numbering
  //end 21550 to allow last stop codon to take effect then read
  // rest of genome in F3 normal without frameshift
  let frameshift = ''
  if ((index >= 13466) && (index < 21550)) {
    frameshift = index - 2
  }

  function getBaseNotes() {
    if (mode === 'trl') return [{ name: MAPS.BASE_MAP[base], duration: '3n', motif: base }];
    else return [{ name: MAPS.BASE_MAP_micro[base], duration: '32n', motif: base }];
  }
  const baseNotes = getBaseNotes();

  // trigger note on repeat base
  let baseInc = useRef(0);
  function getSameBaseNotes(baseInc) {
    const base = ['C5', 'Eb5', 'C6', 'Eb6', 'C5', 'Eb5', 'C6', 'Eb6', ]
    const base_2 = ['A1', 'Bb2', 'C3', 'Bb4', 'C5', 'Bb6', 'C7', 'Bb8']
    const base_micro = [440.00, 452.89, 466.16, 479.82, 493.88, 508.36, 523.25, 538.58]

    if (mode === 'trl') return [{ name: base[baseInc.current], duration: '8n', motif: base }];
    else return [{ name: base_micro[baseInc.current], duration: '16n', motif: base }];
  }

  let sameBaseNotes = ''

  if ( (base === getBase(index - 1) ) && ( base === getBase(index - 2) ) ){
    sameBaseNotes = getSameBaseNotes(baseInc);
    baseInc.current++
  }

  if (baseInc.current === 7) baseInc.current = 0

  const GAUCcount = useRef(0)
  if (base === 'C' || base === 'G') GAUCcount.current++;
  if (base === 'A' || base === 'U') GAUCcount.current--;

  function playTwoBase() {
    // if (index % 2 === 0) {
    if (mode === 'tsc') return [{ name: MAPS.TWOBASE_MAP_micro[twoBase], duration: '32n', motif: twoBase }];
    if (mode === 'trl') return [{ name: MAPS.TWOBASE_MAP[twoBase], duration: '32n', motif: twoBase }];
  }
  const twobaseNotes = playTwoBase();

  function setSynthStatus(frame, value) {
    isSynthEnabled.current[frame] = value
  }

  const start = function() {
    if(codon === 'AUG') return true
    else return false
   }
  const stop = function() {
    if(codon === 'UGA' || codon === 'UAG' || codon === 'UAA') return true
    else return false
  }

  function setSynthByCodonType() {
    if(start() === true) setSynthStatus(frame012, true);
    if (stop() === true) setSynthStatus(frame012, false);

    if (frameshift) isSynthEnabled.current[1] = true
}
setSynthByCodonType()

function getCodonNotes() {
    if (mode === 'trl') { //play codons
      return {
        name: MAPS.CODON_MAP[codon]?.Note,
        duration: '7n',
        motif: MAPS.CODON_MAP[codon]?.AA,
      }
    }
    if (mode === 'tsc') { //don't play codons
      return {
        name: MAPS.CODON_MAP_micro[codon]?.Note,
        duration: '7n',
        motif: MAPS.CODON_MAP_micro[codon]?.AA,
      }
    }
  }

  const codonF1Notes = [];
  const codonF2Notes = [];
  const codonF3Notes = [];

  // const codonNote = getCodonNotes();

// console.log(codonNote)

  const AA_Count1 = useRef(0)
  const AA_Count2 = useRef(0)
  const AA_Count3 = useRef(0)

  if (frame012 === 0) {
    if (isSynthEnabled.current[frame012]) {
      codonF1Notes.push(getCodonNotes())
      if (index === gb_Item.start) AA_Count1.current = 0
      AA_Count1.current++
    }
  }

  if (frame012 === 1) {
    if (isSynthEnabled.current[frame012]) {
      codonF2Notes.push(getCodonNotes())
      if (index === gb_Item.start) AA_Count2.current = 0
      AA_Count2.current++
    }
  }

  if (frame012 === 2) {
    if (isSynthEnabled.current[frame012]) {
      codonF3Notes.push(getCodonNotes())
      if (index === gb_Item.start) AA_Count3.current = 0
      AA_Count3.current++
    }
  }
  // C natural minor translation trl [0]
  // [0] C, D, Eb, F, G, Ab, Bb
  // A Phrygian transcription tsc [1]
  // [1] A Bb C D E F G
  //
  function ratioToNote(ratio, modulus) {
    let note = { trl: 'C1', tsc: 'A1' }
    if (ratio.ratio < 0.25) note = { trl: 'Eb2', tsc: 392.00 }
    else if (ratio.ratio < 0.4) note = { trl: 'Ab2', tsc: 403.48 }
    else if (ratio.ratio < 0.45) note = { trl: 'Bb2', tsc: 415.30 }
    else if (ratio.ratio < 0.5) note = { trl: 'Eb3', tsc: 427.47 }
    else if (ratio.ratio < 0.55) note = { trl: 'Ab3', tsc: 440.00 }
    else if (ratio.ratio < 0.6) note = { trl: 'Bb3', tsc: 452.89 }
    else if (ratio.ratio < 0.75) note = { trl: 'Eb4', tsc: 466.16 }
    else if (ratio.ratio <= 1.0) note = { trl: 'Ab4', tsc: 479.82 }
    if (mode === 'trl') return [{ name: note.trl, duration: '1m', motif: ratio.motif, ratio: ratio.ratio }];
    else return [{ name: note.tsc, duration: '2n', motif: ratio.motif, ratio: ratio.ratio }];
  }

  let Array10bpGCratio =
    MAPS.calcMotif_GC(Bases10);
  const tenGCnote = ratioToNote(Array10bpGCratio[0], 4);

  let Array100bpGCratio =
    MAPS.calcMotif_GC(Bases100);
  const tentensGCnote = ratioToNote(Array100bpGCratio[0], 10);
  // console.log(tentensGCnote)


  let orf1 = useRef(null);
  let orf2 = useRef(null);
  let orf3 = useRef(null);

  if (gb_Item.type === 'p') {
    if (frame012 === 0 && gb_Item.start % 3 === 0) orf1.current = gb_Item.product + ' ' + nsp_Item.button_label
    if (frame012 === 1 && gb_Item.start % 3 === 1) orf2.current = gb_Item.product + ' ' + nsp_Item.button_label
    if (frame012 === 2 && gb_Item.start % 3 === 2) orf3.current = gb_Item.product + ' ' + nsp_Item.button_label
  }
    // hack for frameshift to stop label of frag1
    if (index >= 13468 && index < 21550) orf3.current = ''


  if (gb_Item.type === 'u') {
    orf1.current = null
    orf2.current = null
    orf3.current = null
  }

  let trs_seqArray = useRef(null)

  //choose to play from either end depending on playhead direction
  if (trs_Item.end === index && mode === 'trl') {
    trs_seqArray.current = trs_Item.trs_seq.split('')
  }
  if (trs_Item.start === index && mode === 'tsc') {
    trs_seqArray.current = trs_Item.trs_seq.split('')
  }

  if (trs_Item.trs_seq === null) trs_seqArray.current = null

  function getTRSnotes(trsBase) {
    if (mode === 'tsc') return [{ name: MAPS.TRS_MAP_micro[trsBase], duration: '16n' }];
    if (mode === 'trl') return [{ name: MAPS.TRS_MAP[trsBase], duration: '4n' }];
  }

  let getTRSnote = null
  if (trs_seqArray.current) {
    getTRSnote = getTRSnotes(trs_seqArray.current?.shift());
  }


  const nspNotes = ['C5', 'Eb5', 'F5', 'G5', 'C6', 'Eb6', 'F6', 'F6'];
  // const metaP_end = ['B7','G6','E6','C6','B6','G5','E5','C5'];
  const mNoteCount = useRef(null);
  let nspNote = null;

  function playNSP(noteArr) {
    nspNote = [{ name: noteArr[mNoteCount.current], duration: '2n' }]
    mNoteCount.current++
    if (mNoteCount.current === noteArr.length) mNoteCount.current = null
  }

  if (index >= nsp_Item.end - 7 && nsp_Item.start < 21551) {
    playNSP(nspNotes)
    bpm = 45
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
  function buttonSTART() {
    if(start() === true) {
      return <span className='buttonEffect start'>{}  </span>
    }
  }
  function buttonSTOP() {
    if(stop() === true) {
      return <span className='buttonEffect'>  </span>
    }
  }

  let codonF1 = null;
  let codonF2 = null;
  let codonF3 = null;

  let codonStatusF1 = {start: null, stop: null};
  let codonStatusF2 = {start: null, stop: null};
  let codonStatusF3 = {start: null, stop: null};

  if (frame012 === 0) {
   codonF1 = colorCodon()
   codonStatusF1 = {start: buttonSTART(), stop: buttonSTOP()}
  }
  if (frame012 === 1) {
   codonF2 = colorCodon()
   codonStatusF2 = {start: buttonSTART(), stop: buttonSTOP()}
  }
  if (frame012 === 2) {
   codonF3 = colorCodon()
   codonStatusF3 = {start: buttonSTART(), stop: buttonSTOP()}
  }


  function Feature(feature, i) {
    const color = ['#f08b2c', '#5da793', '#1396ba']//color by frame ??
    const style = {}
    //add moer things to call here as const's
    if(typeof feature.trs_seq !== 'undefined'){
      if ((index >= feature.end) && ((index <= feature.start))) {
        style.backgroundColor = color[frame012]
      }
    }
      if ((index >= feature.start) && ((index <= feature.end))) {
        style.backgroundColor = color[frame012]
      }

    // include a reset GC count on click
    return (
      <Fragment key={i}>
        <Button
          onClick={() => {
            dispatch(setPlayhead(feature.start))
            setSynthStatus(0, false)
            setSynthStatus(1, false)
            setSynthStatus(2, false)
            GAUCcount.current = GAUCcount.current
            orf1.current = ''
            orf2.current = ''
            orf3.current = ''
            AA_Count1.current = 0
            AA_Count2.current = 0
            AA_Count3.current = 0
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
    return seq.replace(/./g, (char) => MAPS.COMPLEMENUARY_MAP[char])
  }
  const genomeSub = genome.substring(index - 40, index + 41)

  const genomeSubComplement = makeComplementary(genome.substring(index, index + 41))

  const antiCodon = makeComplementary(codon);

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
    content: base,
    props: {
      className: 'frame3',
    }
  }
  // x nt per second eg 6 x 60 = 360/4 = 90 bpm
  // (bpm*4)/60
  let bpmFactor = (bpm * 4) / 60
  const trl_time = (gb_Item.end - gb_Item.start) / bpmFactor
  const tsc_time = (trs_Item.start - trs_Item.end) / bpmFactor

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
    {
      trl: gb_Item.gene,
      tsc: trs_Item.button_label
    },
    rnaBegin:
    {
      trl: gb_Item.start,
      tsc: trs_Item.end
    },
    rnaEnd:
    {
      trl: gb_Item.end,
      tsc: trs_Item.start
    },
    rnaLength:
    {
      trl: gb_Item.end - gb_Item.start,
      tsc: trs_Item.start - trs_Item.end
    },
    sonifySub:
    {
      trl: 'Sonification of translation of plus RNA strand to make proteins',
      tsc: 'Sonification of transcription of RNA to make the minus strand RNA'
    },
    sonifyTime:
    {
      trl: convertBPtoTime(trl_time),
      tsc: convertBPtoTime(tsc_time)
    },
    modeTitle:
    {
      trl: ` ribosomal polypeptide synthesis 5'->3'`,
      tsc: ` (-) replicase RNA strand synthesis 3'<- 5'`
    },
    printNSP:
    {
      trl: (nsp_Item.end - index),
      tsc: (index - nsp_Item.start)
    },
    printTRS:
    {
      trl: (trs_Item.start - index) + ' ' + trs_Item.trs_seq,
      tsc: (index - trs_Item.end) + ' ' + trs_Item.trs_seq
    },
  }

  return (
    <>
      <div className='relative'>

        <h2>{MAPS.source}</h2>
        <p><span className='six'>{subHeadings.rnaRegion[mode]} </span>
      extends from {subHeadings.rnaBegin[mode]} to {subHeadings.rnaEnd[mode]} bp
        ({subHeadings.rnaLength[mode]} bp in length)
      </p>
        <hr />
        <p style={{ whiteSpace: 'pre' }}>{subHeadings.sonifySub[mode]} Audio time
        <span className='six'> {subHeadings.sonifyTime[mode]}
          </span> (m:s)
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
              />{codonStatusF1.start}{codonStatusF1.stop}
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
              />{codonStatusF2.start}{codonStatusF2.stop}
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
              />{codonStatusF3.start}{codonStatusF3.stop}
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
          <span className='six'> {String(index).padStart(5, '0')}</span>|
        <GenomeDisplay className='pre'>{dotfill40 + genomeSub}</GenomeDisplay>
        </div>
        { mode === 'trl' ? '' :
          <div>
            <div className='playrev'></div>
            <div className='replicase'></div>
            <div className='replicase p1'></div>
            <div className='replicase p2'></div>
            <div className='replicase p3'></div>
            <div className='replicase p4'></div>
            <div className='replicase p5'></div>
            <div className='replicase p6'></div>
            <div className='replicase p7'></div>
            <span className='thr'> RNA -</span>
            <span className='six'> {String(genome.length - (index)).padStart(5, '0')}</span>|
            <span className=' pre'>{DNAfill40 + genomeSubComplement}</span>
            <p className='pre'>            3`                                                                              5`</p>
          </div>
        }
        <br />

        <br />
        <div className='absolute'>
          <hr />
          <Controls />
          <br />
          <br />
          <Button onClick={togglemode}><span className='pre'> Switch Mode </span></Button>
          <span> {subHeadings.modeTitle[mode]}</span>
          <br />
          <br />
          {MAPS.geneBank_json.map(Feature)}<br /><br />
          {MAPS.nsp_json.map(Feature)}<br /><br />
          {MAPS.trs_json.map(Feature)}

          <div className='row'>
            <div className='column'>
              <p> Nucleotide at Playhead: {base} {GAUCcount.current} {baseNotes[0].name}</p>
              <p> Di-Nucleotide at Playhead: {twoBase} {twobaseNotes[0].name}</p>
              {/* <p> Codon at Playhead: {codon} {codonNote.name}</p>
              <p> Amino Acid at Playhead: {codonNote.motif}</p> */}
              <p> GC Content over 10 base: {tenGCnote[0].ratio} {tenGCnote[0].name} {/*tenGCnote[0].motif*/}</p>
              <p> GC Content over 100 base: {tentensGCnote[0].ratio} {tentensGCnote[0].name} {/*tentensGCnote[0].motif*/}</p>
            </div>
            <div className='column'>
              <p>
                {/* {buttonSTART()}
                {buttonSTOP()} */}
                <p>Region {nsp_Item.name}: <span className='six'> {subHeadings.printNSP[mode]}</span></p>
                <p>Countdown till next TRS: <span className='six'> {subHeadings.printTRS[mode]}</span></p>

              </p>
            </div>
          </div>
        </div>
      </div>

      <Song bpm={bpm} >
        <Track volume={-8} pan={-0.3} >
          <Instrument type={'synth'} notes={baseNotes} />
        </Track>
        <Track volume={-8} pan={-0.3} >
          <Instrument type={'synth'} notes={sameBaseNotes} />
        </Track>
        <Track volume={-8} pan={0.3} >
          <Instrument type={'synth'} notes={twobaseNotes} />
          <Effect type='feedbackDelay' wet={0.2} />
        </Track>
        <Track volume={-4} pan={-0.9} >
          <Instrument type={'fmSynth'} oscillator={{ type: 'sine' }}
            notes={codonF1Notes} />
          <Effect type='feedbackDelay' wet={0.2} />
        </Track>
        <Track volume={-4} pan={0} >
          <Instrument type={'fmSynth'} oscillator={{ type: 'square' }}
            notes={codonF2Notes} />
          <Effect type='feedbackDelay' wet={0.2} />
        </Track>
        <Track volume={-4} pan={0.9} >
          <Instrument type={'fmSynth'} oscillator={{ type: 'triangle' }}
            notes={codonF3Notes} />
          <Effect type='feedbackDelay' wet={0.2} />
        </Track>
        <Track volume={-4} pan={-0.6} >
          <Instrument type={'amSynth'} notes={tenGCnote} />
          <Effect type='feedbackDelay' wet={0.4} /> </Track>
        <Track volume={-4} pan={0.6} >
          <Instrument type={'amSynth'} notes={tentensGCnote} />
          <Effect type='feedbackDelay' wet={0.4} /> </Track>
        <Track volume={-1} pan={0.8} >
          <Instrument type={'amSynth'} notes={getTRSnote} />
          <Effect type='feedbackDelay' wet={0.5} /> </Track>
        <Track volume={-4} pan={0.8} >
          <Instrument type={'amSynth'} notes={nspNote} />
          <Effect type='feedbackDelay' wet={0.5} /> </Track>
      </Song>
    </>
  );
}

