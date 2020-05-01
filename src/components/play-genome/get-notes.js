import { getBase } from '../../utilities/motifs';
import * as MAPS from '../../utilities/maps';
import React, { useRef } from 'react';

export function getBaseNotes (base, audioProps) {
  const baseNumb = MAPS.BASE_MAP[base]
  const baseMap = MAPS.makeIntervals(MAPS[audioProps].base).map(number => MAPS.keyboard[number])
  return [{name: baseMap[baseNumb], duration: MAPS[audioProps].base.dur}];
}

export function playTwoBase(index, twoBase, audioProps) {
  if(index % 2)
  {
    const twoBaseNumb = MAPS.TWOBASE_MAP[twoBase]
    const twoBaseMap = MAPS.makeIntervals(MAPS[audioProps].twoBase).map(number => MAPS.keyboard[number])
    return [{name: twoBaseMap[twoBaseNumb], duration: MAPS[audioProps].twoBase.dur}];
  } else {
    return [{name: ''}];
  }
}

export function getSameBaseNotes(base, index, audioProps) {
  const count = useRef(0)
  if ( (base === getBase(index + 1) ) && ( base === getBase(index + 2) ) )
  {
    if(count.current >= 2) count.current = 0
    const repeatBasesMap = MAPS.makeIntervals(MAPS[audioProps].repeatBases).map(number => MAPS.keyboard[number])
    count.current++
    return [{name: repeatBasesMap[count.current], duration: MAPS[audioProps].repeatBases.dur}];
  } else{
    return [{name: ''}];
  }
}

export function GCnote10Note(GCnote10, GCnote10Numb, audioProps) {
    const GCnote10Map = MAPS.makeIntervals(MAPS[audioProps].GCnote).map(number => MAPS.keyboard[number])
    return [{name: GCnote10Map[GCnote10Numb], duration: MAPS[audioProps].GCnote.dur}]
}

export function GCnote100Note(GCnote100, GCnote100Numb, audioProps) {
  const GCnote100Map = MAPS.makeIntervals(MAPS[audioProps].GCnote).map(number => MAPS.keyboard[number])
  return [{name: GCnote100Map[GCnote100Numb], duration: MAPS[audioProps].GCnote.dur}];
}

export function makeTRSnotes(mode, trs_Item, index, audioProps){
  const trs_seqArray = useRef(null)
  if(mode === 'trl') {
    if(trs_Item.start === index && trs_Item.trs_seq) trs_seqArray.current = trs_Item.trs_seq.split('')
  }else if(mode === 'tsc') {
    if(trs_Item.end === index && trs_Item.trs_seq) trs_seqArray.current = trs_Item.trs_seq.split('').reverse()
  }
  const trs = trs_seqArray.current?.shift()
  if(trs !== undefined){ //stop empty mode being made that throws a warning
    const trsNumb = MAPS.BASE_MAP[trs]
    const trsMap = MAPS.makeIntervals(MAPS[audioProps].trsNote).map(number => MAPS.keyboard[number])
      // if (trs_seqArray.current) {
      return [{name: trsMap[trsNumb], duration: MAPS[audioProps].trsNote.dur}];
      // }
    }else {
    return [{name: ''}]
    }
}

export function getNSPnotes(nsp_Item, base, index, mode, audioProps) {
  if(mode === 'trl') {
    if(index >= nsp_Item.start && index <= nsp_Item.end && nsp_Item.cleavage === true) {
      const nspNumb = MAPS.NSP_MAP[base]
      const nspMap = MAPS.makeIntervals(MAPS[audioProps].base).map(number => MAPS.keyboard[number])
      return [{name: nspMap[nspNumb], duration: MAPS[audioProps].nsp.dur}]
    }else {
      return [{name: ''}]
      }
  }else if(mode === 'tsc') {
    if(index <= nsp_Item.end && index >= nsp_Item.start && nsp_Item.cleavage === true) {
      const nspNumb = MAPS.NSP_MAP[base]
      const nspMap = MAPS.makeIntervals(MAPS[audioProps].base).map(number => MAPS.keyboard[number])
      return [{name: nspMap[nspNumb], duration: MAPS[audioProps].nsp.dur}]
    }else {
      return [{name: ''}]
      }
  }
}

export function getCodonNotes(codon, audioProps) {
  const codonNumb = MAPS.CODON_MAP[codon]?.Note
  const codonMap = MAPS.makeIntervals(MAPS[audioProps].codon).map(number => MAPS.keyboard[number])
    return {
    notes:{ name: codonMap[codonNumb], duration: MAPS[audioProps].codon.dur },
    motif:{ motif:MAPS.CODON_MAP[codon]?.AA1, motif2:MAPS.CODON_MAP[codon]?.AA} }
  }

// map codon to different notes here
  export function getCodonNotes_2(index, codon, audioProps, mode) {
    if(index % 3 === 1 && mode === 'tsc'){
      const codonNumb = MAPS.CODON_MAP_2[codon]?.Note
      const codonMap = MAPS.makeIntervals(MAPS[audioProps].codon).map(number => MAPS.keyboard[number])
        return {
        notes:{ name: codonMap[codonNumb], duration: MAPS[audioProps].codon.dur },
        codon:{ codon: codon }
        }
    }else{
      return {
        notes:{ name: '' },
        codon:{ codon: '' }
        }
    }
  }

  export function playAtIndex (index, item, name, value, twoBase, audioProps, mode) {
    // console.log(MAPS[audioProps][value].dur)
    const numb = MAPS.TWOBASE_MAP[twoBase]
    const numbMap = MAPS.makeIntervals(MAPS[audioProps][value]).map(number => MAPS.keyboard[number])
    if(mode === 'trl') {
      if(index >= item.start && index <= item.end && item[name] === value){
        return [{name: numbMap[numb], duration: MAPS[audioProps][value].dur}];
      }else{
        return [{name: ''}];
      }
    }else if(mode === 'tsc') {
      if(index <= item.end && index >= item.start && item[name] === value) {
        return [{name: numbMap[numb], duration: MAPS[audioProps][value].dur}];
      }else{
        return [{name: ''}];
      }
    }
  }




