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
import { controlsReverse, getReversed, getMode, getReset, controlsReset, getPlaying } from '../../state/controls';
import {
  getBase, getDinucleotide, getCodon,
  getBases10, getBases100
} from '../../utilities/motifs';
import { useSingleFramePrimitive } from '../../utilities/single-frame-primitive';

import { getBaseNotes, playTwoBase, getSameBaseNotes, GCnote10Note,
  GCnote100Note, makeTRSnotes, getNSPnotes, getCodonNotes,
  getCodonNotes_2, playAtIndex, getCodonNotes_3} from './get-notes'

import { getAA_Data } from './process-codon-notes'
import { Checkbox } from '../checkbox';
import { jumper } from './jumper';


export function PlayGenome() {
  const dispatch = useDispatch()
  const index = useSelector(getPlayhead)
  const isReversed = useSelector(getReversed)
  const mode = useSelector(getMode)
  const shouldReset = useSelector(getReset)
  const isPlaying = useSelector(getPlaying)

  useEffect(() => {
    if (shouldReset) dispatch(controlsReset(false))
  })

  const frame012 = index % 3;
  // console.log(1 % 3) = 1 shown as 2 should be 1
  // console.log(2 % 3) = 2 shown as 3 should be 2
  // console.log(3 % 3) = 0 shown as 1 should be 3

  let volume = -2
 // console.log(isPlaying)
  if(!isPlaying) volume = -50
//  console.log(volume)

  let bpm = 1280
  let audioProps = null
  let startEnd = null
  switch (mode) {
    case 'trl':
      bpm = 1280
      audioProps = 'trlProps'
      startEnd = 'start'
      break;
    case 'tsc':
      bpm = 1000
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
  if(index === 1 ){
    setSynthStatus(0, false)
    setSynthStatus(1, false)
    setSynthStatus(2, false)
  }
  // console.log(AAf1Motif[0]?.motif)
  // console.log(AAf2Motif[0]?.motif)
  // console.log(AAf3Motif[0]?.motif)

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
// 13444 start NSP11


  // const base = isPlaying ? getBase(index) : []

  const base = getBase(index)

  const baseNotes = getBaseNotes(base, audioProps)


  const twoBase = getDinucleotide(index)
  const twobaseNotes = playTwoBase(index, twoBase, audioProps)
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
  const codon1_3 = (getBase(index) + getBase(index + 2))
  const codon1_3Print = (getBase(index) + 'x' + getBase(index + 2))

  function codonsTSC() {
    if(mode === 'tsc'){
      return getCodonNotes_3(index, codon1_3, audioProps, codon1_3Print)
    }else {
      return []
    }
  }
  const gotcodonNotes_2 = codonsTSC()

  const codonNotes_2 = [gotcodonNotes_2.notes]
  const codon_2 = [gotcodonNotes_2.codon]

  const start = function() {
    if(codon === 'AUG') return true
    else return false
  }
  const stop = function() {
    if(codon === 'UGA' || codon === 'UAG' || codon === 'UAA') return true
    else return false
  }

  const playstop = stop()

  function setSynthByCodonType() {
    if(start() === true) setSynthStatus(frame012, true);
    if(stop() === true) setSynthStatus(frame012, false);

    if (frameshift) {
      isSynthEnabled.current[1] = true
      isSynthEnabled.current[0] = false
    }
  }
  setSynthByCodonType()

  const codonNotes = getCodonNotes(codon, audioProps)
  const AA_Data = getAA_Data(mode, frame012, isSynthEnabled, index, gb_Item, codonNotes, playstop)

    //start sliding window display AA residues on NSP start
    function setSynthByNSPstart() {
      setSynthStatus(frame012, true)
    }
    if( nsp_Item.start === index && nsp_Item.SW_true === true ) setSynthByNSPstart()

    const AAf1Note = AA_Data.notes.f1
    const AAf2Note = AA_Data.notes.f2
    const AAf3Note = AA_Data.notes.f3

    const AAf1Motif = AA_Data.motifs.f1
    const AAf2Motif = AA_Data.motifs.f2
    const AAf3Motif = AA_Data.motifs.f3

    const AA_Count1 = AA_Data.AA_count.aa1
    const AA_Count2 = AA_Data.AA_count.aa2
    const AA_Count3 = AA_Data.AA_count.aa3


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
      case 1:
        if (gb_Item.start % 3 === 1) {
          orf1.current = gb_Item.product + ' ' + nsp_Item.nsp
        }
          break;
      case 2:
        if (gb_Item.start % 3 === 2) {
          orf2.current = gb_Item.product + ' ' + nsp_Item.nsp
        }
        if (frameshift >= 13466 && frameshift < 13480) {
          orf1.current = gb_Item.product + ' ' + nsp_Item.nsp
          orf2.current = ''
        }
          break;
      case 0:
        if (gb_Item.start % 3 === 0) {
          orf3.current = gb_Item.product + ' ' + nsp_Item.nsp
        }
          break;
      default:
        console.log('error')
      break;
    }
  }

  let message = ''
  if (nsp_Item.tag === 'C' && mode === 'trl') {
    bpm = 214
    message = 'Polyprotein cleavage site'
  }

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
            dispatch(controlsReset(true))
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
          <p style={{ fontSize: '0.9rem' }}>{feature.tag}</p>
        </Button>
        {/* {feature.product} */}
      </Fragment>
    );
  }
  function makeComplementary(seq) {
    return seq.replace(/./g, (char) => MAPS.COMPLEMENUARY_MAP[char])
  }
  const genomeSub = genome.substring(index - 30, index + 30)
  const genomeSubComplement = makeComplementary(genome.substring(index, index + 30))
  const antiCodon = makeComplementary(codon);

  let dotfill40 = `                              `;
  let DNAfill40 = `                              `;
  function moveDot() {
    if (index <= 30) {
      dotfill40 = dotfill40.slice(index);
    } else {
      dotfill40 = '';
    }
  }
  moveDot();

  const SW1_PropStyle = {
    content: AAf1Motif[0]?.motif,
    props: {
      className: 'frame1 circle',
    }
  }
  const SW2_PropStyle = {
    content: AAf2Motif[0]?.motif,
    props: {
      className: 'frame2 circle',
    }
  }
  const SW3_PropStyle = {
    content: AAf3Motif[0]?.motif,
    props: {
      className: 'frame3 circle',
    }
  }
  // const SW_DNA_PropStyle = {
  //   content: base,
  //   props: {
  //     className: 'frame3',
  //   }
  // }
  // x nt per second eg 6 x 60 = 360/4 = 90 bpm
  // (bpm*4)/60
  // let bpmFactor = (bpm * 5) / bpm
  let bpmFactor = bpm /256
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
  const subHeadings = {
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
      trl:  (gb_Item.end+1 - index),
      tsc:  (index - gb_Item.start+1)
    },
    printNSP:
    {
      trl:  (nsp_Item.end+1 - index),
      tsc:  (index - nsp_Item.start+1)
    },
    printTRS:
    {
      trl:  (trs_Item.end+1 - index),
      tsc:  (index - trs_Item.start+1)
    },
    checkbox:
    {
      trl: 'Translate as subgenomic RNA',
      tsc: 'Transcribe to subgenomic RNA'
    },
    process:
    {
      trl: 'Translation',
      tsc: 'Transcription'
    },

  }

  const subGenome = useRef(false)

  if(mode === 'trl'){
    jumper.map(doJump)
    function doJump(jumper){
      if(index === jumper.end5 && subGenome.current === true) {
        dispatch(setPlayhead(jumper.end3))
      }
    }
    if(subGenome.current === false && index === 21553) Tone.Transport.stop()
  }
  if(mode === 'tsc'){
    jumper.map(doJump)
    function doJump(jumper){
      if(index === jumper.end3 && subGenome.current === true) {
        dispatch(setPlayhead(jumper.end5))
      }
    }
  }

  return (
    <>
      <h2>{MAPS.source}</h2>
      <p>
        <span>{gb_Item.product}</span> extends from {gb_Item.start} to {gb_Item.end} bp.
        Playtime = {subHeadings.bpTime[mode]}
      </p>
      <div className='player-container'>
        {/* <span className='playCont_text'>{subHeadings.sonifySub[mode]}</span> */}
        <Checkbox
          default={subGenome.current}
          onClick={(value) => subGenome.current = value}
        />
        <span className='playCont_text'> {subHeadings.checkbox[mode]}</span>

        <span className='message'> {message}</span>

        <div className='player'>
          {mode === 'trl' && (
          <div>
            <div className='pre'>
              <span>
              Frame1
              <span className='highlight'> {String(AA_Count1.current).padStart(4, '0')}</span>
              </span>|

              <SlidingStringWindow
              reset={shouldReset}
              initial='                                 '
              insert=' '
              replace={SW1_PropStyle}
              />
              {/* {AA_indicatorF1.start}{AA_indicatorF1.stop} */}
              {
              orf1.current &&
                <div className='triangle-left f1'></div>
              }
              <span className='orf'>{orf1.current}</span>
            </div>

            <div className='pre'>
              <span>
              Frame2
              <span className='highlight'> {String(AA_Count2.current).padStart(4, '0')}</span>
              </span>|
              <SlidingStringWindow
              reset={shouldReset}
              initial='                                 '
              insert=' '
              replace={SW2_PropStyle}
              />
              {/* {AA_indicatorF2.start}{AA_indicatorF2.stop} */}
              {
              orf2.current &&
                <div className='triangle-left f2'></div>
              }
              <span className='orf'>{orf2.current}</span>
            </div>

            <div className='pre'>
              <span>
              Frame3
              <span className='highlight'> {String(AA_Count3.current).padStart(4, '0')}</span>
              </span>|
              <SlidingStringWindow
              reset={shouldReset}
              initial='                                 '
              insert=' '
              replace={SW3_PropStyle}
              />
              {/* {AA_indicatorF3.start}{AA_indicatorF3.stop} */}
              {
              orf3.current &&
                <div className='triangle-left f3'></div>
              }
              <span className='orf'>{orf3.current}</span>
            </div>

            <div className='ribosome Small shadow'><br></br><br></br>ribosome small</div>
            <div className='ribosome Big shadow'><br></br>ribosome large</div>
            <div className='playhead shadow'></div>
            <span className='antiC shadow'>{antiCodon}</span>

          </div>
          )}
          <div>
            <div>
              <p className='pre'>
              <span>Total 29903|5`                            </span>
              <span>                             3`</span>
              </p>
            </div><span> RNA +</span>
              <span className='highlight'> {String(index).padStart(5, '0')}</span>|
              {/* {nsp_Item.tag} */}
              <GenomeDisplay className='pre'>{dotfill40 + genomeSub}</GenomeDisplay>
          </div>


          { mode === 'tsc' && (
          <div>
            <div className='playrev shadow'></div>
            <div className='replicase shadow'>NSP proteins</div>
            <div className='replicase p1 shadow'>helicase</div>
            <div className='replicase p2 shadow'><br></br><br></br>RNA-dependent RNA polymerase</div>
            <div className='replicase p3 shadow'></div>
            <div className='replicase p4 shadow'></div>
            <div className='replicase p5 shadow'></div>
            <div className='replicase p6 shadow'></div>
            <div className='replicase p7 shadow'></div>
            <span> RNA -</span>
            <span> {String(genome.length - (index)).padStart(5, '0')}</span>|
            <span className=' pre'>{DNAfill40 + genomeSubComplement}</span>
            <p className='pre'>            3`                                                         5`</p>
            <br></br>
          </div>
          )}

        </div>
      </div>
    <div>

        <hr></hr>
        {/* {MAPS.startStop_json.map(Feature)} */}
        <Controls /> Biological Proces - <h3 className='block'> {subHeadings.process[mode]}</h3>
        <fieldset>
        <p>
        Genes.
        <span> {gb_Item.product} </span>
        ({gb_Item.start}-{gb_Item.end}) bp. {subHeadings.printGeneB[mode]} bp<br></br>
        <span><small>{gb_Item.text}</small></span>
        </p>
        <p>{MAPS.geneBank_json.map(Feature)}
          <span><small><br></br>
            <button className="button legend"></button> Untranslated regions
            <button className="button legend2"></button> Viral proteins
          </small></span>
        </p>
        <hr></hr>
        <p>
        NSP proteins.
        <span> {nsp_Item.text} </span>
        ({nsp_Item.start}-{nsp_Item.end}) bp. {subHeadings.printNSP[mode]} bp<br></br>
        <span><small>{nsp_Item.note}</small></span>
        </p>
        {MAPS.nsp_json.map(Feature)}
        <span><small><br></br>
          <button className="button legend2"></button> Cleavage points
          <button className="button legend"></button> NSP proteins
        </small></span>

        <p>
        Transcription Regulatory Sequences.
        <span> {trs_Item.trs_name} </span>
        ({trs_Item.start}-{trs_Item.end}) bp. {subHeadings.printTRS[mode]} bp<br></br>
        <span><small>{trs_Item.text} {trs_Item.trs_seq}</small></span>
        </p>
        {MAPS.trs_json.map(Feature)}
        <span><small><br></br>
          <button className="button legend2"></button> Transcription Regulatory Regions
          <button className="button legend"></button> Interveining Sequences
          <button className="button legend3"></button> Stem Loop regions
        </small></span>
        </fieldset>

        <fieldset>
          <h3>Real-time display of audio notes generated from Coronavirus genome. </h3>
          <table className="fullwidth">
            <thead>
              <tr>
                <th>Mute</th>
                <th>Feature</th>
                <th>Motif</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Checkbox
                    default={checkValBase.current}
                    onClick={(value) => checkValBase.current = value}
                  />
                </td>
                <td>Nucleotide</td>
                <td>{ base }</td>
                <td>{ baseNotes[0].name }</td>
              </tr>
              <tr>
              <td>
                  <Checkbox
                    default={checkVal2base.current}
                    onClick={(value) => checkVal2base.current = value}
                  />
                </td>
                <td>Di-Nucleotide</td>
                <td>{ (twobaseNotes[0].name) ? twoBase : '-'} </td>
                <td>{ (twobaseNotes[0].name) ? twobaseNotes[0].name : '-' }</td>
              </tr>
              <tr>
              <td>
                  <Checkbox
                    default={checkVal10B.current}
                    onClick={(value) => checkVal10B.current = value}
                  />
                </td>
                <td>GC Content over 10 bp</td>
                <td>{ GCnote10Numb/10 }</td>
                <td>{ tenGCnote[0].name }</td>
              </tr>
              <tr>
              <td>
                  <Checkbox
                    default={checkVal100B.current}
                    onClick={(value) => checkVal100B.current = value}
                  />
                </td>
                <td>GC Content over 100 bp</td>
                <td>{ GCnote100Numb/10 }</td>
                <td>{ tentensGCnote[0].name }</td>
              </tr>

              {isReversed ? <tr>
              <td>
                  <Checkbox
                    default={checkValCodon.current}
                    onClick={(value) => checkValCodon.current = value}
                  />
                </td>
                <td>Tri-Nucleotide</td>
                <td>{ (codon_2[0]?.codon) ? codon_2[0]?.codon : '-'}</td>
                <td>{ (codonNotes_2[0]?.name) ? codonNotes_2[0]?.name : '-' }</td>
              </tr>
                :
              <tr>
              <td>
                  <Checkbox
                    default={checkValCodon.current}
                    onClick={(value) => checkValCodon.current = value}
                  />
                </td>
                <td>Peptide Frame 1<br></br>Peptide Frame 2<br></br>Peptide Frame 3</td>
                <td>{ (AAf1Motif[0]?.motif2) ? AAf1Motif[0]?.motif2 : '-' }<br></br>
                    { (AAf2Motif[0]?.motif2) ? AAf2Motif[0]?.motif2 : '-' }<br></br>
                    { (AAf3Motif[0]?.motif2) ? AAf3Motif[0]?.motif2 : '-' }</td>
                <td>{ (AAf1Note[0]?.name) ? AAf1Note[0]?.name : '-'  }<br></br>
                    { (AAf2Note[0]?.name) ? AAf2Note[0]?.name : '-'  } <br></br>
                    { (AAf3Note[0]?.name) ? AAf3Note[0]?.name : '-' }</td>
              </tr>
              }

              <tr>
              <td>
                  <Checkbox
                    default={checkValUTR.current}
                    onClick={(value) => checkValUTR.current = value}
                  />
                </td>
                <td>U: Untranslated region:</td>
                <td>{ (utrNote[0].name) ? base : '-' }</td>
                <td>{ (utrNote[0].name) ? utrNote[0].name : '-' }</td>
              </tr>

              <tr>
              <td>
                  <Checkbox
                    default={checkValTRS.current}
                    onClick={(value) => checkValTRS.current = value}
                  />
                </td>
                <td> T1-10: Transcription RS {trs_Item.trs_seq}</td>
                <td>{ (trs_Item.trs_seq) ? base : '-' }</td>
                <td>{ (trs_Item.trs_seq) ? getTRSnote[0].name : '-' }</td>
              </tr>

              <tr>
              <td>
                  <Checkbox
                    default={checkValNSP.current}
                    onClick={(value) => checkValNSP.current = value}
                  />
                </td>
                <td>C: Cleavage site</td>
                <td>{ (nspNote[0].name) ? base : '-' }</td>
                <td>{ (nspNote[0].name) ? nspNote[0].name : '-' }</td>
              </tr>

              <tr>
              <td>
                  <Checkbox
                    default={checkValSL.current}
                    onClick={(value) => checkValSL.current = value}
                  />
                </td>
                <td>SL: Stem and Loop</td>
                <td>{ (slNote[0].name) ? base : '-' }</td>
                <td>{ (slNote[0].name) ? slNote[0].name : '-' }</td>
              </tr>

              <tr>
              <td>
                  <Checkbox
                    default={checkValRepeat.current}
                    onClick={(value) => checkValRepeat.current = value}
                  />
                </td>
                <td>Three base repeat:</td>
                <td>{ (sameBaseNotes[0].name)? codon : '-' }</td>
                <td>{ (sameBaseNotes[0].name)? sameBaseNotes[0].name : '-' }</td>
              </tr>

            </tbody>
          </table>
        </fieldset>
      </div>

      <Song bpm={bpm} volume={volume} >
        {checkValBase.current && <Track volume={-6} pan={-0.6}>
          <Instrument type={'synth'} notes={baseNotes[0].name && baseNotes} />
        </Track>}
          {checkVal2base.current && <Track volume={-6} pan={0.6}>
          <Instrument type={'synth'} notes={twobaseNotes[0].name && twobaseNotes} />
        </Track>}

        { mode === 'trl' &&
        checkValCodon.current && <Track volume={-5} pan={-0.9}>
          <Instrument type={'fmSynth'} oscillator={{ type: 'sine' }} notes={AAf1Note[0] && AAf1Note} />
          {/* <Effect type='feedbackDelay' wet={0.2} /> */}
        </Track>}
        { mode === 'trl' &&
        checkValCodon.current && <Track volume={-5} pan={0}>
          <Instrument type={'fmSynth'} oscillator={{ type: 'square' }} notes={AAf2Note[0] && AAf2Note} />
          {/* <Effect type='feedbackDelay' wet={0.2} /> */}
        </Track>}
        { mode === 'trl' &&
        checkValCodon.current && <Track volume={-5} pan={0.9}>
          <Instrument type={'fmSynth'} oscillator={{ type: 'triangle' }} notes={AAf3Note[0] && AAf3Note} />
          {/* <Effect type='feedbackDelay' wet={0.2} /> */}
        </Track>}

        { mode === 'tsc' &&
        checkValCodon.current && <Track volume={-7} pan={-0.4}>
          <Instrument type={'fmSynth'} oscillator={{ type: 'square' }} notes={codonNotes_2[0].name && codonNotes_2} />
          <Effect type='feedbackDelay' wet={0.1} />
        </Track>}

        {checkVal10B.current && <Track volume={-6} pan={-0.7}>
          <Instrument type={'amSynth'} notes={tenGCnote[0].name && tenGCnote} />
          <Effect type='feedbackDelay' wet={0.3} />
        </Track>}
        {checkVal100B.current && <Track volume={-7} pan={0.7}>
          <Instrument type={'amSynth'} notes={tentensGCnote[0].name && tentensGCnote} />
          <Effect type='feedbackDelay' wet={0.3} />
        </Track>}

        {checkValRepeat.current && <Track volume={-11} pan={0.3}>
          <Instrument type={'synth'} notes={sameBaseNotes[0].name && sameBaseNotes} />
          <Effect type='feedbackDelay' wet={0.2} />
        </Track>}

        {checkValTRS.current && <Track volume={-7} pan={0.8}>
          <Instrument type={'amSynth'} notes={getTRSnote[0].name && getTRSnote} />
        </Track>}
        {checkValUTR.current && <Track volume={-7} pan={-0.8}>
          <Instrument type={'amSynth'} notes={utrNote[0].name &&  utrNote} />
          {/* <Effect type='distortion' wet={0.2} /> */}
        </Track>}

        {checkValNSP.current && <Track volume={-5} pan={-0.8}>
          <Instrument type={'amSynth'} notes={nspNote[0].name && nspNote} />
          <Effect type='distortion' wet={0.3} />
        </Track>}

        {checkValSL.current && <Track volume={-7} pan={0.8}>
          <Instrument type={'amSynth'} notes={slNote[0].name && slNote} />
        </Track>}

    </Song>
    </>
  );
}

