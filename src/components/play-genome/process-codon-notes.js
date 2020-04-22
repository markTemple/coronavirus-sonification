import React, { useRef } from 'react';

export function getCodonFNotes(mode, frame012, isSynthEnabled, index, gb_Item, codonNotes, codonNotes_2) {

  const codonF1Notes = [];
  const codonF2Notes = [];
  const codonF3Notes = [];

  const AA_Count1 = useRef(0)
  const AA_Count2 = useRef(0)
  const AA_Count3 = useRef(0)

  if(mode === 'trl') {
    if (frame012 === 0) {
      if (isSynthEnabled.current[frame012]) {
        codonF1Notes.push(codonNotes)
        if (index === gb_Item.start) AA_Count1.current = 0
        AA_Count1.current++
      }
    }

    if (frame012 === 1) {
      if (isSynthEnabled.current[frame012]) {
        codonF2Notes.push(codonNotes)
        if (index === gb_Item.start) AA_Count2.current = 0
        AA_Count2.current++
      }
    }

    if (frame012 === 2) {
      if (isSynthEnabled.current[frame012]) {
        codonF3Notes.push(codonNotes)
        if (index === gb_Item.start) AA_Count3.current = 0
        AA_Count3.current++
      }
    }
  }else if(mode === 'tsc') {
    codonF2Notes.push(codonNotes_2)
  }

  return {
    notes:{ f1: codonF1Notes, f2: codonF2Notes, f3: codonF3Notes },
    AA_count:{ aa1: AA_Count1, aa2: AA_Count2, aa3: AA_Count3 }
  }
}

