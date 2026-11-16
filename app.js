import {initCardsCarousel} from './cards-carousel.mjs';
import {initLettersCarousel} from './letters-carousel.mjs';
import {initHomeGuide} from './home-guide.mjs?v=perch2';
import {initLanguages} from './i18n.js?v=headings3';
import {initConcertCarousel} from './concert-carousel.mjs';
import {initPageDeck} from './page-deck.js?v=portfolio9';
import {initAudioExperience} from './audio-ui.js?v=portfolio9';
import {initDispatch} from './dispatch-ui.js';
import {initDiamondLab} from './diamond-ui.js';
import { getScenario } from './agent-demo.mjs';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const themeToggle = $('#themeToggle');
let savedTheme;
try { savedTheme = localStorage.getItem('lexin-theme'); } catch {}
function setTheme(dark) {
 document.body.classList.toggle('dark', dark);
 themeToggle.textContent = dark ? '☀' : '☾';
 themeToggle.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
 document.querySelector('meta[name="theme-color"]').content = dark ? '#1c1a20' : '#faf8f4';
}
setTheme(savedTheme === 'dark');
themeToggle.addEventListener('click', () => {
 const dark = !document.body.classList.contains('dark');
 setTheme(dark);
 try { localStorage.setItem('lexin-theme', dark ? 'dark' : 'light'); } catch {}
});

