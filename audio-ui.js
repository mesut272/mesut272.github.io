import {installAutoplayRetry} from './autoplay-retry.mjs?v=gesture3';
import {getPreviewWindow} from './preview-window.mjs';
import {createSoundtrack} from './soundtrack.mjs';
import {easonTracks} from './eason-tracks.mjs';
export function initAudioExperience(){
 const $=s=>document.querySelector(s),bgm=$('#pianoBgm');bgm.volume=.25;
 const preview=new Audio();preview.id='songPreview';preview.hidden=true;preview.preload='none';preview.volume=.55;document.body.append(preview);
 let selected=0,stopTimer=null,previewToken=0,videoActive=false,keyTimer=null,previewWindow={start:0,end:14,duration:14},stallTimer=null,previewActive=false,stopActiveKey=()=>{};
 let bgmExplicitlyOff=false;
 const cancelKey=()=>{clearTimeout(keyTimer);stopActiveKey();stopActiveKey=()=>{};};
 const rememberOff=off=>{bgmExplicitlyOff=off;};
 const player=createSoundtrack(bgm,state=>{
  const playing=state==='playing';const active=playing||state==='loading';$('#soundtrackLabel').textContent='Heroic Polonaise, Op. 53';$('#soundtrackPause').textContent=active?'Pause':'Play';$('#soundtrackPause').setAttribute('aria-label',active?'Pause piano background music':'Play piano background music');$('#soundtrackPause').title=active?'Pause':'Play';
  $('#soundtrackIcon').textContent=playing?'Ⅱ':'▶';$('#soundtrackToggle').setAttribute('aria-label',playing?'Pause piano background music':'Play piano background music');$('#soundtrackToggle').setAttribute('aria-pressed',String(playing));$('.soundtrack-player').classList.toggle('is-playing',playing);
 });
 const resetPreviewUI=()=>{$('#songPlay').textContent='Play song preview ▶';$('#songPlay').setAttribute('aria-pressed','false');};
 const stopPreview=(resume=true)=>{previewToken++;previewActive=false;clearTimeout(stallTimer);clearTimeout(stopTimer);stopTimer=null;preview.pause();resetPreviewUI();if(resume&&!videoActive)player.resumeAfterVideo();};
 const toggleSoundtrack=()=>{cancelKey();if(player.state==='playing'||player.state==='loading'){rememberOff(true);player.pause();}else{rememberOff(false);stopPreview(false);const video=document.querySelector('dialog video');if(video&&!video.paused)video.pause();player.start();}};
 $('#soundtrackToggle').addEventListener('click',toggleSoundtrack);
 $('#soundtrackPause').addEventListener('click',toggleSoundtrack);
 $('#soundtrackVolume').addEventListener('input',e=>{bgm.volume=Number(e.target.value);});
 document.querySelectorAll('[data-performance]').forEach(button=>button.addEventListener('click',async()=>{
  cancelKey();stopPreview(false);rememberOff(false);if(player.state!=='playing')await player.start();
  $('#performanceTitle').textContent=player.state==='playing'?'You’re listening to it.':'The soundtrack is my performance.';
  $('#performanceReveal').hidden=false;$('#performanceReveal').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});
 }));
 const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
 const renderTrack=()=>{
  const track=easonTracks[selected];$('#selectedMonth').textContent=months[selected].toUpperCase();$('#songTitle').textContent=track.title;$('#songAlbum').textContent=track.album;$('#songCover').src=track.cover;$('#songCover').alt=`${track.album} — ${track.title}, Eason Chan`;
  $('#songStoreLink').href=track.url;$('#songStoreLink').setAttribute('aria-label',`Listen to ${track.title} by Eason Chan on Apple Music`);$('#songProgress').style.width='0%';
  document.querySelectorAll('.month-buttons button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===selected)));
 };
 const finishPreview=message=>{stopPreview();$('#songStatus').textContent=message;};
 const playPreview=async()=>{
  cancelKey();
  stopPreview(false);previewActive=true;const token=++previewToken;player.suspendForVideo();previewWindow=getPreviewWindow(easonTracks[selected],30);$('#songStatus').textContent='Loading official preview…';
  preview.onloadedmetadata=()=>{if(token!==previewToken)return;previewWindow=getPreviewWindow(easonTracks[selected],preview.duration);preview.currentTime=previewWindow.start;};
  preview.src=easonTracks[selected].preview;
  stopTimer=setTimeout(()=>{if(token!==previewToken)return;finishPreview('Preview could not load. Open the full track on Apple Music.');},15000);
  try{
   await preview.play();if(token!==previewToken)return;clearTimeout(stopTimer);stopTimer=null;
   $('#songPlay').textContent='Pause preview Ⅱ';$('#songPlay').setAttribute('aria-pressed','true');$('#songStatus').textContent='Official song preview';
  }catch{if(token!==previewToken)return;finishPreview('Preview unavailable here. Open the track on Apple Music.');}
 };
 months.forEach((month,i)=>{const b=document.createElement('button');b.textContent=month.slice(0,3);b.setAttribute('aria-label',`Play ${month} favorite: ${easonTracks[i].title}`);b.setAttribute('aria-pressed',String(i===0));b.addEventListener('click',()=>{selected=i;renderTrack();playPreview();});$('.month-buttons').append(b);});
 $('#songPlay').addEventListener('click',()=>{if(!preview.paused){stopPreview();$('#songStatus').textContent='Preview paused.';}else playPreview();});
 preview.addEventListener('timeupdate',()=>{if(preview.paused)return;clearTimeout(stallTimer);const elapsed=Math.max(0,preview.currentTime-previewWindow.start);$('#songProgress').style.width=`${Math.min(100,elapsed/previewWindow.duration*100)}%`;if(preview.currentTime>=previewWindow.end)finishPreview('Preview finished. Hear the full track on Apple Music.');});
 preview.addEventListener('ended',()=>finishPreview('Preview finished. Hear the full track on Apple Music.'));
 const watchStall=()=>{if(!previewActive)return;clearTimeout(stallTimer);stallTimer=setTimeout(()=>{if(previewActive)finishPreview('Preview interrupted. Open the full track on Apple Music.');},10000);};
 preview.addEventListener('waiting',watchStall);preview.addEventListener('stalled',watchStall);preview.addEventListener('playing',()=>clearTimeout(stallTimer));preview.addEventListener('error',()=>{if(previewActive)finishPreview('Preview unavailable. Open the full track on Apple Music.');});
 renderTrack();
 installAutoplayRetry(document,player,()=>!bgmExplicitlyOff&&!previewActive&&!videoActive);
 player.start();
 return {
  registerKeyStop(stop){stopActiveKey=stop;},
  playKey(){
   cancelKey();stopPreview(false);player.suspendForVideo();keyTimer=setTimeout(()=>{if(!videoActive)player.resumeAfterVideo();},1500);
  },
  attachVideo(video,piano){
   const startAt=piano?player.position:0;
   video.addEventListener('loadedmetadata',()=>{if(piano&&startAt>0&&startAt<video.duration)video.currentTime=startAt;});
   video.addEventListener('play',()=>{cancelKey();videoActive=true;stopPreview(false);player.suspendForVideo();});
   video.addEventListener('ended',()=>{videoActive=false;if(piano)player.seekTo(0);player.resumeAfterVideo();});
   video.dataset.piano=String(piano);
  },
  closeVideo(video){if(video.dataset.piano==='true'&&video.currentTime>0)player.seekTo(video.currentTime);videoActive=false;player.resumeAfterVideo();}
 };
}
