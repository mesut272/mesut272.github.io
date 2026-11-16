// A deliberate scroll budget, rather than one wheel event, turns a section.
export function createWheelPager({threshold=260,idle=260,dwell=1000}={}){
 let last=-Infinity,started=0,total=0,direction=0,spent=false,holdUntil=0;
 return {
  hold(now){holdUntil=now+dwell;total=0;spent=true;},
  feed(delta,now,atEdge=true){
   if(!Number.isFinite(delta)||!delta)return 0;
   if(now-last>idle){total=0;direction=0;spent=false;started=now;}
   last=now;
   if(!atEdge||now<holdUntil){spent=true;total=0;return 0;}
   if(spent)return 0;
   const sign=Math.sign(delta);
   if(direction&&sign!==direction){total=0;started=now;}
   direction=sign;total+=Math.min(Math.abs(delta),70);
   if(total<threshold||now-started<100)return 0;
   spent=true;holdUntil=now+dwell;return direction;
  }
 };
}
