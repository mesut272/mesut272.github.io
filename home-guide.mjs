export function guidePosition(left,width,top,containerWidth){return {left:Math.max(0,Math.min(containerWidth-160,left+width/2-80)),top:top-64};}
export function initHomeGuide(){
 const paths=document.querySelector('.home-paths');if(!paths)return;
 const cards=[...paths.querySelectorAll('.home-path')];let selected=0;
 const guide=document.createElement('button');guide.className='home-guide';guide.type='button';guide.setAttribute('aria-label','Follow little Lexin to explore');
 // Code-native illustration: cap, glasses and a charcoal shirt inspired by Lexin.
 guide.innerHTML=`<svg viewBox="0 0 180 82" aria-hidden="true" focusable="false">
 <defs><clipPath id="guide-card-edge"><rect width="180" height="72"/></clipPath></defs>
 <ellipse cx="90" cy="74" rx="45" ry="3" fill="currentColor" opacity=".1"/>
 <g clip-path="url(#guide-card-edge)">
 <path d="M61 68Q63 53 90 53Q117 53 121 70L130 91H50Z" fill="#34313c" stroke="#211e28" stroke-width="2"/>
 <path d="M65 59Q51 60 48 70L57 75L79 66M112 59Q126 60 132 71L123 76L102 66" fill="#44404d" stroke="#211e28" stroke-width="2" stroke-linejoin="round"/>
 </g>
 <g class="guide-head" transform="translate(14 -2)"><path d="M48 30Q50 12 73 14Q97 16 100 39L96 52Q87 65 65 60Q48 56 48 39Z" fill="#e9bf9e" stroke="#5c4140" stroke-width="1.8"/>
 <path d="M49 35L46 45Q43 39 47 33M99 35Q107 33 104 43L98 47" fill="#dfae8f" stroke="#5c4140" stroke-width="1.6"/>
 <path d="M47 31Q45 6 73 5Q95 4 100 27L78 32Z" fill="#302d38" stroke="#211e28" stroke-width="2"/>
 <path d="M44 26Q63 20 91 27L109 32Q116 37 98 39L70 32Z" fill="#413c4b" stroke="#211e28" stroke-width="2"/>
 <path d="M75 11L74 18M78 15L71 15" stroke="#c0add8" stroke-width="1.5" stroke-linecap="round"/>
 <g class="guide-glasses" fill="#d9d7e625" stroke="#302c38" stroke-width="2.7"><rect x="51" y="36" width="19" height="13" rx="4"/><rect x="76" y="36" width="19" height="13" rx="4"/><path d="M70 40Q73 37 76 40M48 36L52 38M95 38L99 35" fill="none"/></g>
 <g class="guide-eyes" fill="#302c38"><circle cx="62" cy="42" r="1.9"/><circle cx="84" cy="42" r="1.9"/></g>
 <path d="M69 53Q76 58 83 51" fill="none" stroke="#8a514f" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="57" cy="51" rx="4" ry="2" fill="#d9948b" opacity=".45"/>
 </g>
 <path d="M55 67Q62 64 71 69L81 72Q85 78 77 79L56 77Q50 75 55 67Z" fill="#e5b996" stroke="#5c4140" stroke-width="1.6"/>
 <path d="M124 68Q118 64 110 68L99 72Q95 78 103 79L124 77Q130 75 124 68Z" fill="#e5b996" stroke="#5c4140" stroke-width="1.6"/>
 <path d="M59 70L58 75M64 70L63 76M120 70L121 75M115 70L116 76" stroke="#bb866d" stroke-width="1.1" stroke-linecap="round"/>
 </svg>`;
 paths.append(guide);
 const move=index=>{selected=index;const card=cards[index],p=guidePosition(card.offsetLeft,card.offsetWidth,card.offsetTop,paths.clientWidth);guide.style.left=`${p.left}px`;guide.style.top=`${p.top}px`;cards.forEach((c,i)=>c.classList.toggle('guide-choice',i===index));};
 cards.forEach((card,i)=>{card.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')move(i);});card.addEventListener('focus',()=>move(i));});
 guide.addEventListener('click',()=>cards[selected].click());
 const resize=new ResizeObserver(()=>move(selected));resize.observe(paths);cards.forEach(card=>resize.observe(card));
 move(0);
}
