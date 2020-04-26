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
import { controlsReverse, getReversed, getMode } from '../../state/controls';
import {
  getBase, getDinucleotide, getCodon,
  getBases10, getBases100
} from '../../utilities/motifs';
import { useSingleFramePrimitive } from '../../utilities/single-frame-primitive';

import { getBaseNotes, playTwoBase, getSameBaseNotes, GCnote10Note,
  GCnote100Note, makeTRSnotes, getNSPnotes, getCodonNotes,
  getCodonNotes_2, playAtIndex} from './get-notes'

import { getCodonFNotes } from './process-codon-notes'
import { Checkbox } from '../checkbox';


export function PlayGenome() {

  const dispatch = useDispatch()
  const index = useSelector(getPlayhead)
  const isReversed = useSelector(getReversed)
  const mode = useSelector(getMode)

  const shouldReset = useSingleFramePrimitive(false)

  const frame012 = index % 3;

  let bpm = null
  let audioProps = null
  let startEnd = null
  switch (mode) {
    case 'trl':
      bpm = 80
      audioProps = 'trlProps'
      startEnd = 'start'
      break;
    case 'tsc':
      bpm = 60
      audioProps = 'tscProps'
      startEnd = 'end'
      break;
    default:
      console.trace('error')
    break;
  }

  const isSynthEnabled = useRef([false, false, false])

  function setSynthStatus(frame, value) {
    isSynthEnabled.current[frame] = value
  }

  // get item from genebank
  const gb_Item = MAPS.geneBank_json
    .find(feature => index >= feature.start && index <= feature.end)
  const nsp_Item = MAPS.nsp_json
    .find(feature => index >= feature.start && index <= feature.end)
  const trs_Item = MAPS.trs_json
    .find(feature => index >= feature.start && index <= feature.end)

  //-1frameshift hack
  //-1 AT 13468 THIS WORKS due to 123123 numbering
  //end 21550 to allow last stop codon to take effect then read
  // rest of genome in F3 normal without frameshift
  let frameshift = ''
  if ((index >= 13466) && (index < 21550)) {
    frameshift = index - 2
  }
  const base = getBase(index)
  const baseNotes = getBaseNotes(base, audioProps)
  const twoBase = getDinucleotide(index)

  function getDinucleotide_2(index){
      if(index % 2) return getDinucleotide(index)
      else return false
    }
  const twoBase_2 = getDinucleotide_2(index)
  const twobaseNotes = playTwoBase(twoBase_2, audioProps)

  const sameBaseNotes = getSameBaseNotes(base, index, audioProps)
  const GCnote10 = getBases10(index)
  const GCnote10Numb = MAPS.newGCratio(GCnote10)
  const tenGCnote = GCnote10Note(GCnote10, GCnote10Numb, audioProps)
  const GCnote100 = getBases100(index)
  const GCnote100Numb = MAPS.newGCratio(GCnote100)
  const tentensGCnote = GCnote100Note(GCnote100, GCnote100Numb, audioProps)
  const getTRSnote = makeTRSnotes(mode, trs_Item, index, audioProps)
  const nspNote = getNSPnotes(nsp_Item, base, index, mode, audioProps)
  const slNote = playAtIndex(index, trs_Item, 'tag', 'SL', twoBase, audioProps, mode)
  const utrNote = playAtIndex(index, gb_Item, 'gene', 'UTR', twoBase, audioProps, mode)

  const codon = getCodon(index)

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
    if(stop() === true) setSynthStatus(frame012, false);

    if (frameshift) isSynthEnabled.current[1] = true
  }
  setSynthByCodonType()

  const codonNotes = getCodonNotes(codon, audioProps)
  const codonFNotes = getCodonFNotes(mode, frame012, isSynthEnabled, index, gb_Item, codonNotes)

let codonNotes_2 = ''

  let codonStatusF1 = {start: null, stop: null};
  let codonStatusF2 = {start: null, stop: null};
  let codonStatusF3 = {start: null, stop: null};

  // don't run everything for trl when in tsc
  // and vis versa
  switch (mode) {
    case 'trl':

      function buttonSTART() {
        if(start() === true) {
          return <span className='stopStartFlash start'>{}  </span>
        }
      }
      function buttonSTOP() {
        if(stop() === true) {
          return <span className='stopStartFlash'>  </span>
        }
      }

      switch (frame012) {
        case 0:
          codonStatusF1 = {start: buttonSTART(), stop: buttonSTOP()}
        break;
        case 1:
          codonStatusF2 = {start: buttonSTART(), stop: buttonSTOP()}
        break;
        case 2:
          codonStatusF3 = {start: buttonSTART(), stop: buttonSTOP()}
        break;
        default:
          console.trace('error')
        break;
      }
      //start sliding window display AA residues on NSP start
      function setSynthByNSPstart() {
        setSynthStatus(frame012, true)
      }
      if( nsp_Item.start === index && nsp_Item.SW_true === true ) setSynthByNSPstart()


    break;
    case 'tsc':
      codonNotes_2 = getCodonNotes_2(index, codon, audioProps, mode)
      break;
    default:
      console.trace('tsc')
    break;
  }




const codonF1Notes = codonFNotes.notes.f1
// so it can be reassigned to tsc codon later
let codonF2Notes = codonFNotes.notes.f2
const codonF3Notes = codonFNotes.notes.f3

const AA_Count1 = codonFNotes.AA_count.aa1
const AA_Count2 = codonFNotes.AA_count.aa2
const AA_Count3 = codonFNotes.AA_count.aa3

