export const locus = 'MN908947.3'
export const size = 29903
export const units = 'bp'
export const type = 'ss-RNA'
export const strcture = 'linear'
export const definition = 'Severe acute respiratory syndrome coronavirus 2 isolate Wuhan-Hu-1,complete genome.'
// export const source = 'Severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2)'
export const source = 'Single stranded RNA plus (+) sequence of Coronavirus COVID-19'
export const organism = ['Viruses', 'Riboviria', 'Nidovirales', 'Cornidovirineae', 'Coronaviridae', 'Orthocoronavirinae', 'Betacoronavirus', 'Sarbecovirus']
export const authors = 'Wu,F., Zhao,S., Yu,B., Chen,Y.M., Wang,W., Song,Z.G., Hu,Y., Tao,Z.W., Tian,J.H., Pei,Y.Y., Yuan,M.L., Zhang,Y.L., Dai,F.H., Liu,Y., Wang,Q.M., Zheng,J.J., Xu,L., Holmes,E.C. and Zhang,Y.Z.'
export const title = 'A new coronavirus associated with human respiratory disease in China'
export const journal = 'Nature 579 (7798), 265-269 (2020)'
export const pubmed = 32015508
export const submitted = '05-JAN-2020'
export const institution = 'Shanghai Public Health Clinical Center & School of Public Health, Fudan University, Shanghai, China'
export const assembly_Method = 'Megahit v. V1.1.3'
export const sequencing_technology = 'Illumina'
export const mol_type = 'genomic RNA'
export const isolate = 'Wuhan-Hu-1'
export const host = 'Homo sapiens'
export const db_xref = 'taxon:2697049'
export const country = 'China'
export const collection_date = 'Dec-2019'

export const trs_json = [
  {
  button_label: '5`',
  start: 1,
  end: 63,
  trs_seq: '',
  },
  {
  button_label: 'TRS1',
  start: 64,
  end: 78,
  trs_seq: 'CUCUAAACGAACUU',
  },
  {
  button_label: '01',
  start: 79,
  end: 21549,
  trs_seq: '',
  },
  {
  button_label: 'TRS2',
  start: 21550,
  end: 21564,
  trs_seq: 'AACUAAACGAACAAUG',
  },
  {
  button_label: '02',
  start: 21565,
  end: 25378,
  trs_seq: '',
  },  {
  button_label: 'TRS3',
  start: 25379,
  end: 25396,
  trs_seq: 'ACAUAAACGAACUUAUG',
  },
  {
  button_label: '03',
  start: 25397,
  end: 26230,
  trs_seq: '',
  },
  {
  button_label: 'TRS4',
  start: 26231,
  end: 26248,
  trs_seq: 'AUGAGUACGAACUUAUG',
  },
  {
  button_label: '04',
  start: 26249,
  end: 26466,
  trs_seq: '',
  },
  {
  button_label: 'TRS5',
  start: 26467,
  end: 26481,
  trs_seq: 'GUCUAAACGAACUA',
  },
  {
  button_label: '05',
  start: 26482,
  end: 27034,
  trs_seq: '',
  },
  {
  button_label: 'TRS6',
  start: 27035,
  end: 27049,
  trs_seq: 'UACAUCACGAACGC',
  },
  {
  button_label: '06',
  start: 27050,
  end: 27381,
  trs_seq: '',
  },  {
  button_label: 'TRS7',
  start: 27382,
  end: 27397,
  trs_seq: 'GAUUAAACGAACAUG',
  },
  {
  button_label: '07',
  start: 27398,
  end: 27881,
  trs_seq: '',
  },
  {
  button_label: 'TRS8',
  start: 27882,
  end: 27897,
  trs_seq: 'GCCUAAACGAACAUG',
  },
  {
  button_label: '08',
  start: 27898,
  end: 28253,
  trs_seq: '',
  },
  {
  button_label: 'TRS9',
  start: 28254,
  end: 28268,
  trs_seq: 'AUCUAAACGAACAA'
  },
  {
  button_label: '09',
  start: 28269,
  end: 29527,
  trs_seq: '',
  },  {
  button_label: 'TRS10',
  start: 29528,
  end: 29542,
  trs_seq: 'GCCUAAACUCAUGC',
  },
  {
  button_label: '3`',
  start: 29543,
  end: 29903,
  trs_seq: '',
  },
]

