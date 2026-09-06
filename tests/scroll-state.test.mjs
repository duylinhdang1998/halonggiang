import { test } from 'node:test';
import assert from 'node:assert/strict';
import { revealProgress, activeChapter } from '../lib/scroll-state.mjs';

test('wireframe at the top, full material at the last chapter', () => {
  assert.equal(revealProgress(0, 5000), 0);
  assert.equal(revealProgress(2500, 5000), .5);
  assert.equal(revealProgress(5000, 5000), 1);
});
test('clamp elastic overscroll and reject invalid geometry', () => {
  for (const [top, end] of [[-100,5000],[1,0],[1,-1],[NaN,5],[5,Infinity]]) assert.equal(revealProgress(top,end),0);
  assert.equal(revealProgress(6000,5000),1);
});
test('scrolling back reverses material continuously', () => {
  const positions = [5000,4000,3000,2000,1000,0];
  assert.deepEqual(positions.map(top=>revealProgress(top,5000)),[1,.8,.6,.4,.2,0]);
});
test('active chapter uses reading position across variable section heights', () => {
  const starts=[0,900,2100,3100,4100,5400];
  assert.equal(activeChapter(0,starts,900),0);
  assert.equal(activeChapter(900,starts,900),1);
  assert.equal(activeChapter(5400,starts,900),5);
  assert.equal(activeChapter(0,[],900),0);
});
