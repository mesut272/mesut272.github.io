export const places={SpaceNeedle:{x:105,y:135,label:'Space Needle'},SLU:{x:230,y:115,label:'South Lake Union'},NEU:{x:325,y:167,label:'Northeastern'},UW:{x:407,y:65,label:'UW'},Bellevue:{x:555,y:192,label:'Bellevue'},Airport:{x:300,y:325,label:'SeaTac'}};
export function createDispatch(){return {drivers:[{id:'D1',location:'UW'},{id:'D2',location:'NEU'},{id:'D3',location:'SLU'}],active:[],queue:[],completed:0,nextId:1,lastMessage:'Choose a route, then dispatch your first ride.'};}
function assign(s){
 s.queue.sort((a,b)=>(a.type==='Express'?0:1)-(b.type==='Express'?0:1)||a.id-b.id);
 while(s.queue.length&&s.active.length<s.drivers.length){
  const ride=s.queue.shift();const available=s.drivers.filter(d=>!s.active.some(r=>r.driver===d.id));
  available.sort((a,b)=>{const dist=d=>Math.hypot(places[d.location].x-places[ride.from].x,places[d.location].y-places[ride.from].y);return dist(a)-dist(b);});
  const driver=available[0];s.active.push({...ride,driver:driver.id,progress:0,duration:12});
 }
 return s;
}
export function addRide(previous,from,to,type='Standard'){
 const s=structuredClone(previous);if(!places[from]||!places[to]||from===to){s.lastMessage='Choose two different places.';return s;}
 const ride={id:s.nextId++,from,to,type:type==='Express'?'Express':'Standard'};s.queue.push(ride);assign(s);
 s.lastMessage=s.queue.some(r=>r.id===ride.id)?`Ride ${ride.id} is waiting. All three drivers are busy.`:`Ride ${ride.id} assigned. ${places[from].label} → ${places[to].label}.`;return s;
}
export function advanceDispatch(previous,seconds){
 const s=structuredClone(previous);const remaining=[];
 for(const ride of s.active){ride.progress=Math.min(1,ride.progress+Math.max(0,seconds)/ride.duration);if(ride.progress>=1){s.completed++;s.drivers.find(d=>d.id===ride.driver).location=ride.to;s.lastMessage=`Ride ${ride.id} completed. Driver ${ride.driver} is available again.`;}else remaining.push(ride);}
 s.active=remaining;return assign(s);
}
