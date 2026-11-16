export function guidePosition(left,width,top,containerWidth){return {left:Math.max(0,Math.min(containerWidth-160,left+width/2-80)),top:top-64};}
export function initHomeGuide(){
 const paths=document.querySelector('.home-paths');if(!paths)return;
 const cards=[...paths.querySelectorAll('.home-path')];let selected=0;
 const guide=document.createElement('button');guide.className='home-guide';guide.type='button';guide.setAttribute('aria-label','Follow little Lexin to explore');
 // Code-native illustration: cap, glasses and a charcoal shirt inspired by Lexin.
 guide.innerHTML=`<span class="guide-speech">Pick a path. I’ll bring the piano.</span><svg viewBox="0 0 180 82" aria-hidden="true" focusable="false">
 <ellipse cx="97" cy="75" rx="72" ry="5" fill="currentColor" opacity=".1"/>
 <g class="guide-body"><path d="M100 47 Q124 34 150 48 L167 61 Q175 67 163 72 L112 70Z" fill="#34313c" stroke="#211e28" stroke-width="2"/>
 <path d="M141 50L167 45Q174 44 176 51L173 58L152 64" fill="#35323d" stroke="#211e28" stroke-width="2"/><path d="M172 46L179 49L177 59L169 58Z" fill="#cec3de" stroke="#211e28" stroke-width="2"/>
 <path d="M102 52Q85 54 83 66L66 68Q59 70 65 74L90 74Q103 72 112 61" fill="#44404d" stroke="#211e28" stroke-width="2"/>
 <path d="M67 67Q57 65 53 69Q51 76 62 77L74 75L73 69Z" fill="#e5b996" stroke="#5c4140" stroke-width="1.6"/>
 <path d="M104 56L104 69Q105 75 94 76L79 76Q72 73 77 69L88 68L87 57" fill="#34313c" stroke="#211e28" stroke-width="2"/>
 <path d="M90 68Q85 66 79 68L74 72Q72 77 80 78L95 77Q99 72 96 69Z" fill="#e5b996" stroke="#5c4140" stroke-width="1.6"/>
 <g class="guide-head"><path d="M48 30Q50 12 73 14Q97 16 100 39L96 52Q87 65 65 60Q48 56 48 39Z" fill="#e9bf9e" stroke="#5c4140" stroke-width="1.8"/>
 <path d="M49 35L46 45Q43 39 47 33M99 35Q107 33 104 43L98 47" fill="#dfae8f" stroke="#5c4140" stroke-width="1.6"/>
 <path d="M47 31Q45 6 73 5Q95 4 100 27L78 32Z" fill="#302d38" stroke="#211e28" stroke-width="2"/>
 <path d="M44 26Q63 20 91 27L109 32Q116 37 98 39L70 32Z" fill="#413c4b" stroke="#211e28" stroke-width="2"/>
 <path d="M75 11L74 18M78 15L71 15" stroke="#c0add8" stroke-width="1.5" stroke-linecap="round"/>
 <g class="guide-glasses" fill="#d9d7e625" stroke="#302c38" stroke-width="2.7"><rect x="51" y="36" width="19" height="13" rx="4"/><rect x="76" y="36" width="19" height="13" rx="4"/><path d="M70 40Q73 37 76 40M48 36L52 38M95 38L99 35" fill="none"/></g>
 <g class="guide-eyes" fill="#302c38"><circle cx="62" cy="42" r="1.9"/><circle cx="84" cy="42" r="1.9"/></g>
 <path d="M69 53Q76 58 83 51" fill="none" stroke="#8a514f" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="57" cy="51" rx="4" ry="2" fill="#d9948b" opacity=".45"/>
 </g></g><path class="guide-note" d="M27 29V17L37 15V26M27 29c-6-3-10 5-3 5c3 0 3-3 3-5M37 26c-6-3-10 5-3 5c3 0 3-3 3-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
 </svg>`;
 paths.append(guide);
 const move=index=>{selected=index;const card=cards[index],p=guidePosition(card.offsetLeft,card.offsetWidth,card.offsetTop,paths.clientWidth);guide.style.left=`${p.left}px`;guide.style.top=`${p.top}px`;guide.classList.toggle('guide-at-end',index===cards.length-1);cards.forEach((c,i)=>c.classList.toggle('guide-choice',i===index));};
 cards.forEach((card,i)=>{card.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')move(i);});card.addEventListener('focus',()=>move(i));});
 guide.addEventListener('click',()=>cards[selected].click());
 const resize=new ResizeObserver(()=>move(selected));resize.observe(paths);cards.forEach(card=>resize.observe(card));
 move(0);
}
