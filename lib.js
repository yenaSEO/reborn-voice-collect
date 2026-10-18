// 화면과 상관없는 작은 계산 함수와 대본 모음. check.mjs가 이 파일을 시험한다.

// 대본 8세트: [정상·작아짐 문장, 연장(앞), 연장(중간)]. [ ] 안의 글자를 길게 끈다.
// 연장(중간)은 단어 첫 글자(홀수 세트)와 단어 가운데 글자(짝수 세트)를 섞어 위치를 다양하게 한다.
// 사람마다 무작위 세트를 받고, "한 번 더"를 누르면 아직 안 한 세트가 나온다.
export const SCRIPTS = [
  ['저는 새로운 걸 배우는 게 즐거워요', '[그]러니까 제 생각에는요', '제가 가장 [자]신 있는 건 요리예요'],
  ['주말에는 친구들이랑 영화를 자주 봐요', '[저]는 그 부분을 잘 모르겠어요', '그래서 제가 열[심]히 해 봤어요'],
  ['아르바이트를 하면서 책임감을 배웠어요', '[어]떤 일이든 끝까지 해 보려고 해요', '처음에는 많이 [서]툴렀어요'],
  ['저는 사람들과 이야기하는 걸 좋아해요', '[제]가 맡았던 일은 정리였어요', '그 경험으로 많이 성[장]했어요'],
  ['힘들 때는 산책을 하면서 생각을 정리해요', '[아]마 그때가 가장 힘들었어요', '저는 그 일을 끝까지 [해]냈어요'],
  ['앞으로는 더 꼼꼼하게 일하고 싶어요', '[사]실 저는 긴장을 많이 해요', '친구들은 저를 차[분]하다고 해요'],
  ['팀 프로젝트에서 발표를 맡은 적이 있어요', '[그]때 저는 많이 당황했어요', '다시 해 보니까 [조]금 나아졌어요'],
  ['저는 계획을 세우고 지키는 편이에요', '[이]건 제가 제일 좋아하는 일이에요', '실수를 하면 바로 고[치]려고 해요'],
];

// 미션 종류별 안내·이유·목표 초. 예시 음성은 examples/<label>.mp3 (대본과 다른 감사 인사 문장).
const KINDS = {
  normal: { guide: '평소 말하듯 편하게 읽어 주세요', why: 'AI가 평소 목소리를 알아야 다른 것도 구분할 수 있어요', sec: 6 },
  fade: { guide: '방금 읽은 문장을, 이번엔 처음엔 보통 크기로 시작해 갈수록 자신 없게 작아지며 읽어 주세요', why: '면접에서 자신감이 줄며 목소리가 작아지는 순간을 가르쳐요', sec: 6 },
  prolong_front: { guide: '빨간 글자를 2초쯤 길게 끌어 주세요', why: '말문이 막혀 소리를 길게 끄는 순간을 가르쳐요', sec: 5 },
  prolong_mid: { guide: '빨간 글자를 2초쯤 길게 끌어 주세요', why: '말문이 막혀 소리를 길게 끄는 순간을 가르쳐요', sec: 5 },
};

// "[그]러니까" → { pre: '', stretch: '그', post: '러니까' }. 괄호가 없으면 stretch는 빈 문자열.
export function splitStretch(s) {
  const m = s.match(/^(.*?)\[(.+?)\](.*)$/);
  return m ? { pre: m[1], stretch: m[2], post: m[3] } : { pre: s, stretch: '', post: '' };
}

// 세트 번호 → 미션 4개.
export function missionsFor(setId) {
  const [text, front, mid] = SCRIPTS[setId];
  return [['normal', text], ['fade', text], ['prolong_front', front], ['prolong_mid', mid]]
    .map(([label, line]) => ({ label, ...KINDS[label], ...splitStretch(line), text: line.replace(/[[\]]/g, '') }));
}

// 0..n-1을 무작위로 섞는다(사람마다 세트 순서가 다르게).
export function shuffled(n) {
  const a = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 녹음 형식(mimeType)에 맞는 확장자.
export function extFor(mime) {
  if (mime.includes('mp4') || mime.includes('aac')) return 'm4a';
  if (mime.includes('ogg')) return 'ogg';
  return 'webm';
}

// "audio/webm;codecs=opus" → "audio/webm" (저장소 형식 검사용).
export function baseMime(mime) {
  return (mime || 'audio/webm').split(';')[0].trim();
}

// 저장 경로: 사람 폴더 / 세트_순서_종류.확장자 (닉네임은 쓰지 않는다).
export function clipPath(sid, set, n, label, ext) {
  return `${sid}/${set + 1}_${n + 1}_${label}.${ext}`;
}

// 닉네임 정리: 앞뒤 공백 제거, 20자 제한, 비면 null.
export function cleanNickname(s) {
  const t = (s || '').trim().slice(0, 20);
  return t || null;
}

// 닉네임을 비웠을 때 성별에 따라 무작위로 넣는 기본 이름.
const NICK_POOL = {
  male: ['박보검', '차은우', '송강', '정해인', '변우석', '공유', '이도현', '안효섭', '남주혁', '서강준'],
  female: ['장원영', '카리나', '아이유', '수지', '김태리', '한소희', '윈터', '안유진', '김유정', '신세경'],
  none: ['수달', '판다', '쿼카', '펭귄', '다람쥐', '고양이', '강아지', '햄스터', '토끼', '코알라'],
};
const LEGACY_NICK = '천사님'; // 닉네임이 빈 예전 시험 줄
export function defaultNick(gender, rand = Math.random) {
  const pool = NICK_POOL[gender] || NICK_POOL.none;
  return pool[Math.floor(rand() * pool.length)];
}

// 이름 뒤 조사: 받침이 없거나 ㄹ이면 "로", 아니면 "으로".
export function ro(word) {
  const c = word.charCodeAt(word.length - 1) - 0xac00;
  if (c < 0 || c > 11171) return '로';
  const jong = c % 28;
  return jong === 0 || jong === 8 ? '로' : '으로';
}

// 0 → A, 25 → Z, 26 → AA …
export function letter(i) {
  let s = '';
  for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}

// 명단 이름 붙이기: 같은 이름이 또 나오면 id 순서대로 두 번째부터 B, C…를 붙인다(첫 번째는 그대로).
// 닉네임이 빈 예전 줄은 천사님으로 본다. rows는 id 오름차순이어야 한다.
export function labelAngels(rows) {
  const seen = {};
  return rows.map((row) => {
    const base = row.nickname || LEGACY_NICK;
    seen[base] = (seen[base] || 0) + 1;
    return { id: row.id, name: seen[base] === 1 ? base : `${base} ${letter(seen[base] - 1)}` };
  });
}

// 안드로이드 카카오톡 인앱 브라우저인지(마이크가 불안정한 곳).
export function isKakaoAndroid(ua) {
  return /KAKAOTALK/i.test(ua) && /Android/i.test(ua);
}