const checkValBase = useRef(true)
const checkVal2base = useRef(true)
const checkValCodon = useRef(true)
const checkVal10B = useRef(true)
const checkVal100B = useRef(true)
const checkValRepeat = useRef(true)
const checkValTRS = useRef(true)
const checkValNSP = useRef(true)
const checkValSL = useRef(true)
const checkValUTR = useRef(true)


  let orf1 = useRef(null);
  let orf2 = useRef(null);
  let orf3 = useRef(null);

  if (gb_Item.type === 'p') {
    switch (frame012) {
      case 0:
        if (gb_Item.start % 3 === 0) {
          orf1.current = gb_Item.product
        }
          break;
      case 1:
        if (gb_Item.start % 3 === 1) {
          orf2.current = gb_Item.product
        }
          break;
      case 2:
        if (gb_Item.start % 3 === 2) {
          orf3.current = gb_Item.product
        }
          break;
      default:
        console.log('error')
      break;
    }
  }
    // hack for frameshift to stop label of frag1
    if (index >= 13468 && index < 21550) orf3.current = ''

// when playing audio remove label as enter UTR from orf
  if (gb_Item.type === 'u') {
    orf1.current = null
    orf2.current = null
    orf3.current = null
  }

  function Feature(feature, i) {
    const style = {}
    style.backgroundColor = feature.col
    if ((index >= feature.start) && ((index <= feature.end))) {
        style.backgroundColor = 'rgb(240, 87, 87)'
      }
    return (
      <Fragment key={i}>
        <Button
          className='button'
          onClick={() => {
            shouldReset.current = true
            dispatch(setPlayhead(feature[startEnd]))
            setSynthStatus(0, false)
            setSynthStatus(1, false)
            setSynthStatus(2, false)
            // GAUCcount.current = 0
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
          <p style={{ fontSize: '0.9rem'  }}>{feature.tag}</p>
        </Button>
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
  const tsc_time = (trs_Item.end - trs_Item.start) / bpmFactor

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
    sonifySub:
    {
      trl: 'Translation of plus (+) RNA strand to make proteins. ',
      tsc: 'Transcription of plus (+)RNA to make the (-)RNA. '
    },
    bpTime:
    {
      trl:  convertBPtoTime((gb_Item.end - index) / bpmFactor)+ 'mm:ss ',
      tsc:  convertBPtoTime((index - gb_Item.start) / bpmFactor)+ 'mm:ss '
    },
    printGeneB:
    {
      trl:  (gb_Item.end - gb_Item.start),
      tsc:  (gb_Item.end - gb_Item.start)
    },
    printNSP:
    {
      trl:  (nsp_Item.end - nsp_Item.start),
      tsc:  (nsp_Item.end - nsp_Item.start)
    },
    printTRS:
    {
      trl:  (trs_Item.end - trs_Item.start),
      tsc:  (trs_Item.end - trs_Item.start)
    },
  }

// hack to use track to play alt notes in tsc mode rather than
// having to create new track and switch on/off in diff modes
  if(mode === 'tsc') codonF2Notes = [codonNotes_2]

  // if(index === 2) {
  //   dispatch(setPlayhead(444))
  // }
  // store

  return (
    <>
        <h2>{MAPS.source}</h2>
      <p>
        <span>{gb_Item.product}</span> extends from {gb_Item.start} to {gb_Item.end} bp. Playtime = {subHeadings.bpTime[mode]}
      </p>
      <div className='player-container'>

          <Controls />

        </div>


      <Song bpm={bpm}>
        <Track volume={-7} pan={-0.6}>
          <Instrument type={'synth'} notes={baseNotes} />
        </Track>
        <Track volume={-7} pan={0.6}>
          <Instrument type={'synth'} notes={twobaseNotes} />
        </Track>
        <Track volume={-4} pan={-0.9}>
          <Instrument type={'fmSynth'} oscillator={{ type: 'sine' }} notes={codonF1Notes} />
          <Effect type='feedbackDelay' wet={0.2} />
        </Track>
        <Track volume={-4} pan={0}>
          <Instrument type={'fmSynth'} oscillator={{ type: 'square' }} notes={codonF2Notes} />
          <Effect type='feedbackDelay' wet={0.2} />
        </Track>
        <Track volume={-4} pan={0.9}>
          <Instrument type={'fmSynth'} oscillator={{ type: 'triangle' }} notes={codonF3Notes} />
          <Effect type='feedbackDelay' wet={0.2} />
        </Track>
        <Track volume={-8} pan={-0.7}>
          <Instrument type={'amSynth'} notes={tenGCnote} />
          <Effect type='feedbackDelay' wet={0.3} />
        </Track>
        <Track volume={-8} pan={0.7}>
          <Instrument type={'amSynth'} notes={tentensGCnote} />
          <Effect type='feedbackDelay' wet={0.3} />
        </Track>
        <Track volume={-7} pan={0.3}>
          <Instrument type={'synth'} notes={sameBaseNotes} />
        </Track>
        <Track volume={-1} pan={0.8}>
          <Instrument type={'amSynth'} notes={getTRSnote} />
        </Track>
        <Track volume={0} pan={0.8}>
          <Instrument type={'amSynth'} notes={nspNote} />
        </Track>
        <Track volume={-10} pan={0.8}>
          <Instrument type={'amSynth'} notes={slNote} />
        </Track>
        <Track volume={-8} pan={-0.8}>
          <Instrument type={'amSynth'} notes={utrNote} />
        </Track>
    </Song>
    </>
  );
}

