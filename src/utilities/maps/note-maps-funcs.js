// tone will play upto octave 9 108 notes
// 0 = A1, 1 = Bb1, 2 = B1, 3 = C1 etc
export const keyboard = ['A1','Bb1','B1','C1','Db1','D1','Eb1','E1','F1','Gb1','G1','Ab1','A2','Bb2','B2','C2','Db2','D2','Eb2','E2','F2','Gb2','G2','Ab2','A3','Bb3','B3','C3','Db3','D3','Eb3','E3','F3','Gb3','G3','Ab3','A4','Bb4','B4','C4','Db4','D4','Eb4','E4','F4','Gb4','G4','Ab4','A5','Bb5','B5','C5','Db5','D5','Eb5','E5','F5','Gb5','G5','Ab5','A6','Bb6','B6','C6','Db6','D6','Eb6','E6','F6','Gb6','G6','Ab6','A7','Bb7','B7','C7','Db7','D7','Eb7','E7','F7','Gb7','G7','Ab7','A8','Bb8','B8','C8','Db8','D8','Eb8','E8','F8','Gb8','G8','Ab8','A9','Bb9','B9','C9','Db9','D9','Eb9','E9','F9','Gb9','G9','Ab9']

// 9 octaves to match 9*12 keyboard
// '1' = A1, '2' = A2, '3' = A3
export const octaves = {
  1: 0,
  2: 12,
  3: 24,
  4: 36,
  5: 48,
  6: 60,
  7: 72,
  8: 84,
  9: 96
}

// use indexOf() to get numerical value of musical key
export const musicalKey = ['A','Bb','B','C','Db','D','Eb','E','F','Gb','G','Ab']

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


// build numerical interval array rather that static note array
function makeIntervals(arr) {
  const a = octaves[arr.oct]
  const b = musicalKey.indexOf(arr.key)
  const intervals = [a + b]
  for (let index = 0; index < arr.range - 1; index++) {
    const prev = intervals[intervals.length - 1]
    intervals.push(prev + arr.scale[index % arr.scale.length])
  }
  return intervals
}

const nt20_Map = 20 // include passing notes
const nt64_Map = 64 // chromatic

// trl aeolian
// tsc phrigian
// base at index/playhead 0 1 2 3

const nt16_Map = 16 // emphasise the mode
const mytwobase = [15] //U
const whatOctaves = [12, 12, 12, 12]


// collect in arrays...
// scale intervals all bases on
// "C3", "D3", "Eb3", "F3", "G3", "Ab3", "Bb4"
export const aeolian = [2, 1, 2, 2, 1, 2, 2]
// emphasise the 3rd, 6th 7th

const Audio_translate = {
  base:{
    oct: 1,
    scale: [12],//roots at octaves
    range: 4,
    key: 'C',
    duration: '16n'
  },
  repeatBases:{
    oct: 3,
    scale: [3,9],// root and 3rd
    range: 8,
    key: 'C',
    duration: '4n'
  },
  twoBase:{
    oct: 3,
    scale: [5, 2, 3, 2],// 1st 4th 5th 7th
    range: 16,
    key: 'C',
    duration: '8n'
  },
  codon:{
    oct: 2,
    scale: [3, 5, 2, 2],// 1st, 3rd, 6th, and 7th?
    range: 20,
    key: 'C',
    duration: '2n'
  },
}

// do this once and access on each render cycle - don't remake
const baseMap = makeIntervals(Audio_translate.base).map(number => keyboard[number])
console.log('baseMap = ', baseMap)
const myBase01 = 3 //U
const noteArray01 = [{name: baseMap[myBase01], duration: Audio_translate.base.duration}]
console.log('noteArray01 = ',noteArray01)

const repeatBasesMap = makeIntervals(Audio_translate.repeatBases).map(number => keyboard[number])
console.log('repeatBasesMap = ', repeatBasesMap)
const myBase02 = 7 //U
const noteArray02 = [{name: repeatBasesMap[myBase02], duration: Audio_translate.repeatBases.duration}]
console.log('noteArray02 = ',noteArray02)

const twoBaseMap = makeIntervals(Audio_translate.twoBase).map(number => keyboard[number])
console.log('twoBaseMap = ', twoBaseMap)
const myBase03 = 15 //U
const noteArray03 = [{name: twoBaseMap[myBase03], duration: Audio_translate.twoBase.duration}]
console.log('noteArray03 = ',noteArray03)

const codonMap = makeIntervals(Audio_translate.codon).map(number => keyboard[number])
console.log('codonMap = ', codonMap)
const myBase04 = 19 //U
const noteArray04 = [{name: codonMap[myBase03], duration: Audio_translate.codon.duration}]
console.log('noteArray04 = ',noteArray04)



