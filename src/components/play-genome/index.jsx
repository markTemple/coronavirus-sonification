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

  const shouldReset = useSingleFramePrimitive(false)

  const [mode, setmode] = useState('trl')
  const togglemode = () => {
    setmode(mode === 'trl' ? 'tsc' : 'trl')
    // actions.set(mode === 'tsc' ? 0 : 29902)
  }
  const frame012 = index % 3;

  let bpm = null
  let audioProps = null
  let startEnd = null
  if (mode === 'tsc') {
    dispatch(controlsSetDirection(true))
    bpm = 60
    audioProps = 'tscProps'
    startEnd = 'end'
  }

  if (mode === 'trl') {
    dispatch(controlsSetDirection(false))
    bpm = 80
    audioProps = 'trlProps'
    startEnd = 'start'
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
  const twobaseNotes = playTwoBase(twoBase, audioProps)
  const sameBaseNotes = getSameBaseNotes(base, index, audioProps)
  const GCnote10 = getBases10(index)
  const GCnote10Numb = MAPS.newGCratio(GCnote10)
  const tenGCnote = GCnote10Note(GCnote10, GCnote10Numb, audioProps)
  const GCnote100 = getBases100(index)
  const GCnote100Numb = MAPS.newGCratio(GCnote100)
  const tentensGCnote = GCnote100Note(GCnote100, GCnote100Numb, audioProps)
  const getTRSnote = makeTRSnotes(mode, trs_Item, index, audioProps)
  const nspNote = getNSPnotes(nsp_Item, base, index, mode, audioProps)
  const slNote = playAtIndex(index, trs_Item, 'button_label', 'SL', twoBase, audioProps, mode)
  const utrNote = playAtIndex(index, gb_Item, 'gene', 'UTR', twoBase, audioProps, mode)

  const codon = getCodon(index)
  const codonNotes = getCodonNotes(codon, audioProps)
  const codonNotes_2 = getCodonNotes_2(codon, audioProps, frame012)

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

//start sliding window display AA residues on NSP start
  function setSynthByNSPstart() {
    setSynthStatus(frame012, true)
  }
  if( nsp_Item.start === index && nsp_Item.SW_true === true ) setSynthByNSPstart()


const codonFNotes = getCodonFNotes(mode, frame012, isSynthEnabled, index, gb_Item, codonNotes, codonNotes_2)

const codonF1Notes = codonFNotes.notes.f1
const codonF2Notes = codonFNotes.notes.f2
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
    if (frame012 === 0 && gb_Item.start % 3 === 0) {
      orf1.current = gb_Item.product
    }
    if (frame012 === 1 && gb_Item.start % 3 === 1) {
      orf2.current = gb_Item.product
    }
    if (frame012 === 2 && gb_Item.start % 3 === 2) {
      orf3.current = gb_Item.product
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

  let codonStatusF1 = {start: null, stop: null};
  let codonStatusF2 = {start: null, stop: null};
  let codonStatusF3 = {start: null, stop: null};

  if (frame012 === 0) {
   codonStatusF1 = {start: buttonSTART(), stop: buttonSTOP()}
  }
  if (frame012 === 1) {
   codonStatusF2 = {start: buttonSTART(), stop: buttonSTOP()}
  }
  if (frame012 === 2) {
   codonStatusF3 = {start: buttonSTART(), stop: buttonSTOP()}
  }


  function Feature(feature, i) {
    const color = ['#f08b2c', '#5da793', '#1396ba']//color by frame ??
    const style = {}
    //add moer things to call here as const's
    // if(typeof feature.trs_seq !== 'undefined'){
    //   if ((index >= feature.end) && ((index <= feature.start))) {
    //     // style.backgroundColor = color[frame012]
    //     style.backgroundColor = 'blue'
    //   }
    // }
    if (feature.type === 'p') {
      // style.backgroundColor = color[frame012]
      style.backgroundColor = '#f08b2c'
    } else if (feature.button_label === 'C') {
      style.backgroundColor = '#339fbd'
    } else if (feature.isNSP === 'y') {
      style.backgroundColor = '#f08b2c'
    } else if (feature.button_label === 'Seq') {
      style.backgroundColor = '#339fbd'
    } else if (feature.button_label === 'SL') {
      style.backgroundColor = '#f08b2c'
    } else {
      style.backgroundColor = '#5da793'
    }
    if ((index >= feature.start) && ((index <= feature.end))) {
        // style.backgroundColor = color[frame012]
        style.backgroundColor = '#b1574d'
      }

    // include a reset GC count on click
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
          <p style={{ fontSize: '0.9rem'  }}>{feature.button_label}</p>
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
      trl: gb_Item.product,
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
      tsc: trs_Item.end - trs_Item.start
    },
    sonifySub:
    {
      trl: 'Sonification of translation of plus RNA strand to make proteins. ',
      tsc: 'Sonification of transcription of RNA to make the minus strand RNA. '
    },
    sonifyTime:
    {
      trl: convertBPtoTime(trl_time),
      tsc: convertBPtoTime(tsc_time)
    },
    modeTitle:
    {
      trl: ` Translation of (+) strand RNA to make protein`,
      tsc: ` Transcription of (+)strand RNA to make (-)strand copy`
    },
    printGeneB:
    {
      trl:  (gb_Item.end - index)+ '/' +(gb_Item.end - gb_Item.start) ,
      tsc:  (index - gb_Item.start)+ '/' + (gb_Item.end - gb_Item.start)
    },
    printNSP:
    {
      trl:  (nsp_Item.end - index)+ '/' +(nsp_Item.end - nsp_Item.start) ,
      tsc:  (index - nsp_Item.start)+ '/' + (nsp_Item.end - nsp_Item.start)
    },
    printTRS:
    {
      trl:  (trs_Item.end - index)+ '/' +(trs_Item.end - trs_Item.start) ,
      tsc:  (index - trs_Item.start)+ '/' + (trs_Item.end - trs_Item.start)
    },
  }

  return (
    <>
        <h2>{MAPS.source}</h2>
      <p>
        <span>{subHeadings.rnaRegion[mode]}</span> extends from {subHeadings.rnaBegin[mode]} to {subHeadings.rnaEnd[mode]} bp ({subHeadings.rnaLength[mode]} bp in length)
      </p>
        <hr />
      <p>
        {subHeadings.sonifySub[mode]} Audio time <span>{subHeadings.sonifyTime[mode]}</span> (m:s)
      </p>
        <br />
      <div className='player-container'>
        <div className='player'>
          {mode === 'trl' && (
            <div>
              <div className='pre'>
                <span>
                  Frame1
                    <span> {String(AA_Count1.current).padStart(4, '0')}</span>
                    </span>|

                <SlidingStringWindow
                  reset={shouldReset.current}
                  initial='                                           '
                  insert=' '
                  replace={SW1_PropStyle}
                />{codonStatusF1.start}{codonStatusF1.stop}
                {
                  orf1.current &&
                  <div className='triangle-left f1'></div>
                }
                <span className='orf'>{orf1.current}</span>
              </div>

              <div className='pre'>
                <span>
                  Frame2
                    <span> {String(AA_Count2.current).padStart(4, '0')}</span>
                  </span>|
                <SlidingStringWindow
                  reset={shouldReset.current}
                  initial='                                           '
                  insert=' '
                  replace={SW2_PropStyle}
                />{codonStatusF2.start}{codonStatusF2.stop}
                {
                  orf2.current &&
                  <div className='triangle-left f2'></div>
                }
                <span className='orf'>{orf2.current}</span>
              </div>

              <div className='pre'>
                <span>
                  Frame3
                    <span> {String(AA_Count3.current).padStart(4, '0')}</span>
                  </span>|
                <SlidingStringWindow
                  reset={shouldReset.current}
                  initial='                                           '
                  insert=' '
                  replace={SW3_PropStyle}
                />{codonStatusF3.start}{codonStatusF3.stop}
                {
                  orf3.current &&
                  <div className='triangle-left f3'></div>
                }
                <span className='orf'>{orf3.current}</span>
              </div>

              <div className='ribosomeSmall shadow'></div>
              <div className='ribosomeBig shadow'></div>
              <div className='playhead shadow'></div>
              <span className='antiC shadow'>{antiCodon}</span>

            </div>
          )}
          <div>
            <div>
              <p className='pre'>
                <span>Total 29903|5`                                      </span>
                <span>                                        3`</span>
              </p>
            </div><span> RNA +</span>
            <span> {String(index).padStart(5, '0')}</span>|
            {isReversed
              ? <span className='pre'>{dotfill40 + genomeSub}</span>
              : <GenomeDisplay className='pre'>{dotfill40 + genomeSub}</GenomeDisplay>
          }
          </div>
          { mode === 'tsc' && (
            <div>
              <div className='playrev shadow'></div>
              <div className='replicase shadow'></div>
              <div className='replicase p1 shadow'></div>
              <div className='replicase p2 shadow'></div>
              <div className='replicase p3 shadow'></div>
              <div className='replicase p4 shadow'></div>
              <div className='replicase p5 shadow'></div>
              <div className='replicase p6 shadow'></div>
              <div className='replicase p7 shadow'></div>
              <span> RNA -</span>
              <span> {String(genome.length - (index)).padStart(5, '0')}</span>|
              <span className=' pre'>{DNAfill40 + genomeSubComplement}</span>
              <p className='pre'>            3`                                                                              5`</p>
            </div>
          )}
        </div>
      </div>
        <hr />
        <div>
          <Controls />
          <br />
          <br />
          <Button onClick={togglemode} className='button'>Switch Direction</Button>
          <span> {subHeadings.modeTitle[mode]}</span>
        <hr></hr>
          <p><h3>RNA map: Translated RNA regions.</h3> {gb_Item.product}: {subHeadings.printGeneB[mode]} bp.
          </p>
          {MAPS.geneBank_json.map(Feature)}
          <p><small>U - Untranslated regions, Polyprotein - Very large protein that is cleaved
            into smaller NSP proteins, S, E, M, N - are common proteins found in all coronavirus,
            ORF's - individual proteins (open reading frames) that are translated from shorter subgenomic RNA sequences.</small>
          </p>
          <hr></hr>
          <p><h3>RNA map: Cleavage sites (C) and NSP proteins (N) made from the ab1/2 Polyprotein.</h3> {nsp_Item.nsp} {nsp_Item.aa_res}: {subHeadings.printNSP[mode]} bp.</p>
          {MAPS.nsp_json.map(Feature)}
          <p><small>N1 to N16 - Small NSP proteins made by cleavage of the virally encoded polyprotein,
            C - The cleavage points within the polyprotein, Outside Poly-protein - represents the remaining region
            where all other genes are located (such as the S, E, M and N proteins and ORF's).</small>
          </p>
          <hr></hr>
          <p><h3>RNA map: Transcription Regulatory Sequences.</h3> {trs_Item.button_label}: {subHeadings.printTRS[mode]} bp. {trs_Item.trs_seq}
          </p>
          {MAPS.trs_json.map(Feature)}<br />
          <p><small>T1 to T10 represent the Transcription Regulatory Sequence (TRS) where RNA structural elements occur which
            lead to the fromation of smaller transcribed versions of the RNA genome (each including the 5'leader and 3`UTR regions,
            SL - represent regions where stem and loop structural elements occur, Seq - represent intervening units of RNA
            sequence (genelike) that are included in the subgenomic RNA's).</small>
          </p>
          <hr></hr>
          <div className='row'>
            <div className='column'>
              <h3>Audio details and control. </h3>
              <table className="fullwidth">
                <thead>
                  <tr>
                    <th>Audio</th>
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
                    <td>Nucleotide: </td>
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
                    <td>Di-Nucleotide: </td>
                    <td>{ twoBase} </td>
                    <td>{ twobaseNotes[0].name }</td>
                  </tr>
                  <tr>
                  <td>
                      <Checkbox
                        default={checkValCodon.current}
                        onClick={(value) => checkValCodon.current = value}
                      />
                    </td>
                    <td>Codon</td>
                    <td>{ codon }</td>
                    <td>({ MAPS.CODON_MAP[codon]?.AA })</td>
                  </tr>
                  <tr>
                  <td>
                      <Checkbox
                        default={checkVal10B.current}
                        onClick={(value) => checkVal10B.current = value}
                      />
                    </td>
                    <td>GC Content 10 bases:</td>
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
                    <td>GC Content 100 bases:</td>
                    <td>{ GCnote100Numb/10 }</td>
                    <td>{ tentensGCnote[0].name }</td>
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
                  <tr>
                  <td>
                      <Checkbox
                        default={checkValTRS.current}
                        onClick={(value) => checkValTRS.current = value}
                      />
                    </td>
                    <td> TRS {trs_Item.trs_seq}:</td>
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
                    <td>NSP cleavage:</td>
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
                    <td>Stem and Loop RNA:</td>
                    <td>{ (slNote[0].name) ? base : '-' }</td>
                    <td>{ (slNote[0].name) ? slNote[0].name : '-' }</td>
                  </tr>
                  <tr>
                  <td>
                      <Checkbox
                        default={checkValUTR.current}
                        onClick={(value) => checkValUTR.current = value}
                      />
                    </td>
                    <td>Highlight body UTR regions:</td>
                    <td>{ (utrNote[0].name) ? base : '-' }</td>
                    <td>{ (utrNote[0].name) ? utrNote[0].name : '-' }</td>
                  </tr>
                </tbody>
              </table>

              {/* <p> GCAU score (GC=+1, AT=-1) {GAUCcount.current}</p> */}
            </div>
            <div className='column'>

            <h3>Description of sonified RNA. </h3>
            <table className="fullwidth">
                <tbody>
                  <tr>
                    <td><span><b>Translated Region: </b></span>
                    {gb_Item.start} - {gb_Item.end} bp</td>
                  </tr>
                  <tr>
                    <td>{gb_Item.text} <br />
                    {gb_Item.protein_id} {gb_Item.GeneID}</td>
                  </tr>
                  <tr>
                    <td><span><b>Cleavage products of the ab1/2 Polyprotein: </b></span>
                    {nsp_Item.start} - {nsp_Item.end} bp
                  </td>
                  </tr>
                  <tr>
                    <td>{nsp_Item.text}</td>
                  </tr>
                  <tr>
                    <td><span><b>Transcriptional Elements: </b></span>
                    {trs_Item.start} - {trs_Item.end} bp</td>
                  </tr>
                  <tr>
                    <td>{trs_Item.text}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      <Song bpm={bpm}>
        {checkValBase.current && <Track volume={-7} pan={-0.3}>
          <Instrument type={'synth'} notes={baseNotes} />
        </Track>}
        {checkVal2base.current && <Track volume={-7} pan={0.3}>
          <Instrument type={'synth'} notes={twobaseNotes} />
        </Track>}
        {checkValRepeat.current && <Track volume={-7} pan={0.3}>
          <Instrument type={'synth'} notes={sameBaseNotes} />
        </Track>}


        {checkValCodon.current && <Track volume={-4} pan={-0.9}>
          <Instrument type={'fmSynth'} oscillator={{ type: 'sine' }} notes={codonF1Notes} />
          <Effect type='feedbackDelay' wet={0.2} />
        </Track>}
        {checkValCodon.current && <Track volume={-4} pan={0}>
          <Instrument type={'fmSynth'} oscillator={{ type: 'square' }} notes={codonF2Notes} />
          <Effect type='feedbackDelay' wet={0.2} />
        </Track>}
        {checkValCodon.current && <Track volume={-4} pan={0.9}>
          <Instrument type={'fmSynth'} oscillator={{ type: 'triangle' }} notes={codonF3Notes} />
          <Effect type='feedbackDelay' wet={0.2} />
        </Track>}

        {checkVal10B.current && <Track volume={-8} pan={-0.6}>
          <Instrument type={'amSynth'} notes={tenGCnote} />
          <Effect type='feedbackDelay' wet={0.3} />
        </Track>}
        {checkVal100B.current && <Track volume={-8} pan={0.6}>
          <Instrument type={'amSynth'} notes={tentensGCnote} />
          <Effect type='feedbackDelay' wet={0.3} />
        </Track>}

        {checkValTRS.current && <Track volume={-1} pan={0.8}>
          <Instrument type={'amSynth'} notes={getTRSnote} />
        </Track>}
        {checkValNSP.current && <Track volume={0} pan={0.8}>
          <Instrument type={'amSynth'} notes={nspNote} />
        </Track>}

        {checkValSL.current && <Track volume={0} pan={0.8}>
          <Instrument type={'amSynth'} notes={slNote} />
        </Track>}
        {checkValUTR.current && <Track volume={0} pan={-0.8}>
          <Instrument type={'amSynth'} notes={utrNote} />
        </Track>}
    </Song>
    </>
  );
}

