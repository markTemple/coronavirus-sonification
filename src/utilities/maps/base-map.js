export const ONE23 = ['1', '2', '3']

export const COMPLEMENUARY_MAP = {
  G:'C',
  A:'U',
  U:'A',
  C:'G',
}

// C natural minor translation
//C, D, Eb, F, G, Ab, Bb
// root
export const BASE_MAP = {
  A: 'C2',
  U: 'C3',
  G: 'C4',
  C: 'C5',
}
// A Phrygian transcription
// A Bb C D E F G
// root
export const BASE_MAP_2 = {
  A: 'A2',
  U: 'A3',
  G: 'A4',
  C: 'A5',
}

export const BASE_MAP_micro = {
  A: 880.00,
  U: 905.79,
  G: 932.33,
  C: 959.65,
}

export const TRS_MAP = {
  A: 'C4',
  U: 'G4',
  G: 'C6',
  C: 'Ab6',
}

// A Phrygian transcription
// A Bb C D E F G
export const TRS_MAP_2 = {
  A: 'AB4',
  U: 'Eb4',
  G: 'Ab6',
  C: 'Bb4',
}

// play in transcription only
// 3rd 4th 5th 6th
export const TRS_MAP_micro = {
  A: 1046.50,
  U: 1077.17,
  G: 1108.73,
  C: 1141.22,
}

//C, D, Eb, F, G, Ab, Bb
// 1st 4th 5th 7th
// AU low GC high pitch
export const TWOBASE_MAP = {
  AA: 'C1',
  UU: 'F1',
  AU: 'G1',
  UA: 'Bb1',
  UG: 'C2',
  CA: 'F2',
  CU: 'G2',
  AG: 'Bb2',
  UC: 'C3',
  GA: 'F3',
  GU: 'G3',
  AC: 'Bb3',
  CG: 'C4',
  GC: 'F4',
  CC: 'G4',
  GG: 'Bb4',
}
// A Phrygian transcription
// A Bb C D E F G
// 1st 4th 5th 7th
export const TWOBASE_MAP_2 = {
  AA: 'A1',
  UU: 'D1',
  AU: 'E1',
  UA: 'G1',
  UG: 'A2',
  CA: 'D2',
  CU: 'E2',
  AG: 'G2',
  UC: 'A3',
  GA: 'D3',
  GU: 'E3',
  AC: 'G3',
  CG: 'A4',
  GC: 'D4',
  CC: 'E4',
  GG: 'G4',
}


