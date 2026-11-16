import test from 'node:test';
import assert from 'node:assert/strict';
import {installAutoplayRetry} from '../autoplay-retry.mjs';
function setup(){
 const handlers={};let calls=0,paused=false;
 const player={state:'blocked',start(){calls++;this.state='playing';}};
 installAutoplayRetry({addEventListener(type,fn){handlers[type]=fn;}},player,()=>!paused);
 const click=(excluded=false,trusted=true)=>handlers.click({isTrusted:trusted,target:{closest:()=>excluded}});
 return {player,click,get calls(){return calls;},pause(){paused=true;player.state='paused';}};
}
test('a real first content click retries blocked autoplay exactly once',()=>{const s=setup();s.click();s.click();assert.equal(s.calls,1);});
test('audio controls and synthetic clicks do not trigger a competing start',()=>{const s=setup();s.click(true);s.click(false,false);assert.equal(s.calls,0);});
test('manual pause is respected on subsequent page clicks',()=>{const s=setup();s.pause();s.click();assert.equal(s.calls,0);});
