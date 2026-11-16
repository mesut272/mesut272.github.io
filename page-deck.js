import {createWheelPager} from './wheel-pager.mjs?v=scroll3';
import {nextPage} from './page-deck-state.mjs';
export function initPageDeck(){
 const $=s=>document.querySelector(s),main=$('main'),pages=[];
 const make=(key,label,nodes,anchor)=>{
  const page=document.createElement('section');page.className=`deck-page page-${key}`;page.hidden=true;page.dataset.label=label;page.setAttribute('aria-label',label);page.tabIndex=-1;if(anchor)page.id=anchor;
  const body=document.createElement('div');body.className='deck-content';
  if(key!=='home'&&key!=='about'&&key!=='contact'){const tag=document.createElement('div');tag.className='deck-eyebrow wrap';tag.textContent=label.toUpperCase();body.append(tag);}
  nodes.filter(Boolean).forEach(node=>body.append(node));page.append(body);pages.push(page);return page;
 };
 const home=$('#home'),about=$('#about'),contact=$('#contact'),work=$('#work'),life=$('#life');
 const diamondIntro=$('.diamond-project'),lab=$('.diamond-lab'),notes=$('.engineering-notes'),ride=$('.rideshare-project');
 const diamondBody=document.createElement('div');diamondBody.className='wrap deck-diamond-wrap';diamondBody.append(lab);
 const background=document.createElement('details');background.className='project-background';const summary=document.createElement('summary');summary.textContent='Project background, architecture & results ↗';background.append(summary,diamondIntro,notes);diamondBody.append(background);
 const rideBody=document.createElement('div');rideBody.className='wrap';rideBody.append(ride);
 const letters=document.createElement('div');letters.className='wrap';letters.append($('.collection-heading'),$('.autograph-grid'));
 const wrap=node=>{const d=document.createElement('div');d.className='wrap';d.append(node);return d;};
 const piano=$('.piano-section'),poker=$('.poker-feature'),cards=$('.cards-section'),football=$('.football-extras'),concert=$('.concert-card'),songs=$('.eason-card');
 make('home','Home',[home]);make('about','Experience',[about]);make('diamond','Projects / Diamond agent',[diamondBody],'work');make('dispatch','Projects / Dispatch playground',[rideBody],'dispatch');
 make('piano','Off the clock / Piano',[wrap(piano)],'life');make('poker','Off the clock / Poker',[wrap(poker)],'poker');make('letters','Off the clock / Letters',[letters],'letters');make('cards','Off the clock / Football cards',[wrap(cards)],'cards');make('football','Off the clock / On the pitch',[wrap(football)],'football');make('concert','Off the clock / Imagine Dragons',[wrap(concert)],'concert');make('songs','Off the clock / Eason Chan',[wrap(songs)],'songs');
 const footer=$('.site-footer');make('contact','Contact',[contact,footer],'contact-page');
 main.replaceChildren(...pages);document.body.classList.add('has-page-deck');
 const controls=document.createElement('nav');controls.className='deck-controls';controls.setAttribute('aria-label','Section navigation');
 const prev=document.createElement('button'),next=document.createElement('button'),count=document.createElement('span');prev.textContent='↑';next.textContent='↓';prev.setAttribute('aria-label','Previous section');next.setAttribute('aria-label','Next section');count.className='deck-count';controls.append(prev,count,next);document.body.append(controls);
 const menu=document.createElement('nav');menu.className='deck-dots';menu.setAttribute('aria-label','Jump to a section');
 pages.forEach((page,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',page.dataset.label);b.title=page.dataset.label;b.addEventListener('click',()=>show(i));menu.append(b);});document.body.append(menu);
 let current=0,lockedUntil=0,touchStart=null;
 const wheelPager=createWheelPager();
 const pageForHash=hash=>{let id;try{id=decodeURIComponent(hash.replace(/^#/,''));}catch{return -1;}const target=document.getElementById(id);return target?pages.findIndex(p=>p===target||p.contains(target)):-1;};
 const show=(index,updateHash=true)=>{
  index=Math.max(0,Math.min(pages.length-1,index));pages.forEach((p,i)=>{p.hidden=i!==index;p.classList.toggle('is-current',i===index);});current=index;pages[index].scrollTop=0;
  prev.disabled=index===0;next.disabled=index===pages.length-1;count.textContent=`${String(index+1).padStart(2,'0')} / ${String(pages.length).padStart(2,'0')} · ${pages[index].dataset.label}`;
  [...menu.children].forEach((b,i)=>{b.setAttribute('aria-current',i===index?'page':'false');});
  if(updateHash){const id=pages[index].id||pages[index].querySelector('[id]')?.id;if(id)history.replaceState(null,'','#'+id);}
  lockedUntil=performance.now()+500;wheelPager.hold(performance.now());
 };
 const turn=direction=>{if(performance.now()<lockedUntil)return;show(nextPage(current,direction,pages.length));};
 prev.addEventListener('click',()=>show(nextPage(current,-1,pages.length)));next.addEventListener('click',()=>show(nextPage(current,1,pages.length)));
 document.addEventListener('click',event=>{const a=event.target.closest('a[href^="#"]');if(!a)return;const hash=a.getAttribute('href');const index=pageForHash(hash);if(index<0)return;event.preventDefault();show(index,false);history.replaceState(null,'',hash);});
 window.addEventListener('hashchange',()=>{const i=pageForHash(location.hash);if(i>=0)show(i,false);});
 document.addEventListener('wheel',event=>{
  if($('dialog[open]')||event.ctrlKey||Math.abs(event.deltaY)<=Math.abs(event.deltaX))return;
  const page=pages[current],direction=event.deltaY>0?1:-1,now=performance.now();
  const canScroll=node=>node.scrollHeight>node.clientHeight+2&&(direction>0?node.scrollTop+node.clientHeight<node.scrollHeight-2:node.scrollTop>2);
  let node=event.target;
  while(node&&node!==page){if(['auto','scroll'].includes(getComputedStyle(node).overflowY)&&canScroll(node)){wheelPager.feed(event.deltaY,now,false);return;}node=node.parentElement;}
  if(canScroll(page)){wheelPager.feed(event.deltaY,now,false);return;}
  event.preventDefault();
  const pixels=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?page.clientHeight:1);
  const intent=wheelPager.feed(pixels,now);
  if(intent)turn(intent);
 },{passive:false});
 document.addEventListener('keydown',event=>{if($('dialog[open]')||event.target.closest('input,select,textarea,button,a,video,audio,summary'))return;if(['PageDown','ArrowDown','PageUp','ArrowUp'].includes(event.key)){event.preventDefault();turn(['PageDown','ArrowDown'].includes(event.key)?1:-1);}});
 main.addEventListener('touchstart',e=>{
  if(e.touches.length!==1||$('dialog[open]')){touchStart=null;return;}
  const p=pages[current];touchStart={y:e.touches[0].clientY,top:p.scrollTop<=2,bottom:p.scrollTop+p.clientHeight>=p.scrollHeight-2};
 },{passive:true});
 main.addEventListener('touchend',e=>{
  if(touchStart===null)return;
  const gesture=touchStart,delta=gesture.y-e.changedTouches[0].clientY;touchStart=null;
  if(Math.abs(delta)>90&&(delta>0&&gesture.bottom||delta<0&&gesture.top))turn(delta>0?1:-1);
 },{passive:true});
 main.addEventListener('touchcancel',()=>{touchStart=null;},{passive:true});
 const initial=pageForHash(location.hash);show(initial>=0?initial:0,false);
}