export const geneBank_json = [
  {start: 1,
  end: 265,
  gene: "5'UTR",
  product: 'Untranslated',
  protein_id: 'No protein',
  button_label: "5`U",
  type: 'u',
  },
  {
  start: 266,
  // end: 13468, // does not matce stop in that frame
  // stop at 13481 use 13467 for simplicityz
  end: 13467,
  gene: 'ORF1a',
  product: 'Polyprotein (ab fragment 1)',
  protein_id: 'QHD43415.1',
  button_label: "ab1",
  type: 'p',
  },
  // {
  //   start: 13465, //added by me, 3 nt in frame with frag 2
  //   end: 13467,
  //   gene: 'frameshift',
  //   product: 'frameshift',
  //   protein_id: 'frameshift',
  //   button_label: "fs",
  //   type: 'p',
  //   },
  {
  start: 13468,
  end: 21555,
  gene: 'ORF1b, -1 ribosomal frameshift',
  product: 'Polyprotein (ab fragment 2)',
  protein_id: 'QHD43415.1',
  button_label: "ab2",
  type: 'p',
  },
  {
  start: 21556,
  end: 21562,
  gene: 'UTR',
  product: 'Untranslated',
  protein_id: 'No protein',
  button_label: "UTR",
  type: 'u',
  },
  {
  start: 21563,
  end: 25384,
  gene: 'Spike structural protein (S)',
  product: 'Surface glycoprotein',
  protein_id: 'QHD43416.1',
  button_label: " S ",
  type: 'p',
 },
  {
  start: 25385,
  end: 25392,
  gene: 'UTR',
  product: 'Untranslated',
  protein_id: 'No protein',
  button_label: "UTR",
  type: 'u',
  },
  {
  start: 25393,
  end: 26220,
  gene: 'ORF3a',
  product: 'Protein ORF3a',
  protein_id: 'QHD43417.1',
  button_label: "ORF",
  type: 'p',
  },
  {
  start: 26221,
  end: 26244,
  gene: 'UTR',
  product: 'Untranslated',
  protein_id: 'No protein',
  button_label: "UTR",
  type: 'u',
  },
  {
  start: 26245,
  end: 26472,
  gene: 'Envelope structural protein (E)',
  product: 'Envelope protein',
  protein_id: 'QHD43418.1',
  button_label: " E ",
  type: 'p',
  },
  {
  start: 26473,
  end: 26522,
  gene: 'UTR',
  product: 'Untranslated',
  protein_id: 'No protein',
  button_label: "UTR",
  type: 'u',
  },
  {
  start: 26523,
  end: 27191,
  gene: 'Membrane structural protein (M)',
  product: 'Membrane glycoprotein',
  protein_id: 'QHD43419.1',
  button_label: " M ",
  type: 'p',
  },
  {
  start: 27192,
  end: 27201,
  gene: 'UTR',
  product: 'Untranslated',
  protein_id: 'No protein',
  button_label: "UTR",
  type: 'u',
  },
  {
  start: 27202,
  end: 27387,
  gene: 'ORF6',
  product: 'Protein ORF6',
  protein_id: 'QHD43420.1',
  button_label: "ORF",
  type: 'p',
  },
  {
  start: 27388,
  end: 27393,
  gene: 'UTR',
  product: 'Untranslated',
  protein_id: 'No protein',
  button_label: "UTR",
  type: 'u',
  },
  {
  start: 27394,
  end: 27759,
  gene: 'ORF7a',
  product: 'Protein ORF7a',
  protein_id: 'QHD43421.1',
  button_label: "ORF",
  type: 'p',
  },
  {
  start: 27760,
  end: 27893,
  gene: 'UTR',
  product: 'Untranslated',
  protein_id: 'No protein',
  button_label: "UTR",
  type: 'u',
  },
  {
  start: 27894,
  end: 28259,
  gene: 'ORF8',
  product: 'Protein ORF8',
  protein_id: 'QHD43422.1',
  button_label: "ORF",
  type: 'p',
  },
  {
  start: 28260,
  end: 28273,
  gene: 'UTR',
  product: 'Untranslated',
  protein_id: 'No protein',
  button_label: "UTR",
  type: 'u',
  },
  {
  start: 28274,
  end: 29533,
  gene: 'Nucleocapsid structural protein (N)',
  product: 'Nucleocapsid phosphoprotein',
  protein_id: 'QHD43423.2',
  button_label: " N ",
  type: 'p',
  },
  {
  start: 29534,
  end: 29557,
  gene: 'UTR',
  product: 'Untranslated',
  protein_id: 'No protein',
  button_label: "UTR",
  type: 'u',
  },
  {
  start: 29558,
  end: 29674,
  gene: 'ORF10',
  product: 'protein ORF10',
  protein_id: 'QHI42199.1',
  button_label: "ORF",
  type: 'p',
  },
  {
  start: 29675,
  end: 29902,
  gene: "3'UTR",
  product: 'Untranslated',
  protein_id: 'No protein',
  button_label: "3`U",
  type: 'u',
  },
  {
  start: 29903,
  end: 29903,
  gene: "3`end",
  product: 'End of Sequence',
  protein_id: 'End of Sequence',
  button_label: "3`end",
  type: 'u',
  },
]

