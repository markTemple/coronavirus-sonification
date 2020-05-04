import React, { useRef } from 'react';
import { getAA, incrementAA, setAA } from '../../state/amino-acid-count';
import { useSelector, useDispatch } from '../../state/store'

export function getAA_Data(mode, frame012, isSynthEnabled, index, gb_Item, codonNotes, playstop) {

  const codonF1Notes = [];
  const codonF2Notes = [];
  const codonF3Notes = [];

  const codonF1Motifs = [];
  const codonF2Motifs = [];
  const codonF3Motifs = [];

  const dispatch = useDispatch()
  const AA_Count = useSelector(getAA)

  const AA_Count1 = AA_Count[0]
  const AA_Count2 = AA_Count[1]
  const AA_Count3 = AA_Count[2]

  if(mode === 'trl') {
    if (index === gb_Item.start) {
      if (AA_Count1) dispatch(setAA(0, 0))
      if (AA_Count2) dispatch(setAA(1, 0))
      if (AA_Count3) dispatch(setAA(2, 0))
    }
    switch (frame012) {
    case 1:
      if ( (isSynthEnabled[frame012] === true) || (playstop === true)) {
        codonF1Notes.push(codonNotes.notes)
        codonF1Motifs.push(codonNotes.motif)
        // if (playstop !== true) dispatch(incrementAA(0))
      }
    break;
    case 2:
      if ( (isSynthEnabled[frame012] === true) || (playstop === true)) {
        codonF2Notes.push(codonNotes.notes)
        codonF2Motifs.push(codonNotes.motif)
        // if (playstop !== true) dispatch(incrementAA(1))
       }
      break;
    case 0:
      if ( (isSynthEnabled[frame012] === true) || (playstop === true)) {
        codonF3Notes.push(codonNotes.notes)
        codonF3Motifs.push(codonNotes.motif)
        // if (playstop !== true) dispatch(incrementAA(2))
        }
      break;
    default:
      console.log('error')
    break;
    }
  }

  return {
    notes:{ f1: codonF1Notes, f2: codonF2Notes, f3: codonF3Notes },
    motifs:{ f1: codonF1Motifs, f2: codonF2Motifs, f3: codonF3Motifs },
    AA_count:{ aa1: AA_Count1, aa2: AA_Count2, aa3: AA_Count3 },
  }
}

