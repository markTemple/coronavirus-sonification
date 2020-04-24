import { genome } from '../genome'


const motif = (index, length = 1) => genome.substring(index, index + length)

export const getBase = (index) => motif(index)
export const getDinucleotide = (index) => motif(index, 2)
export const getCodon = (index) => motif(index, 3)
export const getBases10 = (index) => motif(index, 10)
export const getBases100 = (index) => motif(index, 100)
