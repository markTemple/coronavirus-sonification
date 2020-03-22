export function frameCount() {
  let i = 0;
  function Up() {
    i ++;
    if(i === 3) {i = 0;}
    return i;
  }
  return Up;
};

//playground
// require sequence string, motif Start baseStart and Motif Length baseFinish
export function getMotif (seq, baseStart, baseFinish) {
  let motif = seq.substring(baseStart, baseFinish);
  return (motif);
}

export function GCratio (motif) {
  let GC = motif.match(/[GC]/g);
  if(GC === null) return 0;
  else return (GC.length/motif.length);
}

export function calcMotif_GC (seq, baseStart, baseFinish) {
  let motif = getMotif(seq, baseStart, baseFinish);
  let ratio = GCratio(motif);
  //divide gc by lenght of get  //return number
  return [motif, ratio];
}

