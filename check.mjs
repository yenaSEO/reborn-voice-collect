// lib.js의 작은 함수들을 확인하는 자가 점검. 실행: node check.mjs
import assert from 'node:assert/strict';
import { SETS, extFor, baseMime, clipPath, cleanNickname, angelName, isKakaoAndroid } from './lib.js';

assert.equal(extFor('audio/webm;codecs=opus'), 'webm');
assert.equal(extFor('audio/mp4'), 'm4a');
assert.equal(baseMime('audio/webm;codecs=opus'), 'audio/webm');
assert.equal(baseMime(''), 'audio/webm');
assert.equal(clipPath('abc', 0, 2, 'prolong_front', 'm4a'), 'abc/1_3_prolong_front.m4a');
assert.equal(cleanNickname('  '), null);
assert.equal(cleanNickname(' 하늘 '), '하늘');
assert.equal(cleanNickname('가'.repeat(30)).length, 20);
assert.equal(angelName({ id: 7, nickname: null }), 'angel7');
assert.equal(angelName({ id: 7, nickname: '하늘' }), '하늘');
assert.ok(isKakaoAndroid('Mozilla/5.0 (Linux; Android 14) KAKAOTALK 10.8'));
assert.ok(!isKakaoAndroid('Mozilla/5.0 (iPhone) KAKAOTALK 10.8'));
for (const set of SETS) {
  assert.equal(set.length, 4);
  assert.equal(set[0].text, set[1].text, '정상과 작아짐은 같은 문장');
}
console.log('ok');
