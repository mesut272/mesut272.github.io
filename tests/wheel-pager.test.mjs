import test from 'node:test';
import assert from 'node:assert/strict';
import {createWheelPager} from '../wheel-pager.mjs';
test('small accidental motion stays on the current page',()=>{const g=createWheelPager();assert.equal(g.feed(8,1000),0);assert.equal(g.feed(12,1040),0);});
test('a deliberate scroll turns once, and its momentum cannot turn again',()=>{const g=createWheelPager();let turns=[];for(let t=1000;t<3000;t+=50)turns.push(g.feed(70,t));assert.deepEqual(turns.filter(Boolean),[1]);assert.equal(g.feed(70,3400),0);assert.equal(g.feed(70,3450),0);assert.equal(g.feed(70,3500),0);assert.equal(g.feed(70,3550),1);});
test('reversing direction clears accumulated distance',()=>{const g=createWheelPager();g.feed(70,1000);g.feed(70,1050);assert.equal(g.feed(-70,1100),0);assert.equal(g.feed(-70,1150),0);assert.equal(g.feed(-70,1200),0);assert.equal(g.feed(-70,1250),-1);});
test('scrolling inside a long block cannot spill into the next page',()=>{const g=createWheelPager();g.feed(100,1000,false);for(let t=1050;t<2000;t+=50)assert.equal(g.feed(100,t),0);assert.equal(g.feed(70,2400),0);assert.equal(g.feed(70,2450),0);assert.equal(g.feed(70,2500),0);assert.equal(g.feed(70,2550),1);});
test('new sections have a minimum reading dwell and ignore carried motion',()=>{const g=createWheelPager();g.hold(1000);for(let t=1100;t<2500;t+=50)assert.equal(g.feed(100,t),0);assert.equal(g.feed(70,2900),0);assert.equal(g.feed(70,2950),0);assert.equal(g.feed(70,3000),0);assert.equal(g.feed(70,3050),1);});
