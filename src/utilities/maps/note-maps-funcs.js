export const keyboard = [
  'A1','Bb1','B1','C1','Db1','D1','Eb1','E1','F1','F#1','G1','Ab1',
  'A2','Bb2','B2','C2','Db2','D2','Eb2','E2','F2','F#2','G2','Ab2',
  'A3','Bb3','B3','C3','Db3','D3','Eb3','E3','F3','F#3','G3','Ab3',
  'A4','Bb4','B4','C4','Db4','D4','Eb4','E4','F4','F#4','G4','Ab4',
  'A5','Bb5','B5','C5','Db5','D5','Eb5','E5','F5','F#5','G5','Ab5',
  'A6','Bb6','B6','C6','Db6','D6','Eb6','E6','F6','F#6','G6','Ab6',
  'A7','Bb7','B7','C7','Db7','D7','Eb7','E7','F7','F#7','G7','Ab7',
  'A8','Bb8','B8','C8','Db8','D8','Eb8','E8','F8','F#8','G8','Ab8',
  'A9','Bb9','B9','C9','Db9','D9','Eb9','E9','F9','F#9','G9','Ab9']

// 9 octaves to match 9*12 keyboard
// '1' = A1, '2' = A2, '3' = A3
export const octaves = {
  1: 0, 2: 12, 3: 24, 4: 36, 5: 48, 6: 60, 7: 72, 8: 84, 9: 96
}

// use indexOf() to get numerical value of musical key
export const musicalKey = [
  'A','Bb','B','C','Db','D','Eb','E','F','Gb','G','Ab'
]

// build numerical interval array rather that static note array
export function makeIntervals(arr) {
  const a = octaves[arr.oct]
  const b = musicalKey.indexOf(arr.key)
  const intervals = [a + b]
  for (let index = 0; index < arr.range - 1; index++) {
    const prev = intervals[intervals.length - 1]
    intervals.push(prev + arr.scale[index % arr.scale.length])
  }
  return intervals
}

// trl aeolian
//              C3 D3 Eb3 F3G3 Ab3 Bb4 C4
const aeolian = [0, 2, 1, 2, 2, 1, 2, 2]
// emphasise the 3rd, 6th 7th

export const trlProps = {
  base:{
    oct: 2,
    scale: [3, 9, 3, 9],//roots and 3rd
    range: 4,
    key: 'Bb',
    dur: '2m',
  },
  repeatBases:{
    oct: 4,
    scale: [3, 9],// root and 3rd
    range: 8,
    key: 'Bb',
    dur: '2m',
  },
  twoBase:{
    oct: 1,
    scale: [5, 2, 1, 4],// 1st 4th 5th 7th
    range: 16,
    key: 'Bb',
    dur: '2m',
  },
  codon:{
    oct: 2,
    scale: [3, 2, 2, 3, 2],// 1st, 2rd, 3rd, 4th, 6th, and 7th?
    range: 21,
    key: 'Bb',
    dur: '2m',
  },
  GCnote:{
    oct: 3,
    scale: [3, 5, 2, 2],// 1st, 3rd, 6th, and 7th?
    range: 10,
    key: 'Bb',
    dur: '8m',
  },
  GCnote100:{
    oct: 2,
    scale: [3, 5, 2, 2],// 1st, 3rd, 6th, and 7th?
    range: 10,
    key: 'Bb',
    dur: '8m',
  },
  trsNote:{
    oct: 5,
    scale: [2, 3, 2, 1, 4, -4, -1, -2, -3,-2],// 1st, 3rd, #4 and 5th?
    range: 20,
    key: 'Bb',
    dur: '2m',// too short gives click/spike in audio
  },
  nsp:{
    oct: 4,
    scale: [8, 2, 2],
    range: 8,
    key: 'Bb',// force to 3rd in C
    dur: '2m',
  },
  SL:{
    oct: 5,
    scale: [2, -2, 8, -8, 10, -10, 12, -12],// 1, 3, 5, 7.
    range: 16,
    key: 'Bb',
    dur: '2m',
  },
  UTR:{
    oct: 5,
    scale: [0, 2, 0, -2, 3, 0, -3],
    range: 16,
    key: 'Bb',
    dur: '2m',
  },
}

// tsc     R  2  3  4  5  6  7  R
//         A  B  C# D# E  F# G# A
//  lydian = [2, 2, 2, 1, 2, 2, 1]
export const tscProps = {
  base:{
    oct: 2,
    scale: [7, 5, 7, 5],
    range: 4,
    key: 'C',
    dur: '2m',
  },
  repeatBases:{
    oct: 5,
    scale: [6, 1, 5],
    range: 8,
    key: 'C',
    dur: '2m',
  },
  twoBase:{
    oct: 1,
    scale: [4, 3, 5],
    range: 16,
    key: 'C',
    dur: '2m',
  },
  codonEnds:{
    oct: 3,
    scale: [4, 2, 1, 4, 1],
    range: 16,
    key: 'C',
    dur: '2m',
  },
  codon:{
    oct: 2,
    scale: [2, 2, 2, 6, 2, 2, 2, 6, 2, 2, 2, 6, 2, 2, 2, 6, -6, -2, -2, -2, -6, -2, -2, -2, -6, -2, -2, -2, ], // chromatic
    range: 64,
    key: 'C',
    dur: '2m',
  },
  GCnote:{
    oct: 4,
    scale: [0, 4, 3, 4, 1],//
    range: 10,
    key: 'C',
    dur: '2m',
  },
  GCnote100:{
    oct: 2,
    scale: [0, 4, 3, 4, 1],//
    range: 10,
    key: 'C',
    dur: '2m',
  },
  trsNote:{
    oct: 6,
    scale: [2, 2, 2, 1, 2, 2, 1, -1, -2, -2, -1, -2, -2, -2],
    range: 18,
    key: 'C',
    dur: '2m',
  },
  nsp:{
    oct: 6,
    scale: [2, 2, 2, -2, -2, -2],
    range: 8,
    key: 'C',
    dur: '2m',
  },
  SL:{
    oct: 5,
    scale: [6, 1, 4, 1, -1, -4, -1, -6, 0],// 1, 3, 5, 7.
    range: 16,
    key: 'C',
    dur: '2m',
  },
  UTR:{
    oct: 3,
    scale: [6, 3, 2, 1, -1, -2, -3, -6],
    range: 16,
    key: 'C',
    dur: '2m',
  },
}
// do this once and access on each render cycle - don't remake???




