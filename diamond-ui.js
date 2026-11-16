import {createDiamondSession,diamondStep} from './diamond-workflow.mjs';
export function initDiamondLab(){
 const $=s=>document.querySelector(s);let state=createDiamondSession();
 const render=()=>{
  $('#diamondReply').textContent=state.reply;
  $('#diamondRuntime').textContent=`${state.runtime} RUNTIME`;
  $('#diamondOrders').textContent=state.ordersCreated;
  $('#diamondVerdict').textContent=state.supervisor==='idle'?'—':state.supervisor.replace('_',' ');
  $('#diamondGate').textContent=state.paymentVerified?'UNLOCKED':'LOCKED';
  $('#diamondGate').classList.toggle('unlocked',state.paymentVerified);
  const stages=['BROWSING','ITEM_SELECTED','PENDING_HUMAN_REVIEW','VERIFIED','SHIPPED'];
  document.querySelectorAll('[data-stage]').forEach((node,i)=>{node.classList.toggle('current',node.dataset.stage===state.stage);node.classList.toggle('passed',i<stages.indexOf(state.stage));});
  const results=$('#diamondResults');results.replaceChildren();
  if(!state.results.length){const p=document.createElement('p');p.className='catalog-empty';p.textContent=state.lastAction==='SEARCH'?'No matching diamonds. Change the filters and try again.':'Your search starts here. Choose a shape, size and budget above.';results.append(p);}
  state.results.forEach(d=>{
   const button=document.createElement('button');button.className='diamond-product';button.setAttribute('aria-pressed',String(state.selected?.id===d.id));
   const gem=document.createElement('span');gem.className=`gem gem-${d.shape.toLowerCase()}`;gem.textContent='◇';gem.setAttribute('aria-hidden','true');
   const name=document.createElement('strong');name.textContent=`${d.id} · ${d.carat} ct`;
   const specs=document.createElement('small');specs.textContent=`${d.shape} · ${d.color} / ${d.clarity}`;
   const price=document.createElement('span');price.className='gem-price';price.textContent=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(d.price);
   const action=document.createElement('span');action.className='gem-select';action.textContent=state.selected?.id===d.id?'Selected ✓':'Choose this one ↗';
   button.append(gem,name,specs,price,action);button.addEventListener('click',()=>dispatch({type:'SELECT',id:d.id}));results.append(button);
  });
  const trace=$('#diamondTrace');trace.replaceChildren();
  if(!state.trace.length){const li=document.createElement('li');li.textContent='Waiting for your first action.';trace.append(li);}
  state.trace.forEach(t=>{const li=document.createElement('li');const actor=document.createElement('span');actor.className='trace-actor';actor.textContent=t.actor;const code=document.createElement('code');code.textContent=t.tool;const result=document.createElement('small');result.textContent=t.result;li.append(actor,code,result);trace.append(li);});
 };
 const dispatch=action=>{state=diamondStep(state,action);render();};
 $('#diamondSearch').addEventListener('submit',event=>{event.preventDefault();dispatch({type:'SEARCH',filters:{shape:$('#diamondShape').value,carat:Number($('#diamondCarat').value),budget:Number($('#diamondBudget').value)}});});
 document.querySelectorAll('[data-diamond-action]').forEach(button=>button.addEventListener('click',()=>dispatch({type:button.dataset.diamondAction})));
 $('#diamondReset').addEventListener('click',()=>{state=createDiamondSession();$('#diamondShape').value='Round';$('#diamondCarat').value='1';$('#diamondBudget').value='8000';render();});
 render();
}
