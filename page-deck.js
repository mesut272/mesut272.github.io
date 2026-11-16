import {fitToScreen} from './screen-fit.mjs';
export function initPageDeck(){
 const $=s=>document.querySelector(s),main=$('main'),pages=[];
 const make=(key,label,nodes,anchor)=>{
  const page=document.createElement('section');page.className=`deck-page page-${key}`;page.dataset.label=label;page.setAttribute('aria-label',label);page.tabIndex=-1;if(anchor)page.id=anchor;
  const body=document.createElement('div');body.className='deck-content';
  if(!['home','about','contact'].includes(key)){const tag=document.createElement('div');tag.className='deck-eyebrow wrap';tag.textContent=label.toUpperCase();body.append(tag);}
  nodes.filter(Boolean).forEach(node=>body.append(node));const stage=document.createElement('div');stage.className='deck-stage';stage.append(body);page.append(stage);pages.push(page);return page;
 };
 const wrap=node=>{const d=document.createElement('div');d.className='wrap';d.append(node);return d;};
 const home=$('#home'),about=$('#about'),contact=$('#contact'),footer=$('.site-footer');
 const diamondBody=document.createElement('div');diamondBody.className='wrap deck-diamond-wrap';diamondBody.append($('.diamond-lab'));
 const background=document.createElement('details');background.className='project-background';const summary=document.createElement('summary');summary.textContent='Project background, architecture & results ↗';background.append(summary,$('.diamond-project'),$('.engineering-notes'));diamondBody.append(background);
 const rideBody=wrap($('.rideshare-project'));
 const letters=document.createElement('div');letters.className='letters-and-cards wrap';
 const replies=document.createElement('div');replies.className='replies';replies.append($('.collection-heading'),$('.autograph-grid'));letters.append(replies,$('.cards-section'));
 const music=document.createElement('div');music.className='combined-music wrap';music.append($('.concert-card'),$('.eason-card'));
 const piano=$('.piano-section'),poker=$('.poker-feature'),football=$('.football-extras');
 make('home','Home',[home]);make('about','Experience & skills',[about]);make('diamond','Projects / Diamond agent',[diamondBody],'work');make('dispatch','Projects / Dispatch playground',[rideBody],'dispatch');
 make('piano','Off the clock / Piano',[wrap(piano)],'life');make('poker','Off the clock / Poker',[wrap(poker)],'poker');make('collection','Off the clock / Letters & cards',[letters],'letters');make('football','Off the clock / On the pitch',[wrap(football)],'football');
 const musicPage=make('music','Off the clock / Music',[music],'music');musicPage.classList.add('page-concert','page-songs');
 make('contact','Contact',[contact,footer],'contact-page');
 main.replaceChildren(...pages);document.body.classList.add('has-page-deck','native-page-deck');
 document.querySelectorAll('.project-background,.rideshare-copy details').forEach(details=>{
  const title=details.querySelector('summary').textContent,button=document.createElement('button');button.className='deck-detail-link text-link';button.textContent=title;
  const dialog=document.createElement('dialog');dialog.className='deck-detail-dialog';dialog.setAttribute('aria-label',title);
  const close=document.createElement('button');close.className='deck-detail-close';close.textContent='Close ×';close.addEventListener('click',()=>dialog.close());
  const heading=document.createElement('h3');heading.textContent=title;dialog.append(close,heading);
  [...details.children].filter(node=>node.tagName!=='SUMMARY').forEach(node=>dialog.append(node));
  details.replaceWith(button);document.body.append(dialog);button.addEventListener('click',()=>dialog.showModal());
 });
 const controls=document.createElement('nav');controls.className='deck-controls';controls.setAttribute('aria-label','Section navigation');
 const prev=document.createElement('button'),next=document.createElement('button'),count=document.createElement('span');prev.textContent='↑';next.textContent='↓';prev.setAttribute('aria-label','Previous section');next.setAttribute('aria-label','Next section');count.className='deck-count';controls.append(prev,count,next);document.body.append(controls);
 const menu=document.createElement('nav');menu.className='deck-dots';menu.setAttribute('aria-label','Jump to a section');
 let current=0;
 const fitPage=page=>{
  const stage=page.querySelector('.deck-stage'),body=page.querySelector('.deck-content');
  const fit=fitToScreen(body.scrollHeight,stage.clientHeight);body.style.transform=`scale(${fit.scale})`;body.style.top=`${fit.top}px`;page.dataset.fitScale=fit.scale.toFixed(3);
 };
 const fitAll=()=>pages.forEach(fitPage);
 const observer=new ResizeObserver(fitAll);pages.forEach(page=>observer.observe(page.querySelector('.deck-content')));
 window.addEventListener('resize',()=>{fitAll();main.scrollTo({top:pages[current].offsetTop,behavior:'instant'});});document.fonts?.ready.then(fitAll);
 const hashFor=index=>pages[index].id||pages[index].querySelector('[id]')?.id;
 const render=index=>{
  current=index;pages.forEach((p,i)=>p.classList.toggle('is-current',i===index));prev.disabled=index===0;next.disabled=index===pages.length-1;
  count.textContent=`${String(index+1).padStart(2,'0')} / ${String(pages.length).padStart(2,'0')} · ${pages[index].dataset.label}`;
  [...menu.children].forEach((b,i)=>b.setAttribute('aria-current',i===index?'page':'false'));
 };
 const show=(index,instant=false)=>{index=Math.max(0,Math.min(pages.length-1,index));render(index);main.scrollTo({top:pages[index].offsetTop,behavior:instant||matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
 pages.forEach((page,i)=>{const button=document.createElement('button');button.setAttribute('aria-label',page.dataset.label);button.title=page.dataset.label;button.addEventListener('click',()=>show(i));menu.append(button);});document.body.append(menu);
 const aliases={cards:'letters',songs:'music',concert:'music'};
 const pageForHash=hash=>{let id;try{id=decodeURIComponent(hash.replace(/^#/,''));}catch{return -1;}id=aliases[id]||id;const target=document.getElementById(id);return target?pages.findIndex(page=>page===target||page.contains(target)):-1;};
 prev.addEventListener('click',()=>show(current-1));next.addEventListener('click',()=>show(current+1));
 document.addEventListener('click',event=>{const anchor=event.target.closest('a[href^="#"]');if(!anchor)return;const index=pageForHash(anchor.getAttribute('href'));if(index<0)return;event.preventDefault();show(index);});
 window.addEventListener('hashchange',()=>{const i=pageForHash(location.hash);if(i>=0)show(i);});
 let frame=null;
 main.addEventListener('scroll',()=>{if(frame)return;frame=requestAnimationFrame(()=>{frame=null;const index=Math.max(0,Math.min(pages.length-1,Math.round(main.scrollTop/main.clientHeight)));render(index);const hash=hashFor(index);if(hash)history.replaceState(null,'','#'+hash);});},{passive:true});
 document.addEventListener('keydown',event=>{if($('dialog[open]')||event.target.closest('input,select,textarea,button,a,video,audio,summary'))return;if(['PageDown','ArrowDown','PageUp','ArrowUp'].includes(event.key)){event.preventDefault();show(current+(['PageDown','ArrowDown'].includes(event.key)?1:-1));}});
 fitAll();const initial=pageForHash(location.hash);show(initial>=0?initial:0,true);
}
