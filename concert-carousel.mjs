export function carouselIndex(index,direction,count){return ((index+direction)%count+count)%count;}
export function initConcertCarousel(){
 const hero=document.querySelector('.concert-hero');if(!hero)return;
 const slides=[
  {src:'dan.jpg',alt:'A handshake with Dan',caption:'A handshake with Dan. A night to keep.'},
  {src:'concert.jpg',alt:'From the front row',caption:'From the front row'},
  {src:'picks.jpg',alt:'Two picks',caption:'Both personally given to me by members of the band. Small objects, very good memories.'},
  {src:'drumstick.jpg',alt:'One drumstick',caption:'An Imagine Dragons drumstick, personally handed to me by a band member.'}
 ];
 let index=0;const wrapper=document.createElement('div');wrapper.className='concert-carousel';hero.replaceWith(wrapper);wrapper.append(hero);
 const prev=document.createElement('button'),next=document.createElement('button'),count=document.createElement('span');
 prev.type=next.type='button';prev.className='concert-arrow concert-prev';next.className='concert-arrow concert-next';prev.textContent='‹';next.textContent='›';prev.setAttribute('aria-label','Previous photo');next.setAttribute('aria-label','Next photo');count.className='concert-count';count.setAttribute('aria-live','polite');wrapper.append(prev,next,count);
 const render=()=>{const item=slides[index],image=hero.querySelector('img');image.src=`assets/${item.src}`;image.alt=item.alt;hero.dataset.index=String(index);hero.querySelector('.concert-overlay small').textContent=item.caption;count.textContent=`${index+1} / ${slides.length}`;};
 const change=delta=>{index=carouselIndex(index,delta,slides.length);render();};prev.addEventListener('click',()=>change(-1));next.addEventListener('click',()=>change(1));
 wrapper.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();change(event.key==='ArrowRight'?1:-1);}});
 document.querySelectorAll('.concert-keepsakes .keepsake').forEach((button,i)=>{const replacement=button.cloneNode(true);replacement.removeAttribute('data-gallery');replacement.removeAttribute('data-index');button.replaceWith(replacement);replacement.addEventListener('click',()=>{index=i+2;render();});});
 render();
}
