import test from 'node:test';
import assert from 'node:assert/strict';
import {guidePosition} from '../home-guide.mjs';
test('the guide perches on its selected card without crossing the right edge',()=>{assert.deepEqual(guidePosition(0,360,0,1120),{left:100,top:-64});assert.ok(guidePosition(770,350,0,1120).left+160<=1120);});
test('stacked mobile cards move the guide down to the selected row',()=>{assert.equal(guidePosition(0,320,120,320).top,56);});
