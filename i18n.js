import {translateText} from './zh-CN.mjs?v=guide1';
export function initLanguages(){
 let language='en';try{language=localStorage.getItem('lexin-language')==='zh'?'zh':'en';}catch{}
 const records=new WeakMap(),attributes=new WeakMap();
 const switcher=document.createElement('div');switcher.className='language-switch';switcher.dataset.noTranslate='';switcher.setAttribute('aria-label','Language / 语言');
 const buttons=['en','zh'].map(code=>{const b=document.createElement('button');b.type='button';b.textContent=code==='en'?'EN':'中文';b.lang=code==='en'?'en':'zh-CN';b.addEventListener('click',()=>setLanguage(code));switcher.append(b);return b;});
 document.querySelector('.site-header').insertBefore(switcher,document.querySelector('#themeToggle'));
 const original=(map,node,current)=>{const record=map.get(node);return record&&current===record.translated?record.source:current;};
 const apply=()=>{
  // Option labels may be translated, but their programmatic values must not change.
  document.querySelectorAll('option:not([value])').forEach(option=>option.setAttribute('value',option.value));
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
   const node=walker.currentNode;if(node.parentElement?.closest('script,style,code,[data-no-translate]'))continue;
   const source=original(records,node,node.nodeValue),translated=translateText(source,language);records.set(node,{source,translated});if(node.nodeValue!==translated)node.nodeValue=translated;
  }
  document.querySelectorAll('[aria-label],[title],[alt]').forEach(el=>{
   if(el.closest('[data-no-translate]'))return;
   let map=attributes.get(el);if(!map){map=new Map();attributes.set(el,map);}
   for(const name of ['aria-label','title','alt']){if(!el.hasAttribute(name))continue;const value=el.getAttribute(name),record=map.get(name),source=record&&value===record.translated?record.source:value,translated=translateText(source,language);map.set(name,{source,translated});if(value!==translated)el.setAttribute(name,translated);}
  });
 };
 const setLanguage=code=>{
  language=code;document.documentElement.lang=code==='zh'?'zh-CN':'en';document.documentElement.classList.toggle('lang-zh',code==='zh');
  document.querySelector('meta[name="description"]').content=code==='zh'?'易乐欣，专注于 AI 应用与可靠智能体工作流的软件工程师。探索项目、专业经历、钢琴演奏与个人收藏。':'Lexin Yi is a software engineer focused on AI applications and reliable agent workflows. Explore selected projects, piano performances, and personal collections.';
  document.title=code==='zh'?'易乐欣 — 软件工程、智能体与热爱':'Lexin Yi — Software, agents & a few other things';
  buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(['en','zh'][i]===code)));
  try{localStorage.setItem('lexin-language',code);}catch{}
  apply();
 };
 let scheduled=false;
 const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;apply();});});
 observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','alt']});
 setLanguage(language);
}