export const nsp_json = [
  {
  name: '',
  start: 1,
  end: 265,
  aa_res: null,
 },
  {
  name: 'nsp1',
  start: 266,
  end: 803,
  aa_res: 180,
  },
  {
  name: '',
  start: 804,
  end: 805,
  aa_res: null,
 },
 {
  name: 'nsp2',
  start: 806,
  end: 2717,
  aa_res: 638,
  },
  {
  name: '',
  start: 2718,
  end: 2719,
  aa_res: null,
 },
  {
  name: 'nsp3',
  start: 2720,
  end: 8552,
  aa_res: 1945,
  },
   {
  name: '',
  start: 8553,
  end: 8554,
  aa_res: null,
 },
 {
  name: 'nsp4',
  start: 8555,
  end: 10052,
  aa_res: 500,
  },
  {
  name: '',
  start: 10053,
  end: 10054,
  aa_res: null,
 },
  {
  name: 'nsp5',
  start: 10055,
  end: 10970,
  aa_res: 306,
  },
  {
  name: '',
  start: 10971,
  end: 10972,
  aa_res: null,
 },
  {
  name: 'nsp6',
  start: 10973,
  end: 11840,
  aa_res: 290,
  },
  {
  name: '',
  start: 11841,
  end: 11842,
  aa_res: null,
 },
  {
  name: 'nsp7',
  start: 11843,
  end: 12089,
  aa_res: 83,
  },
  {
  name: '',
  start: 12090,
  end: 12091,
  aa_res: null,
 },
  {
  name: 'nsp8',
  start: 12092,
  end: 12683,
  aa_res: 198,
  },
  {
  name: '',
  start: 12684,
  end: 12685,
  aa_res: null,
 },
  {
  name: 'nsp9',
  start: 12686,
  end: 13022,
  aa_res: 113,
  },
  {
  name: '',
  start: 13023,
  end: 13024,
  aa_res: null,
 },
  {
  name: 'nsp10',
  start: 13025,
  end: 13439,
  aa_res: 139,
  },
  {
  name: '',
  start: 13440,
  end: 13443,
  aa_res: null,
 },
  {
  name: 'nsp11',
  start: 13444,
  end: 13480,
  aa_res: 13,
  },
  {
  name: 'nsp12',
  start: 13444,
  end: 16234,
  aa_res: 931,
  },
  {
  name: '',
  start: 16235,
  end: 16236,
  aa_res: null,
 },
  {
  name: 'nsp13',
  start: 16237,
  end: 18037,
  aa_res: 601,
  },
  {
  name: '',
  start: 18038,
  end: 18039,
  aa_res: null,
 },
  {
  name: 'nsp14',
  start: 18040,
  end: 19618,
  aa_res: 527,
  },
  {
  name: '',
  start: 19619,
  end: 19620,
  aa_res: null,
 },
  {
  name: 'nsp15',
  start: 19621,
  end: 20656,
  aa_res: 346,
  },
  {
  name: '',
  start: 20657,
  end: 20658,
  aa_res: null,
 },
  {
  name: 'nsp16',
  start: 20659,
  end: 21550,
  aa_res: 298,
  },
  {
  name: '',
  start: 21551,
  end: 29903,
  aa_res: null,
 },
]


