// lib.js의 작은 함수들을 확인하는 자가 점검. 실행: node check.mjs
import assert from 'node:assert/strict';
import { SCRIPTS, missionsFor, splitStretch, shuffled, extFor, baseMime, clipPath, cleanNickname, defaultNick, ro, letter, labelAngels, isKakaoAndroid, isIOS } from './lib.js';

assert.equal(extFor('audio/webm;codecs=opus'), 'webm');
assert.equal(extFor('audio/mp4'), 'm4a');
assert.equal(baseMime('audio/webm;codecs=opus'), 'audio/webm');
assert.equal(baseMime(''), 'audio/webm');
assert.equal(clipPath('abc', 0, 2, 'prolong_front', 'm4a'), 'abc/1_3_prolong_front.m4a');
assert.equal(cleanNickname('  '), null);
assert.equal(cleanNickname(' 하늘 '), '하늘');
assert.equal(cleanNickname('가'.repeat(30)).length, 20);
assert.equal(defaultNick('male', () => 0), '박보검');
assert.equal(defaultNick('female', () => 0.99), '신세경');
assert.equal(defaultNick('none', () => 0), '수달');
assert.deepEqual(['장원영', '카리나', '하늘', '천사님'].map(ro), ['으로', '로', '로', '으로']);
assert.deepEqual([0, 1, 25, 26, 27, 701, 702].map(letter), ['A', 'B', 'Z', 'AA', 'AB', 'ZZ', 'AAA']);
assert.deepEqual(labelAngels([
  { id: 1, nickname: '박보검' }, { id: 2, nickname: '하늘' }, { id: 3, nickname: '장원영' },
  { id: 4, nickname: '박보검' }, { id: 5, nickname: null },
]).map((r) => r.name), ['박보검', '하늘', '장원영', '박보검 B', '천사님']);
assert.ok(isKakaoAndroid('Mozilla/5.0 (Linux; Android 14) KAKAOTALK 10.8'));
assert.ok(!isKakaoAndroid('Mozilla/5.0 (iPhone) KAKAOTALK 10.8'));
assert.ok(isIOS('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0) KAKAOTALK'));
assert.ok(isIOS('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', 5)); // 아이패드
assert.ok(!isIOS('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)', 0)); // 진짜 맥
assert.ok(!isIOS('Mozilla/5.0 (Linux; Android 14) KAKAOTALK'));
assert.deepEqual(splitStretch('[그]러니까 제 생각'), { pre: '', stretch: '그', post: '러니까 제 생각' });
assert.deepEqual(splitStretch('제가 [자]신'), { pre: '제가 ', stretch: '자', post: '신' });
for (let i = 0; i < SCRIPTS.length; i++) {
  const ms = missionsFor(i);
  assert.equal(ms.length, 4);
  assert.equal(ms[0].text, ms[1].text, '정상과 작아짐은 같은 문장');
  assert.ok(ms[2].stretch && ms[3].stretch, `세트 ${i + 1} 연장 글자 표시`);
  assert.ok(!ms[2].text.includes('['), '화면용 text에는 괄호가 없다');
}
assert.deepEqual(shuffled(8).sort(), [0, 1, 2, 3, 4, 5, 6, 7]);
console.log('ok');