let scenario = 'recommend';
let step = 0;
function renderScenario() {
 const flow = getScenario(scenario);
 const current = flow[step];
 const messages = $('#demoMessages');
 messages.replaceChildren();
 flow.slice(0, step + 1).forEach(item => {
  const message = document.createElement('div');
  message.className = `message ${item.speaker}`;
  const name = document.createElement('span');
  name.className = 'message-name';
  name.textContent = {customer:'Customer',agent:'Sales assistant',tool:'System / tool'}[item.speaker];
  const text = document.createElement('span');
  text.textContent = item.text;
  message.append(name,text);
  messages.append(message);
 });
 $('#traceTitle').textContent = current.label;
 $('#traceCode').textContent = current.trace;
 $('#traceDetail').textContent = current.detail;
 $('#traceState').textContent = current.state.replaceAll('_',' ');
 $('#traceState').classList.toggle('hold', ['PENDING_HUMAN_REVIEW','HUMAN_HANDOFF','REVIEW_FAILED'].includes(current.state));
 $('#stepCount').textContent = `Step ${step + 1} of ${flow.length}`;
 $('#demoNext').textContent = step === flow.length - 1 ? 'Replay scenario ↺' : 'Next step →';
 $$('.trace-progress i').forEach((item,index) => item.classList.toggle('done',index <= step));
 $$('[data-scenario]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scenario === scenario)));
}
$$('[data-scenario]').forEach(button => button.addEventListener('click', () => {
 scenario = button.dataset.scenario;
 step = 0;
 renderScenario();
}));
$('#demoNext').addEventListener('click', () => { step = (step + 1) % getScenario(scenario).length; renderScenario(); });
$('#demoReset').addEventListener('click', () => { step = 0; renderScenario(); });
renderScenario();

const galleries = {
 shirt:{category:'Football memorabilia',items:[{src:'messi-shirt.jpg',title:'A Messi shirt. A Barça heart.',caption:'A signed Messi Barcelona shirt from my collection. Twelve years of supporting Barça, and plenty of things worth keeping.',alt:'Blue signed Barcelona shirt with Messi 10 on the back'}]},
 album:{category:'On the shelf · Eason Chan',items:[{src:'eason-album.jpg',title:'A signed Eason Chan album',caption:'One of my favorite music keepsakes. The signature makes this copy a little more personal.',alt:'An Eason Chan album with a handwritten signature'}]},
 poker: {category:'At the table',items:[{src:'poker.jpg',title:'A local tournament win',caption:'Aces Poker, Seattle area. The winning hand: 7♣ 6♠. A favorite memory from hundreds of poker sessions.',alt:'Lexin holding seven of clubs and six of spades after his tournament win'},{src:'poker-chips.jpg',title:'Another night at the table',caption:'A photo from my poker sessions. Probability, patience, and a table full of decisions.',alt:'Stacks of poker chips on a table at Aces Poker'}]},
 letters: {category:'Letters that came back',items:[
  {src:'ozil.jpg',title:'Mesut Özil',caption:'Mesut Özil is my favorite footballer of all time. This signed photo is one of the replies I treasure most.',alt:'Upright framed signed photograph of Mesut Özil'},
  {src:'iniesta.jpg',title:'Andrés Iniesta',caption:'Two signed photos, kept together. A special part of my football collection.',alt:'Two signed Andrés Iniesta photographs'},
  {src:'barbossa.jpg',title:'Captain Barbossa',caption:'A signed photo from the actor behind Captain Barbossa, with a personal dedication: “To Lexin!”',alt:'Captain Barbossa signed photograph personally dedicated to Lexin'},
  {src:'neymar.jpg',title:'Neymar Jr.',caption:'Another favorite reply and a signed photo worth keeping.',alt:'Upright Neymar signed photograph'}
 ]},
 cards:{category:'The Özil pages',items:Array.from({length:9},(_,i)=>({src:`cards-${i+1}.jpg`,title:`Football card binder · Page ${i+1}`,caption:'A page from my Mesut Özil collection: different designs, parallels, autographs, and memorabilia cards. Browse with the arrows or your keyboard.',alt:`Page ${i+1} of Lexin’s Özil football card collection`}))},
 concert:{category:'Imagine Dragons',items:[
  {src:'dan.jpg',title:'A handshake with Dan',caption:'A moment from the front row at an Imagine Dragons concert.',alt:'Concert photograph from Lexin’s handshake with Dan'},
  {src:'concert.jpg',title:'From the front row',caption:'Another close-up memory from the concert.',alt:'A member of Imagine Dragons giving a thumbs-up on stage'},
  {src:'picks.jpg',title:'Two picks',caption:'Both personally given to me by members of the band. Small objects, very good memories.',alt:'Two concert picks in Lexin’s hand'},
  {src:'drumstick.jpg',title:'One drumstick',caption:'An Imagine Dragons drumstick, personally handed to me by a band member.',alt:'An Imagine Dragons branded concert drumstick'}
 ]},
 listening:{category:'On repeat · 2025',items:[{src:'listening.jpg',title:'Twelve months of Eason Chan',caption:'My 2025 listening report: Eason Chan was my most-listened artist in every single month.',alt:'2025 listening report showing Eason Chan as favorite artist for all twelve months'}]}
};
const media = {
 football:{src:'football.mp4',poster:'football-cover.jpg',title:'One last run. One more chance.',category:'High school · Eight-a-side semifinal',caption:'We were 1–2 down in the last minute. I dribbled past six players and assisted the equalizer. We went on to win the penalty shootout, then the final, and became champions.'},
 piano:{src:'piano.mp4',poster:'piano-poster.jpg',title:'Chopin · Heroic Polonaise, Op. 53',category:'At the piano',caption:'Performed by Lexin Yi. Piano has been part of my life since age five. This is my own recording.'},
 rideshare:{src:'rideshare.mp4',poster:'rideshare-poster.jpg',title:'AI-Assisted Dispatch Simulator',category:'Engineering project · Full recording',caption:'A 27-second recording of the original Chinese-language interface: submit an order, inspect the queue, and ask the assistant about a driver’s live state. The dispatch engine, cache, lock and index patterns run as a simulation.'}
};
const dialog = $('#mediaDialog');
let activeGallery = null;
let galleryIndex = 0;
let returnFocus = null;
function renderGallery() {
 const gallery = galleries[activeGallery];
 const item = gallery.items[galleryIndex];
 $('#dialogCategory').textContent = gallery.category;
 $('#dialogTitle').textContent = item.title;
 $('#dialogCaption').textContent = item.caption;
 const image = new Image();
 image.src = `assets/${item.src}`;
 image.alt = item.alt;
 $('#dialogContent').replaceChildren(image);
 $('#galleryCount').textContent = `${galleryIndex + 1} / ${gallery.items.length}`;
 $('#galleryControls').hidden = gallery.items.length === 1;
}
function openDialog(trigger) {
 returnFocus = trigger;
 dialog.showModal();
 document.body.style.overflow = 'hidden';
 $('.dialog-close').focus();
}
$$('[data-gallery]').forEach(button => button.addEventListener('click', () => {
 activeGallery = button.dataset.gallery;
 galleryIndex = Number(button.dataset.index || 0);
 renderGallery();
 openDialog(button);
}));
function changeImage(offset) {
 if(!activeGallery) return;
 const count = galleries[activeGallery].items.length;
 galleryIndex = (galleryIndex + offset + count) % count;
 renderGallery();
}
$('#galleryPrev').addEventListener('click', () => changeImage(-1));
$('#galleryNext').addEventListener('click', () => changeImage(1));
const audioExperience = initAudioExperience();
$$('[data-media]').forEach(button => button.addEventListener('click', () => {
 activeGallery = null;
 const mediaKind = button.dataset.media;
 const item = media[mediaKind];
 $('#dialogCategory').textContent = item.category;
 $('#dialogTitle').textContent = item.title;
 $('#dialogCaption').textContent = item.caption;
 $('#galleryControls').hidden = true;
 const video = document.createElement('video');
 video.src = `assets/${item.src}`;
 video.poster = `assets/${item.poster}`;
 video.controls = true;
 video.playsInline = true;
 video.preload = 'metadata';
 video.setAttribute('aria-label',item.title);
 audioExperience.attachVideo(video, mediaKind === 'piano');
 $('#dialogContent').replaceChildren(video);
 openDialog(button);
}));
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
 if(event.target !== dialog) return;
 const box = dialog.getBoundingClientRect();
 if(event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
 const video = $('#dialogContent video');
 if(video) { audioExperience.closeVideo(video); video.pause(); video.removeAttribute('src'); video.load(); }
 document.body.style.overflow = '';
 returnFocus?.focus();
});
dialog.addEventListener('keydown', event => {
 if(event.key === 'ArrowRight' && activeGallery) { event.preventDefault(); changeImage(1); }
 if(event.key === 'ArrowLeft' && activeGallery) { event.preventDefault(); changeImage(-1); }
});