/*
https://regexr.com/
example bre tata AGAAAGAUUAAAAG
(?:[ag][agc]aaa[ag])(a{1,3})(?:ttaaa[at][ag])
*/
// C natural minor translation
// Don't sonify during transcription
//C, D, Eb, F, G, Ab, Bb
// whole scale or 1st, 3rd, 6th, and 7th?
// C, Eb, Ab, Bb
export const CODON_MAP = {
  AUA: {AA: 'Ile', Note: 'C1'},
  AUU: {AA: 'Ile', Note: 'C1'},
  AUC: {AA: 'Ile', Note: 'C1'},
  AAU: {AA: 'Asn', Note: 'Eb1'},
  AAC: {AA: 'Asn', Note: 'Eb1'},
  UAU: {AA: 'Tyr', Note: 'Ab2'},
  UAC: {AA: 'Tyr', Note: 'Ab2'},
  AAA: {AA: 'Lys', Note: 'Bb2'},
  AAG: {AA: 'Lys', Note: 'Bb2'},
  UUU: {AA: 'Phe', Note: 'C2'},
  UUC: {AA: 'Phe', Note: 'C2'},
  UAA: {AA: 'ST*', Note: 'Eb2'},
  UAG: {AA: 'ST*', Note: 'Eb2'},
  UGA: {AA: 'ST*', Note: 'Eb2'},
  AUG: {AA: 'Mt*', Note: 'Ab3'},
  UUA: {AA: 'Leu', Note: 'Bb3'},
  CUA: {AA: 'Leu', Note: 'Bb3'},
  CUU: {AA: 'Leu', Note: 'Bb3'},
  UUG: {AA: 'Leu', Note: 'Bb3'},
  CUC: {AA: 'Leu', Note: 'Bb3'},
  CUG: {AA: 'Leu', Note: 'Bb3'},
  ACA: {AA: 'Thr', Note: 'C3'},
  ACU: {AA: 'Thr', Note: 'C3'},
  ACC: {AA: 'Thr', Note: 'C3'},
  ACG: {AA: 'Thr', Note: 'C3'},
  GUA: {AA: 'Val', Note: 'Eb3'},
  GUU: {AA: 'Val', Note: 'Eb3'},
  GUC: {AA: 'Val', Note: 'Eb3'},
  GUG: {AA: 'Val', Note: 'Eb3'},
  GAU: {AA: 'Asp', Note: 'Ab4'},
  GAC: {AA: 'Asp', Note: 'Ab4'},
  UGU: {AA: 'Cys', Note: 'Bb4'},
  UGC: {AA: 'Cys', Note: 'Bb4'},
  CAA: {AA: 'Gln', Note: 'C4'},
  CAG: {AA: 'Gln', Note: 'C4'},
  GAA: {AA: 'Glu', Note: 'Eb4'},
  GAG: {AA: 'Glu', Note: 'Eb4'},
  CAU: {AA: 'His', Note: 'Ab5'},
  CAC: {AA: 'His', Note: 'Ab5'},
  AGU: {AA: 'Ser', Note: 'Bb5'},
  UCA: {AA: 'Ser', Note: 'Bb5'},
  UCU: {AA: 'Ser', Note: 'Bb5'},
  AGC: {AA: 'Ser', Note: 'Bb5'},
  UCC: {AA: 'Ser', Note: 'Bb5'},
  UCG: {AA: 'Ser', Note: 'Bb5'},
  UGG: {AA: 'Trp', Note: 'C5'},
  AGA: {AA: 'Arg', Note: 'Eb5'},
  AGG: {AA: 'Arg', Note: 'Eb5'},
  CGA: {AA: 'Arg', Note: 'Eb5'},
  CGU: {AA: 'Arg', Note: 'Eb5'},
  CGC: {AA: 'Arg', Note: 'Eb5'},
  CGG: {AA: 'Arg', Note: 'Eb5'},
  CCA: {AA: 'Pro', Note: 'Ab6'},
  CCU: {AA: 'Pro', Note: 'Ab6'},
  CCC: {AA: 'Pro', Note: 'Ab6'},
  CCG: {AA: 'Pro', Note: 'Ab6'},
  GCA: {AA: 'Ala', Note: 'Bb6'},
  GCU: {AA: 'Ala', Note: 'Bb6'},
  GCC: {AA: 'Ala', Note: 'Bb6'},
  GCG: {AA: 'Ala', Note: 'Bb6'},
  GGA: {AA: 'Gly', Note: 'C6'},
  GGU: {AA: 'Gly', Note: 'C6'},
  GGC: {AA: 'Gly', Note: 'C6'},
  GGG: {AA: 'Gly', Note: 'C6'},
}

// chromatic? 64 note range
// Microtonal
export const CODON_MAP_2 = {
  AUA: {AA: null, Note: 'D5'},
  AUU: {AA: null, Note: 'D5'},
  AAU: {AA: null, Note: 'EB4'},
  UAU: {AA: null, Note: 'F3'},
  AAA: {AA: null, Note: 'F5'},
  UUU: {AA: null, Note: 'Ab5'},
  UAA: {AA: null, Note: 'D3'},
  UUA: {AA: null, Note: 'Eb5'},
  AUC: {AA: null, Note: 'D5'},
  AAC: {AA: null, Note: 'EB4'},
  UAC: {AA: null, Note: 'F3'},
  AAG: {AA: null, Note: 'F5'},
  UUC: {AA: null, Note: 'Ab5'},
  UAG: {AA: null, Note: 'D3'},
  UGA: {AA: null, Note: 'D3'},
  AUG: {AA: null, Note: 'G5'},
  CUA: {AA: null, Note: 'Eb5'},
  CUU: {AA: null, Note: 'Eb5'},
  UUG: {AA: null, Note: 'Eb5'},
  ACA: {AA: null, Note: 'Eb3'},
  ACU: {AA: null, Note: 'Eb3'},
  GUA: {AA: null, Note: 'G3'},
  GUU: {AA: null, Note: 'G3'},
  GAU: {AA: null, Note: 'F4'},
  UGU: {AA: null, Note: 'G4'},
  CAA: {AA: null, Note: 'Ab4'},
  GAA: {AA: null, Note: 'Bb4'},
  CAU: {AA: null, Note: 'C5'},
  AGU: {AA: null, Note: 'C3'},
  UCA: {AA: null, Note: 'C3'},
  UCU: {AA: null, Note: 'C3'},
  AGA: {AA: null, Note: 'D4'},
  CUC: {AA: null, Note: 'Eb5'},
  CUG: {AA: null, Note: 'Eb5'},
  ACC: {AA: null, Note: 'Eb3'},
  ACG: {AA: null, Note: 'Eb3'},
  GUC: {AA: null, Note: 'G3'},
  GUG: {AA: null, Note: 'G3'},
  GAC: {AA: null, Note: 'F4'},
  UGC: {AA: null, Note: 'G4'},
  CAG: {AA: null, Note: 'Ab4'},
  GAG: {AA: null, Note: 'Bb4'},
  CAC: {AA: null, Note: 'C5'},
  AGC: {AA: null, Note: 'C3'},
  UCC: {AA: null, Note: 'C3'},
  UCG: {AA: null, Note: 'C3'},
  UGG: {AA: null, Note: 'F3'},
  AGG: {AA: null, Note: 'D4'},
  CGA: {AA: null, Note: 'D4'},
  CGU: {AA: null, Note: 'D4'},
  CCA: {AA: null, Note: 'Bb5'},
  CCU: {AA: null, Note: 'Bb5'},
  GCA: {AA: null, Note: 'C4'},
  GCU: {AA: null, Note: 'C4'},
  GGA: {AA: null, Note: 'C5'},
  GGU: {AA: null, Note: 'C5'},
  CGC: {AA: null, Note: 'D4'},
  CGG: {AA: null, Note: 'D4'},
  CCC: {AA: null, Note: 'Bb5'},
  CCG: {AA: null, Note: 'Bb5'},
  GCC: {AA: null, Note: 'C4'},
  GCG: {AA: null, Note: 'C4'},
  GGC: {AA: null, Note: 'C5'},
  GGG: {AA: null, Note: 'C5'},
}

