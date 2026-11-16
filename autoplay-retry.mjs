// Invoke play synchronously inside trusted activation events, before widgets
// handle them. Explicit media controls retain their own playback behavior.
export function installAutoplayRetry(target,player,canStart){
 const retry=event=>{
  if(!event.isTrusted||event.target?.closest?.('.soundtrack-player,[data-media],[data-performance],[data-note],.month-buttons,#songPlay,dialog'))return;
  if(event.type==='pointerdown'&&event.pointerType!=='mouse')return;
  if(event.type==='pointerup'&&event.pointerType==='mouse')return;
  if(event.type==='keydown'&&(event.repeat||event.ctrlKey||event.metaKey||event.altKey||['Shift','Control','Alt','Meta','Escape','Tab'].includes(event.key)||event.target?.closest?.('input,textarea,select,[contenteditable="true"]')))return;
  if(player.state!=='playing'&&player.state!=='error'&&canStart())void player.start();
 };
 for(const type of ['pointerdown','pointerup','click','keydown'])target.addEventListener(type,retry,{capture:true,passive:true});
}
