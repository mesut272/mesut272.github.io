import {carouselIndex} from './concert-carousel.mjs';
export function initCardsCarousel(){
 const button=document.querySelector('.binder-preview');if(!button)return;
 button.querySelector('.binder-back')?.remove();button.querySelector('.binder-sticker')?.remove();
 const image=button.querySelector('img');let index=0;
 const wrapper=document.createElement('div');wrapper.className='cards-carousel';button.replaceWith(wrapper);wrapper.append(button);
 const prev=document.createElement('button'),next=document.createElement('button'),count=document.createElement('span');prev.type=next.type='button';prev.className='concert-arrow cards-prev';next.className='concert-arrow cards-next';prev.textContent='‹';next.textContent='›';prev.setAttribute('aria-label','Previous card page');next.setAttribute('aria-label','Next card page');count.className='cards-count';count.setAttribute('aria-live','polite');wrapper.append(prev,next,count);
 const render=()=>{image.src=`assets/cards-${index+1}.jpg`;button.dataset.index=String(index);count.textContent=`${index+1} / 9`;};
 const change=direction=>{index=carouselIndex(index,direction,9);render();};prev.addEventListener('click',()=>change(-1));next.addEventListener('click',()=>change(1));wrapper.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();change(event.key==='ArrowRight'?1:-1);}});render();
}
