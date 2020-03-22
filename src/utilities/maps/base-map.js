export const ONE23 = ['1', '2', '3']

export const COMPLEMENTARY_MAP = {
  G:'C',
  A:'T',
  T:'A',
  C:'G'
}

export const BASE_MAP = {
  G: 'C1',
  A: 'E1',
  T: 'G1',
  C: 'B2'
}

export const TWOBASE_MAP = {
  GG: 'C1',
  GA: 'E1',
  GT: 'G1',
  GC: 'B2',
  AG: 'C2',
  AA: 'E2',
  AT: 'G2',
  AC: 'B2',
  TG: 'C3',
  TA: 'E3',
  TT: 'G3',
  TC: 'B3',
  CG: 'C4',
  CA: 'E4',
  CT: 'G4',
  CC: 'B4'
}

export const CODON_MAP = {
  GCA: 'C2',
  GCC: 'C2',
  GCG: 'C2',
  GCT: 'C2',
  AGA: 'EB2',
  AGG: 'EB2',
  CGA: 'EB2',
  CGC: 'EB2',
  CGG: 'EB2',
  CGT: 'EB2',
  AAC: 'F2',
  AAT: 'F2',
  GAC: 'GB2',
  GAT: 'GB2',
  TGC: 'G2',
  TGT: 'G2',
  CAA: 'BB2',
  CAG: 'BB2',
  GAA: 'C3',
  GAG: 'C3',
  GGA: 'EB3',
  GGC: 'EB3',
  GGG: 'EB3',
  GGT: 'EB3',
  CAC: 'EB3',
  CAT: 'EB3',
  ATA: 'GB3',
  ATC: 'GB3',
  ATT: 'GB3',
  CTA: 'G3',
  CTC: 'G3',
  CTG: 'G3',
  CTT: 'G3',
  TTA: 'G3',
  TTG: 'G3',
  AAA: 'BB3',
  AAG: 'BB3',
  ATG: 'C4',
  TTC: 'EB4',
  TTT: 'EB4',
  CCA: 'F4',
  CCC: 'F4',
  CCG: 'F4',
  CCT: 'F4',
  AGC: 'GB4',
  AGT: 'GB4',
  TCA: 'GB4',
  TCC: 'GB4',
  TCG: 'GB4',
  TCT: 'GB4',
  TAA: 'G4',
  TAG: 'G4',
  TGA: 'G4',
  ACA: 'BB4',
  ACC: 'BB4',
  ACG: 'BB4',
  ACT: 'BB4',
  TGG: 'C5',
  TAC: 'EB5',
  TAT: 'EB5',
  GTA: 'F5',
  GTC: 'F5',
  GTG: 'F5',
  GTT: 'F5'
}
/*
https://regexr.com/
example bre tata AGAAAGATTAAAAG
(?:[ag][agc]aaa[ag])(a{1,3})(?:ttaaa[at][ag])
*/
