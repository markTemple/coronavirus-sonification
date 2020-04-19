export function newGCratio (motif) {
  let GC = motif.match(/[GC]/g);
  let ratio = 0
  if(GC === null) ratio = 0
  else ratio = (GC.length/motif.length)*10;
  ratio = ratio.toFixed(0);
  return ratio
}

