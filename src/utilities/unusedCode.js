export const harmonic_minor = [2, 1, 2, 2, 1, 3, 1]
export const melodic_minor = [2, 1, 2, 2, 2, 2, 1]
export const major_pentatonic = [2, 2, 3, 2, 3]
export const minor_pentatonic = [3, 2, 2, 3, 2]
export const blues = [3, 2, 1, 1, 3, 2]
export const whole_notes = [2, 2, 2, 2, 2, 2]

// the modes examples starting on C
// "C3", "D3", "E3", "F#3/Gb3", "G3", "A4", "B4"
export const lydian = [2, 2, 2, 1, 2, 2, 1]
// emphasise the 4th (3th maj)
// "C3", "D3", "E3", "F3", "G3", "A4", "B4",
export const ionian = [2, 2, 1, 2, 2, 2, 1]
// emphasise the 1, 4, 5 (3th maj)
//  7th leading, 6th? 2nd?
// "C3", "D3", "E3", "F3", "G3", "A4", "Bb4"
export const mixolydian = [2, 2, 1, 2, 2, 1, 2]
// emphasise all, (3th maj) and flat7
// 7th not leading
// "C3", "D3", "Eb3", "F3", "G3", "A4", "Bb4"
export const dorian = [2, 1, 2, 2, 2, 1, 2]
// emphasise all
// "C3", "Db3", "Eb3", "F3", "G3", "Ab3", "Bb4"
export const phrygian = [1, 2, 2, 2, 1, 2, 2]
// emphasise the 2nd, 3minor plus...
// "C3", "Db3", "Eb3", "F3", "Gb3", "Ab3", "Bb4"
export const locrian = [1, 2, 2, 1, 2, 2, 2]
// avoid 2nd and 6th?


export const three_semitones = [3, 3, 3, 3]
// this is only scale that can accomodate 64 note mapping
export const semitone_chromatic = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

/*
https://regexr.com/
example bre tata AGAAAGAUUAAAAG
(?:[ag][agc]aaa[ag])(a{1,3})(?:ttaaa[at][ag])
*/

export function getMotif (seq, baseStart, baseFinish) {
  let motif = seq.substring(baseStart, baseFinish);
  return (motif);
}

export function GCratio (motif) {
  let GC = motif.match(/[GC]/g);
  if(GC === null) return 0;
  else return (GC.length/motif.length);
}

export function calcMotif_GC (motif) {
  let ratio = GCratio(motif);
  ratio = ratio.toFixed(2);
  //divide gc by lenght of get  //return number
  return [{motif: motif, ratio: ratio}];
}

  const SW1_PropStyle = {
    content: codonF1Notes[0]?.motif,
    props: {
      id: '',
      className: 'frame1',
      style: {
        backgroundColor: '#ebc844'
      }
    }
  }

