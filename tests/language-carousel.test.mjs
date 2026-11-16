import test from 'node:test';
import assert from 'node:assert/strict';
import {translateText} from '../zh-CN.mjs';
import {carouselIndex} from '../concert-carousel.mjs';
test('navigation and technical content have Chinese translations',()=>{assert.equal(translateText('Experience & skills','zh'),'经历与技能');assert.equal(translateText('Backend & systems','zh'),'后端与系统');assert.equal(translateText('Java','zh'),'Java');});
test('dynamic agent and dispatch results translate while preserving their numbers',()=>{assert.match(translateText('I found 2 options. Select one below. You can also change the requirements and see the search update.','zh'),/2 个选项/);assert.equal(translateText('Ride 3 is waiting. All three drivers are busy.','zh'),'订单 3 正在排队，三位司机均忙碌。');});
test('English and surrounding whitespace are preserved',()=>{assert.equal(translateText('  Experience  ','en'),'  Experience  ');assert.equal(translateText('  Experience  ','zh'),'  经历与技能  ');});
test('carousel moves both ways and wraps at either end',()=>{assert.equal(carouselIndex(0,1,4),1);assert.equal(carouselIndex(0,-1,4),3);assert.equal(carouselIndex(3,1,4),0);});
test('revised Chinese headings read naturally without changing English copy',()=>{
 const pairs=[['Before I wrote code,','从五岁开始，'],['I played Chopin.','钢琴陪我长大。'],['Good decisions.','牌局有输赢，'],['Imperfect information.','决策有学问。'],['Some people collect tabs.','关于足球的热爱，'],['I also collect cards.','一张张收藏起来。'],['Let’s build','期待与你'],['something','一起把想法'],['useful.','变成现实。']];
 for(const [en,cn] of pairs){assert.equal(translateText(en,'zh'),cn);assert.equal(translateText(en,'en'),en);}
});
