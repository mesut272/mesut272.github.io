import test from 'node:test';import assert from 'node:assert/strict';
import {languageResources} from '../language-resources.mjs';
import {shortScrollTarget} from '../scroll-assist.mjs';
test('Chinese and English select independent resumes and contact addresses',()=>{assert.deepEqual(languageResources('zh'),{resume:'assets/Lexin-Yi-Resume-ZH.pdf',email:'1187304321@qq.com'});assert.equal(languageResources('en').email,'yi.l@northeastern.edu');assert.equal(languageResources('en').resume,'assets/Lexin-Yi-Resume.pdf');});
test('short gestures can advance or reverse without requiring half a screen',()=>{assert.equal(shortScrollTarget(3,70,11),4);assert.equal(shortScrollTarget(3,-70,11),2);assert.equal(shortScrollTarget(3,15,11),3);assert.equal(shortScrollTarget(0,-70,11),0);});
