import {places,createDispatch,addRide,advanceDispatch} from './dispatch-engine.mjs';
const ns='http://www.w3.org/2000/svg';
const svgNode=(tag,attrs={})=>{const el=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));return el;};
export function initDispatch(){
 const $=s=>document.querySelector(s);let state=createDispatch();let paused=false;let visible=false;
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:.1});observer.observe($('.dispatch-playground'));
 const render=()=>{
  $('#dispatchActive').textContent=state.active.length;$('#dispatchWaiting').textContent=state.queue.length;$('#dispatchCompleted').textContent=state.completed;
  $('#dispatchMessage').textContent=state.lastMessage;
  $('#dispatchPause').textContent=paused?'Resume':'Pause';$('#dispatchPause').setAttribute('aria-pressed',String(paused));
  const trips=$('#mapTrips');trips.replaceChildren();const cars=$('#mapCars');cars.replaceChildren();
  state.active.forEach((r,i)=>{const from=places[r.from],to=places[r.to];const hue=['#9b7dc4','#78bca2','#d1a770'][i%3];
   trips.append(svgNode('path',{d:`M${from.x} ${from.y}L${to.x} ${to.y}`,stroke:hue,'stroke-width':3,'stroke-dasharray':'5 5',fill:'none'}));
   const x=from.x+(to.x-from.x)*r.progress,y=from.y+(to.y-from.y)*r.progress;
   const car=svgNode('g',{transform:`translate(${x} ${y})`});car.append(svgNode('circle',{r:12,fill:hue,stroke:'#fff','stroke-width':2}));const label=svgNode('text',{'text-anchor':'middle',y:3,fill:'#20202a','font-size':8,'font-weight':700});label.textContent=r.driver;car.append(label);const title=svgNode('title');title.textContent=`Ride ${r.id} · ${r.from} → ${r.to} · ${Math.round(r.progress*100)}%`;car.append(title);cars.append(car);
  });
  state.drivers.filter(d=>!state.active.some(r=>r.driver===d.id)).forEach((d,i)=>{const p=places[d.location];const g=svgNode('g',{transform:`translate(${p.x-15+i*10} ${p.y+24})`});g.append(svgNode('circle',{r:5,fill:'#78bca2'}));const title=svgNode('title');title.textContent=`${d.id} available at ${p.label}`;g.append(title);cars.append(g);});
  const q=$('#dispatchQueue');q.replaceChildren();state.queue.forEach(r=>{const line=document.createElement('span');line.textContent=`#${r.id} ${r.type} · ${r.from} → ${r.to}`;q.append(line);});
 };
 Object.entries(places).forEach(([key,p])=>{
  for(const selector of ['#dispatchFrom','#dispatchTo']){const option=document.createElement('option');option.value=key;option.textContent=p.label;$(selector).append(option);}
  const g=svgNode('g',{transform:`translate(${p.x} ${p.y})`,role:'button',tabindex:0,'aria-label':`Set pickup at ${p.label}`,class:'map-location'});g.append(svgNode('circle',{r:7}));const text=svgNode('text',{y:-17,'text-anchor':'middle'});text.textContent=p.label;g.append(text);
  const select=()=>{$('#dispatchFrom').value=key;state.lastMessage=`Pickup set to ${p.label}. Choose a destination and dispatch.`;render();};g.addEventListener('click',select);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select();}});$('#mapPlaces').append(g);
 });
 const keys=Object.keys(places);for(let i=0;i<keys.length-1;i++){const a=places[keys[i]],b=places[keys[i+1]];$('#mapRoads').append(svgNode('path',{d:`M${a.x} ${a.y}L${b.x} ${b.y}`,stroke:'#a69bac','stroke-width':1,opacity:.2,fill:'none'}));}
 $('#dispatchFrom').value='UW';$('#dispatchTo').value='Bellevue';
 $('#dispatchForm').addEventListener('submit',event=>{event.preventDefault();state=addRide(state,$('#dispatchFrom').value,$('#dispatchTo').value,$('#dispatchType').value);render();});
 $('#dispatchBurst').addEventListener('click',()=>{for(let i=0;i<5;i++)state=addRide(state,keys[i%keys.length],keys[(i+2)%keys.length],i===4?'Express':'Standard');render();});
 $('#dispatchPause').addEventListener('click',()=>{paused=!paused;render();});
 $('#dispatchReset').addEventListener('click',()=>{state=createDispatch();paused=false;render();});
 setInterval(()=>{if(!paused&&visible&&!document.hidden&&state.active.length){state=advanceDispatch(state,.25);render();}},250);render();
}
