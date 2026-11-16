export function createSoundtrack(media,onChange=()=>{}){
 let state='paused';let resume=false;let generation=0;
 const publish=value=>{state=value;onChange(value);};
 media.addEventListener('play',()=>publish('playing'));
 media.addEventListener('pause',()=>{if(state!=='blocked'&&state!=='error')publish('paused');});
 media.addEventListener('error',()=>publish('error'));
 const start=async()=>{const attempt=++generation;publish('loading');try{await media.play();if(attempt!==generation)return false;publish('playing');return true;}catch{if(attempt===generation)publish(media.error?'error':'blocked');return false;}};
 return {
  get state(){return state;},get position(){return Number.isFinite(media.currentTime)?media.currentTime:0;},
  start,
  pause(){generation++;resume=false;media.pause();publish('paused');},
  suspendForVideo({resumeIfNotPlaying=false}={}){resume=resume||!media.paused||resumeIfNotPlaying;generation++;media.pause();},
  async resumeAfterVideo(){const shouldResume=resume;resume=false;if(shouldResume)return start();return false;},
  seekTo(time){if(Number.isFinite(time)&&time>=0){try{media.currentTime=time;}catch{}}}
 };
}