let audio;
$$('[data-note]').forEach(button => button.addEventListener('click', () => {
 audioExperience.playKey();
 try {
  audio ||= new (window.AudioContext || window.webkitAudioContext)();
  audio.resume();
  const now = audio.currentTime;
  const output = audio.createGain();
  output.gain.setValueAtTime(.0001,now);
  output.gain.exponentialRampToValueAtTime(.13,now+.012);
  output.gain.exponentialRampToValueAtTime(.0001,now+1.3);
  output.connect(audio.destination);
  const keyVoices=[];
  [1,2,3].forEach((harmonic,index) => {
   const oscillator=audio.createOscillator();
   const level=audio.createGain();
   oscillator.type='sine';
   oscillator.frequency.value=Number(button.dataset.note)*harmonic;
   level.gain.value=[1,.3,.1][index];
   oscillator.connect(level);level.connect(output);
   oscillator.start(now);oscillator.stop(now+1.35);keyVoices.push(oscillator);
  });
  audioExperience.registerKeyStop(()=>{output.gain.cancelScheduledValues(audio.currentTime);output.gain.setValueAtTime(0,audio.currentTime);keyVoices.forEach(voice=>{try{voice.stop();}catch{}});});
 } catch { button.title='Audio is unavailable in this browser.'; }
}));

initDiamondLab();

initDispatch();

initPageDeck();

initConcertCarousel();
initLettersCarousel();
initCardsCarousel();
initHomeGuide();
initLanguages();
