export function nextPage(current,direction,count){return Math.max(0,Math.min(count-1,current+(direction>0?1:direction<0?-1:0)));}
