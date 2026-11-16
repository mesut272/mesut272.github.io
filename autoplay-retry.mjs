// Retry within a trusted click, where browsers grant audio playback permission.
// Let explicit sound/video controls manage their own playback instead.
export function installAutoplayRetry(target,player,canStart){
 target.addEventListener('click',event=>{
  if(!event.isTrusted||event.target?.closest?.('.soundtrack-player,[data-media],[data-performance],[data-note],.month-buttons,#songPlay,dialog'))return;
  if(player.state==='blocked'&&canStart())void player.start();
 });
}
