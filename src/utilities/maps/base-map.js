export const ONE23 = ['1', '2', '3']

export const COMPLEMENUARY_MAP = {
  G:'C',
  A:'U',
  U:'A',
  C:'G'
}

export const ANTICODON_MAP = {
  G:'C',
  A:'U',
  U:'A',
  C:'G'
}
// C natural minor translation
//C, D, Eb, F, G, Ab, Bb
// root
export const BASE_MAP = {
  G: 'C2',
  A: 'C3',
  U: 'C4',
  C: 'C5'
}
// A Phrygian transcription
// A Bb C D E F G
// root
export const BASE_MAP_2 = {
  G: 'A2',
  A: 'A3',
  U: 'A4',
  C: 'A5'
}

// play in transcription only
// 3rd 4th 5th 6th
export const TRS_MAP = {
  G: 'C5',
  A: 'D5',
  U: 'E5',
  C: 'F5'
}
// C natural minor translation
//C, D, Eb, F, G, Ab, Bb
// 1st 4th 5th 7th
export const TWOBASE_MAP = {
  UG: 'C1',
  UA: 'F1',
  UU: 'G1',
  UC: 'Bb1',
  CG: 'C2',
  CA: 'F2',
  CU: 'G2',
  CC: 'Bb2',
  GG: 'C3',
  GA: 'F3',
  GU: 'G3',
  GC: 'Bb3',
  AG: 'C4',
  AA: 'F4',
  AU: 'G4',
  AC: 'Bb4'
}
// A Phrygian transcription
// A Bb C D E F G
// 1st 4th 5th 7th
export const TWOBASE_MAP_2 = {
  UG: 'A1',
  UA: 'D1',
  UU: 'E1',
  UC: 'G1',
  CG: 'A2',
  CA: 'D2',
  CU: 'E2',
  CC: 'G2',
  GG: 'A3',
  GA: 'D3',
  GU: 'E3',
  GC: 'G3',
  AG: 'A4',
  AA: 'D4',
  AU: 'E4',
  AC: 'G4'
}

/*
https://regexr.com/
example bre tata AGAAAGAUUAAAAG
(?:[ag][agc]aaa[ag])(a{1,3})(?:ttaaa[at][ag])
*/
// C natural minor translation
// Don't sonify during transcription
//C, D, Eb, F, G, Ab, Bb
// whole scale
export const CODON_MAP = {
GCA:{AA:'Ala',Note:'C4'},
GCC:{AA:'Ala',Note:'C4'},
GCG:{AA:'Ala',Note:'C4'},
GCU:{AA:'Ala',Note:'C4'},
AGA:{AA:'Arg',Note:'D4'},
AGG:{AA:'Arg',Note:'D4'},
CGA:{AA:'Arg',Note:'D4'},
CGC:{AA:'Arg',Note:'D4'},
CGG:{AA:'Arg',Note:'D4'},
CGU:{AA:'Arg',Note:'D4'},
AAC:{AA:'Asn',Note:'EB4'},
AAU:{AA:'Asn',Note:'EB4'},
GAC:{AA:'Asp',Note:'F4'},
GAU:{AA:'Asp',Note:'F4'},
UGC:{AA:'Cys',Note:'G4'},
UGU:{AA:'Cys',Note:'G4'},
CAA:{AA:'Gln',Note:'Ab4'},
CAG:{AA:'Gln',Note:'Ab4'},
GAA:{AA:'Glu',Note:'Bb4'},
GAG:{AA:'Glu',Note:'Bb4'},
GGA:{AA:'Gly',Note:'C5'},
GGC:{AA:'Gly',Note:'C5'},
GGG:{AA:'Gly',Note:'C5'},
GGU:{AA:'Gly',Note:'C5'},
CAC:{AA:'His',Note:'C5'},
CAU:{AA:'His',Note:'C5'},
AUA:{AA:'Ile',Note:'D5'},
AUC:{AA:'Ile',Note:'D5'},
AUU:{AA:'Ile',Note:'D5'},
CUA:{AA:'Leu',Note:'Eb5'},
CUC:{AA:'Leu',Note:'Eb5'},
CUG:{AA:'Leu',Note:'Eb5'},
CUU:{AA:'Leu',Note:'Eb5'},
UUA:{AA:'Leu',Note:'Eb5'},
UUG:{AA:'Leu',Note:'Eb5'},
AAA:{AA:'Lys',Note:'F5'},
AAG:{AA:'Lys',Note:'F5'},
AUG:{AA:'Mt*',Note:'G5'},
UUC:{AA:'Phe',Note:'Ab5'},
UUU:{AA:'Phe',Note:'Ab5'},
CCA:{AA:'Pro',Note:'Bb5'},
CCC:{AA:'Pro',Note:'Bb5'},
CCG:{AA:'Pro',Note:'Bb5'},
CCU:{AA:'Pro',Note:'Bb5'},
AGC:{AA:'Ser',Note:'C3'},
AGU:{AA:'Ser',Note:'C3'},
UCA:{AA:'Ser',Note:'C3'},
UCC:{AA:'Ser',Note:'C3'},
UCG:{AA:'Ser',Note:'C3'},
UCU:{AA:'Ser',Note:'C3'},
UAA:{AA:'ST*',Note:'D3'},
UAG:{AA:'ST*',Note:'D3'},
UGA:{AA:'ST*',Note:'D3'},
ACA:{AA:'Thr',Note:'Eb3'},
ACC:{AA:'Thr',Note:'Eb3'},
ACG:{AA:'Thr',Note:'Eb3'},
ACU:{AA:'Thr',Note:'Eb3'},
UGG:{AA:'Trp',Note:'F3'},
UAC:{AA:'Tyr',Note:'F3'},
UAU:{AA:'Tyr',Note:'F3'},
GUA:{AA:'Val',Note:'G3'},
GUC:{AA:'Val',Note:'G3'},
GUG:{AA:'Val',Note:'G3'},
GUU:{AA:'Val',Note:'G3'}
}