export const CODON_MAP_micro = {
AUA: {AA: null, Note: 110.00},
AUU: {AA: null, Note: 113.22},
AAU: {AA: null, Note: 116.54},
UAU: {AA: null, Note: 119.96},
AAA: {AA: null, Note: 123.47},
UUU: {AA: null, Note: 127.09},
UAA: {AA: null, Note: 130.81},
UUA: {AA: null, Note: 134.65},
AUC: {AA: null, Note: 138.59},
AAC: {AA: null, Note: 142.65},
UAC: {AA: null, Note: 146.83},
AAG: {AA: null, Note: 151.13},
UUC: {AA: null, Note: 155.56},
UAG: {AA: null, Note: 160.12},
UGA: {AA: null, Note: 164.81},
AUG: {AA: null, Note: 169.64},
CUA: {AA: null, Note: 174.61},
CUU: {AA: null, Note: 179.73},
UUG: {AA: null, Note: 185.00},
ACA: {AA: null, Note: 190.42},
ACU: {AA: null, Note: 196.00},
GUA: {AA: null, Note: 201.74},
GUU: {AA: null, Note: 207.65},
GAU: {AA: null, Note: 213.74},
UGU: {AA: null, Note: 220.00},
CAA: {AA: null, Note: 226.45},
GAA: {AA: null, Note: 233.08},
CAU: {AA: null, Note: 239.91},
AGU: {AA: null, Note: 246.94},
UCA: {AA: null, Note: 254.18},
UCU: {AA: null, Note: 261.63},
AGA: {AA: null, Note: 269.29},
CUC: {AA: null, Note: 277.18},
CUG: {AA: null, Note: 285.30},
ACC: {AA: null, Note: 293.66},
ACG: {AA: null, Note: 302.27},
GUC: {AA: null, Note: 311.13},
GUG: {AA: null, Note: 320.24},
GAC: {AA: null, Note: 329.63},
UGC: {AA: null, Note: 339.29},
CAG: {AA: null, Note: 349.23},
GAG: {AA: null, Note: 359.46},
CAC: {AA: null, Note: 369.99},
AGC: {AA: null, Note: 380.84},
UCC: {AA: null, Note: 392.00},
UCG: {AA: null, Note: 403.48},
UGG: {AA: null, Note: 415.30},
AGG: {AA: null, Note: 427.47},
CGA: {AA: null, Note: 440.00},
CGU: {AA: null, Note: 452.89},
CCA: {AA: null, Note: 466.16},
CCU: {AA: null, Note: 479.82},
GCA: {AA: null, Note: 493.88},
GCU: {AA: null, Note: 508.36},
GGA: {AA: null, Note: 523.25},
GGU: {AA: null, Note: 538.58},
CGC: {AA: null, Note: 554.37},
CGG: {AA: null, Note: 570.61},
CCC: {AA: null, Note: 587.33},
CCG: {AA: null, Note: 604.54},
GCC: {AA: null, Note: 622.25},
GCG: {AA: null, Note: 640.49},
GGC: {AA: null, Note: 659.26},
GGG: {AA: null, Note: 678.57},
}
