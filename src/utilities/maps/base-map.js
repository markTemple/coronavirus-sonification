export const ONE23 = ['1', '2', '3']

export const COMPLEMENTARY_MAP = {
  G:'C',
  A:'T',
  T:'A',
  C:'G'
}

export const ANTICODON_MAP = {
  G:'C',
  A:'U',
  T:'A',
  C:'G'
}

export const BASE_MAP = {
  G: 'C2',
  A: 'E2',
  T: 'G2',
  C: 'C3'
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

// export const CODON_MAP = {
//   GCA: 'C2',
//   GCC: 'C2',
//   GCG: 'C2',
//   GCT: 'C2',
//   AGA: 'D2',
//   AGG: 'D2',
//   CGA: 'D2',
//   CGC: 'D2',
//   CGG: 'D2',
//   CGT: 'D2',
//   AAC: 'E2',
//   AAT: 'E2',
//   GAC: 'F2',
//   GAT: 'F2',
//   TGC: 'G2',
//   TGT: 'G2',
//   CAA: 'A3',
//   CAG: 'A3',
//   GAA: 'B3',
//   GAG: 'B3',
//   GGA: 'C3',
//   GGC: 'C3',
//   GGG: 'C3',
//   GGT: 'C3',
//   CAC: 'C3',
//   CAT: 'C3',
//   ATA: 'D3',
//   ATC: 'D3',
//   ATT: 'D3',
//   CTA: 'E3',
//   CTC: 'E3',
//   CTG: 'E3',
//   CTT: 'E3',
//   TTA: 'E3',
//   TTG: 'E3',
//   AAA: 'F3',
//   AAG: 'F3',
//   ATG: 'G3',
//   TTC: 'A4',
//   TTT: 'A4',
//   CCA: 'B4',
//   CCC: 'B4',
//   CCG: 'B4',
//   CCT: 'B4',
//   AGC: 'C4',
//   AGT: 'C4',
//   TCA: 'C4',
//   TCC: 'C4',
//   TCG: 'C4',
//   TCT: 'C4',
//   TAA: 'D4',
//   TAG: 'D4',
//   TGA: 'D4',
//   ACA: 'E4',
//   ACC: 'E4',
//   ACG: 'E4',
//   ACT: 'E4',
//   TGG: 'F4',
//   TAC: 'F4',
//   TAT: 'F4',
//   GTA: 'G4',
//   GTC: 'G4',
//   GTG: 'G4',
//   GTT: 'G4'
// }
/*
https://regexr.com/
example bre tata AGAAAGATTAAAAG
(?:[ag][agc]aaa[ag])(a{1,3})(?:ttaaa[at][ag])
*/

export const CODON_MAP2 = {
GCA:{AA:'Ala',Note:'C2'},
GCC:{AA:'Ala',Note:'C2'},
GCG:{AA:'Ala',Note:'C2'},
GCT:{AA:'Ala',Note:'C2'},
AGA:{AA:'Arg',Note:'D2'},
AGG:{AA:'Arg',Note:'D2'},
CGA:{AA:'Arg',Note:'D2'},
CGC:{AA:'Arg',Note:'D2'},
CGG:{AA:'Arg',Note:'D2'},
CGT:{AA:'Arg',Note:'D2'},
AAC:{AA:'Asn',Note:'E2'},
AAT:{AA:'Asn',Note:'E2'},
GAC:{AA:'Asp',Note:'F2'},
GAT:{AA:'Asp',Note:'F2'},
TGC:{AA:'Cys',Note:'G2'},
TGT:{AA:'Cys',Note:'G2'},
CAA:{AA:'Gln',Note:'A3'},
CAG:{AA:'Gln',Note:'A3'},
GAA:{AA:'Glu',Note:'B3'},
GAG:{AA:'Glu',Note:'B3'},
GGA:{AA:'Gly',Note:'C3'},
GGC:{AA:'Gly',Note:'C3'},
GGG:{AA:'Gly',Note:'C3'},
GGT:{AA:'Gly',Note:'C3'},
CAC:{AA:'His',Note:'C3'},
CAT:{AA:'His',Note:'C3'},
ATA:{AA:'Ile',Note:'D3'},
ATC:{AA:'Ile',Note:'D3'},
ATT:{AA:'Ile',Note:'D3'},
CTA:{AA:'Leu',Note:'E3'},
CTC:{AA:'Leu',Note:'E3'},
CTG:{AA:'Leu',Note:'E3'},
CTT:{AA:'Leu',Note:'E3'},
TTA:{AA:'Leu',Note:'E3'},
TTG:{AA:'Leu',Note:'E3'},
AAA:{AA:'Lys',Note:'F3'},
AAG:{AA:'Lys',Note:'F3'},
ATG:{AA:'Mt*',Note:'G3'},
TTC:{AA:'Phe',Note:'A4'},
TTT:{AA:'Phe',Note:'A4'},
CCA:{AA:'Pro',Note:'B4'},
CCC:{AA:'Pro',Note:'B4'},
CCG:{AA:'Pro',Note:'B4'},
CCT:{AA:'Pro',Note:'B4'},
AGC:{AA:'Ser',Note:'C4'},
AGT:{AA:'Ser',Note:'C4'},
TCA:{AA:'Ser',Note:'C4'},
TCC:{AA:'Ser',Note:'C4'},
TCG:{AA:'Ser',Note:'C4'},
TCT:{AA:'Ser',Note:'C4'},
TAA:{AA:'ST*',Note:'D4'},
TAG:{AA:'ST*',Note:'D4'},
TGA:{AA:'ST*',Note:'D4'},
ACA:{AA:'Thr',Note:'E4'},
ACC:{AA:'Thr',Note:'E4'},
ACG:{AA:'Thr',Note:'E4'},
ACT:{AA:'Thr',Note:'E4'},
TGG:{AA:'Trp',Note:'F4'},
TAC:{AA:'Tyr',Note:'F4'},
TAT:{AA:'Tyr',Note:'F4'},
GTA:{AA:'Val',Note:'G4'},
GTC:{AA:'Val',Note:'G4'},
GTG:{AA:'Val',Note:'G4'},
GTT:{AA:'Val',Note:'G4'}
}
