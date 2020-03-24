export const ONE23 = ['1', '2', '3']

export const COMPLEMENTARY_MAP = {
  G:'C',
  A:'T',
  T:'A',
  C:'G'
}

export const BASE_MAP = {
  G: 'C2',
  A: 'E2',
  T: 'G2',
  C: 'B4'
}

export const TWOBASE_MAP = {
  TG: 'C1',
  TA: 'E1',
  TT: 'G1',
  TC: 'B2',
  CG: 'C2',
  CA: 'E2',
  CT: 'G2',
  CC: 'B3',
  GG: 'C3',
  GA: 'E3',
  GT: 'G3',
  GC: 'B4',
  AG: 'C4',
  AA: 'E4',
  AT: 'G4',
  AC: 'B5'
}

export const CODON_MAP = {
  GCA: 'C2',
  GCC: 'C2',
  GCG: 'C2',
  GCT: 'C2',
  AGA: 'D2',
  AGG: 'D2',
  CGA: 'D2',
  CGC: 'D2',
  CGG: 'D2',
  CGT: 'D2',
  AAC: 'E2',
  AAT: 'E2',
  GAC: 'F2',
  GAT: 'F2',
  TGC: 'G2',
  TGT: 'G2',
  CAA: 'A3',
  CAG: 'A3',
  GAA: 'B3',
  GAG: 'B3',
  GGA: 'C3',
  GGC: 'C3',
  GGG: 'C3',
  GGT: 'C3',
  CAC: 'C3',
  CAT: 'C3',
  ATA: 'D3',
  ATC: 'D3',
  ATT: 'D3',
  CTA: 'E3',
  CTC: 'E3',
  CTG: 'E3',
  CTT: 'E3',
  TTA: 'E3',
  TTG: 'E3',
  AAA: 'F3',
  AAG: 'F3',
  ATG: 'G3',
  TTC: 'A4',
  TTT: 'A4',
  CCA: 'B4',
  CCC: 'B4',
  CCG: 'B4',
  CCT: 'B4',
  AGC: 'C4',
  AGT: 'C4',
  TCA: 'C4',
  TCC: 'C4',
  TCG: 'C4',
  TCT: 'C4',
  TAA: 'D4',
  TAG: 'D4',
  TGA: 'D4',
  ACA: 'E4',
  ACC: 'E4',
  ACG: 'E4',
  ACT: 'E4',
  TGG: 'F4',
  TAC: 'F4',
  TAT: 'F4',
  GTA: 'G4',
  GTC: 'G4',
  GTG: 'G4',
  GTT: 'G4'
}
/*
https://regexr.com/
example bre tata AGAAAGATTAAAAG
(?:[ag][agc]aaa[ag])(a{1,3})(?:ttaaa[at][ag])
*/
