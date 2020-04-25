import React, { useRef } from 'react';

export function getCodonFNotes(mode, frame012, isSynthEnabled, index, gb_Item, codonNotes) {

  const codonF1Notes = [];
  const codonF2Notes = [];
  const codonF3Notes = [];

  const AA_Count1 = useRef(0)
  const AA_Count2 = useRef(0)
  const AA_Count3 = useRef(0)

  if(mode === 'trl') {
    if (index === gb_Item.start) {
      AA_Count1.current = 0
      AA_Count2.current = 0
      AA_Count3.current = 0
    }
    switch (frame012) {
    case 0:
      if (isSynthEnabled.current[frame012]) {
        codonF1Notes.push(codonNotes)
        AA_Count1.current++
      }
    break;
    case 1:
      if (isSynthEnabled.current[frame012]) {
        codonF2Notes.push(codonNotes)
        AA_Count2.current++
       }
      break;
    case 2:
      if (isSynthEnabled.current[frame012]) {
        codonF3Notes.push(codonNotes)
        AA_Count3.current++
        }
      break;
    default:
      console.log('error')
    break;
    }
  }

  return {
    notes:{ f1: codonF1Notes, f2: codonF2Notes, f3: codonF3Notes },
    AA_count:{ aa1: AA_Count1, aa2: AA_Count2, aa3: AA_Count3 }
  }
}

