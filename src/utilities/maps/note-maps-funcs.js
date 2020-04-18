export const keyboard = [
  'A1','Bb1','B1','C1','Db1','D1','Eb1','E1','F1','Gb1','G1','Ab1',
  'A2','Bb2','B2','C2','Db2','D2','Eb2','E2','F2','Gb2','G2','Ab2',
  'A3','Bb3','B3','C3','Db3','D3','Eb3','E3','F3','Gb3','G3','Ab3',
  'A4','Bb4','B4','C4','Db4','D4','Eb4','E4','F4','Gb4','G4','Ab4',
  'A5','Bb5','B5','C5','Db5','D5','Eb5','E5','F5','Gb5','G5','Ab5',
  'A6','Bb6','B6','C6','Db6','D6','Eb6','E6','F6','Gb6','G6','Ab6',
  'A7','Bb7','B7','C7','Db7','D7','Eb7','E7','F7','Gb7','G7','Ab7',
  'A8','Bb8','B8','C8','Db8','D8','Eb8','E8','F8','Gb8','G8','Ab8',
  'A9','Bb9','B9','C9','Db9','D9','Eb9','E9','F9','Gb9','G9','Ab9']

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
// "C3", "D3", "Eb3", "F3", "G3", "Ab3", "Bb4"
const aeolian = [2, 1, 2, 2, 1, 2, 2]
// emphasise the 3rd, 6th 7th

export const trlProps = {
  base:{
    oct: 2,
    scale: [12],//roots at octaves
    range: 4,
    key: 'C',
    dur: '32n',
  },
  repeatBases:{
    oct: 6,
    scale: [3,9],// root and 3rd
    range: 8,
    key: 'C',
    dur: '8n',
  },
  twoBase:{
    oct: 1,
    scale: [5, 2, 3, 2],// 1st 4th 5th 7th
    range: 16,
    key: 'C',
    dur: '16n',
  },
  codon:{
    oct: 1,
    scale: [2, 6, 2, 2],// 1st, 2rd, 6th, and 7th?
    range: 21,
    key: 'C',
    dur: '4n',
  },
  GCnote:{
    oct: 2,
    scale: [3, 5, 2, 2],// 1st, 3rd, 6th, and 7th?
    range: 10,
    key: 'C',
    dur: '1m',
  },
  trs:{
    oct: 5,
    scale: [3, 3, 1, 5],// 1st, 3rd, #4 and 5th?
    range: 8,
    key: 'C',
    dur: '32n',
  },
  nsp:{
    oct: 2,
    scale: [0, 3, 0, 4, -2, -2, -3],// 1st, 1st, 3rd, 3rd, 5th, 4th
    range: 8,
    key: 'C',
    dur: '2n',
  },
}

// tsc phrigian          2  3  4  5  6  7  root
export const phrygian = [1, 2, 2, 2, 1, 2, 2]

export const tscProps = {
  base:{
    oct: 2,
    scale: [12],//roots at octaves
    range: 4,
    key: 'A',
    dur: '16n',
  },
  repeatBases:{
    oct: 2,
    scale: [1,11],// 1st and b2
    range: 8,
    key: 'A',
    dur: '4n',
  },
  twoBase:{
    oct: 2,
    scale: [5, 2, 3, 3],// 1st 4th 5th 7th
    range: 16,
    key: 'A',
    dur: '8n',
  },
  codon:{
    oct: 1,
    // scale: [1, 7, 2, 2],// 1st, 2rd, 6th, and 7th?
    scale: [1],//chromatic
    range: 21,
    key: 'A',
    dur: '2n',
  },
  GCnote:{
    oct: 3,
    scale: [1, 2, 7, 2],// 1st, 2nd, 3rd, and 7th?
    range: 10,
    key: 'A',
    dur: '1m',
  },
  trs:{
    oct: 5,
    scale: [3, 3, 1, 5],// 1st, 3rd, #4 and 5th?
    range: 8,
    key: 'A',
    dur: '16n',
  },
  nsp:{
    oct: 4,
    scale: [0, 1, 0, 4, -1, -2, -2],//
    range: 8,
    key: 'A',
    dur: '2n',
  },
}
// do this once and access on each render cycle - don't remake


// const twoBaseMap = makeIntervals(trlProps.twoBase).map(number => keyboard[number])
// const myBase03 = 15
// const noteArray03 = [{name: twoBaseMap[myBase03], duration: trlProps.twoBase.dur}]

// const codonMap = makeIntervals(trlProps.codon).map(number => keyboard[number])
// const myBase04 = 19
// const noteArray04 = [{name: codonMap[myBase04], duration: trlProps.codon.dur}]

// const GCnoteMap = makeIntervals(trlProps.GCnote).map(number => keyboard[number])
// const myBase05 = 9
// const noteArray05 = [{name: GCnoteMap[myBase05], duration: trlProps.GCnote.dur}]

// const trsMAP = makeIntervals(trlProps.trs).map(number => keyboard[number])
// const myBase06 = 2
// const noteArray06 = [{name: trsMAP[myBase06], duration: trlProps.trs.dur}]

// const nspMap = makeIntervals(trlProps.nsp).map(number => keyboard[number])
// const myBase07 = 3
// const noteArray07 = [{name: GCnoteMap[myBase07], duration: trlProps.nsp.dur}]



