import test from 'node:test';
import assert from 'node:assert/strict';
import {fitToScreen} from '../screen-fit.mjs';
test('oversized pages fit wholly within the available stage',()=>{const fit=fitToScreen(600,500);assert.equal(fit.scale,5/6);assert.equal(fit.top,0);assert.ok(600*fit.scale<=500);});
test('short pages remain full size and are centered',()=>{assert.deepEqual(fitToScreen(300,500),{scale:1,top:100});});
test('zero dimensions never produce infinite or negative sizing',()=>{assert.deepEqual(fitToScreen(0,0),{scale:1,top:0});});
