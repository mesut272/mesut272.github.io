// Supplement native snapping only when a deliberate short gesture would snap back.
export function shortScrollTarget(startIndex,delta,count,threshold=65){return Math.abs(delta)<threshold?startIndex:Math.max(0,Math.min(count-1,startIndex+Math.sign(delta)));}
export function installShortScrollAssist(main,canScroll=()=>true){
 let start=0,total=0,last=-Infinity,timer;
 main.addEventListener('wheel',event=>{
  if(!canScroll()||event.ctrlKey||Math.abs(event.deltaY)<=Math.abs(event.deltaX)||event.target.closest('select,input,textarea,.diamond-results,.assistant-reply,.trace-details'))return;
  const now=performance.now(),height=main.clientHeight;
  if(now-last>220){start=Math.round(main.scrollTop/height);total=0;}
  last=now;total+=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?height:1);
  clearTimeout(timer);timer=setTimeout(()=>{
   const target=shortScrollTarget(start,total,main.children.length),top=target*height;
   if(target!==start&&(target>start?main.scrollTop<top-2:main.scrollTop>top+2))main.scrollTo({top,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  },120);
 },{passive:true});
}
