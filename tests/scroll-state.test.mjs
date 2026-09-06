import {test} from 'node:test';
import assert from 'node:assert/strict';
import {timelineState,cardMotion,clampZoom,chapterProgress} from '../lib/scroll-state.mjs';

test('intro starts without cards and with wireframe',()=>{
 const s=timelineState(0); assert.equal(s.active,0); assert.equal(s.reveal,0); assert.equal(s.intro,1); assert.equal(cardMotion(0,0,'left').opacity,0);
});
test('lines draw before a card becomes visible',()=>{
 const s=cardMotion(.139,0,'left'); assert.ok(s.line>0);assert.equal(s.opacity,0);
 const shown=cardMotion(.19,0,'left');assert.equal(shown.opacity,1);assert.equal(shown.line,1);
});
test('paired cards stagger, reverse deterministically and persist at the end',()=>{
 assert.ok(cardMotion(.16,0,'left').opacity>cardMotion(.16,0,'right').opacity);
 assert.equal(cardMotion(.42,0,'left').opacity,0);
 assert.equal(cardMotion(1,4,'left').opacity,1);assert.equal(cardMotion(1,4,'right').opacity,1);
 assert.deepEqual(timelineState(.5),timelineState(.5));assert.equal(timelineState(1).reveal,1);
});
test('timeline and zoom clamp invalid and out-of-bounds values',()=>{
 assert.equal(timelineState(-2).active,0);assert.equal(timelineState(NaN).reveal,0);
 assert.equal(timelineState(2).active,5);assert.equal(clampZoom(3),1.35);assert.equal(clampZoom(.1),.8);assert.equal(clampZoom(NaN),1);
 assert.equal(chapterProgress(0),0);assert.ok(chapterProgress(5)<1);assert.equal(chapterProgress(99),chapterProgress(5));
});

test('card exits before its connector retracts, content enters after shell',()=>{
 const entering=cardMotion(.15,0,'left');assert.ok(entering.opacity>entering.content);assert.ok(entering.fold>0&&entering.fold<1);
 const leaving=cardMotion(.283,0,'left');assert.equal(leaving.phase,'exit');assert.ok(leaving.line>leaving.opacity);
 const retracted=cardMotion(.311,0,'left');assert.equal(retracted.line,0);assert.equal(retracted.content,0);
 const invalid=cardMotion(.5,99,'left');assert.equal(invalid.phase,'hidden');assert.equal(invalid.opacity,0);
});

test('mobile cards fade out and in around their handover',()=>{
 assert.equal(cardMotion(.205,0,'left').mobileOpacity,1);
 assert.ok(cardMotion(.22,0,'left').mobileOpacity<1);
 assert.equal(cardMotion(.22,0,'right').mobile,false);
 assert.ok(cardMotion(.236,0,'right').mobileOpacity>0);
 assert.ok(cardMotion(.236,0,'right').mobileOpacity<1);
});
