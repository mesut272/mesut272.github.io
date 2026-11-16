import {carouselIndex} from './concert-carousel.mjs';
export function initLettersCarousel(){
 const grid=document.querySelector('.autograph-grid');if(!grid)return;
 const cards=[...grid.querySelectorAll('.autograph-card')];let index=0;
 const wrapper=document.createElement('div');wrapper.className='letters-carousel';wrapper.setAttribute('aria-label','Letters that came back');grid.replaceWith(wrapper);wrapper.append(grid);
 const prev=document.createElement('button'),next=document.createElement('button'),count=document.createElement('span');
 prev.type=next.type='button';prev.className='concert-arrow letters-prev';next.className='concert-arrow letters-next';prev.textContent='‹';next.textContent='›';prev.setAttribute('aria-label','Previous signed photo');next.setAttribute('aria-label','Next signed photo');
 count.className='letters-count';count.setAttribute('aria-live','polite');wrapper.append(prev,next,count);
 const render=()=>{cards.forEach((card,i)=>{card.hidden=i!==index;});count.textContent=`${index+1} / ${cards.length}`;};
 const change=direction=>{const focused=cards[index].contains(document.activeElement);index=carouselIndex(index,direction,cards.length);render();if(focused)cards[index].focus();};
 prev.addEventListener('click',()=>change(-1));next.addEventListener('click',()=>change(1));
 wrapper.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();change(event.key==='ArrowRight'?1:-1);}});
 render();
}
