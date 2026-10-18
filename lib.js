// 화면과 상관없는 작은 계산 함수 모음. check.mjs가 이 파일을 시험한다.
// 대본 세트도 여기 둔다(임시 문장, 나중에 확정).

// 대본 세트: 한 세트 = 미션 4개. "더 녹음하기"를 누르면 다음 세트로 간다.
// stretch는 늘여 읽을 부분이라 빨간색으로 보인다.
export const SETS = [
  [
    { label: 'normal', guide: '평소처럼 읽어 주세요', text: '오늘은 날씨가 좋아서 산책을 하고 싶어요', sec: 6 },
    { label: 'fade', guide: '처음엔 보통 크기로, 끝으로 갈수록 자신감 없이 흐려지게 읽어 주세요', text: '오늘은 날씨가 좋아서 산책을 하고 싶어요', sec: 6 },
    { label: 'prolong_front', guide: '빨간 글자를 길게 늘여 읽어 주세요', pre: '', stretch: '저어어어는', post: ' 어제 친구랑 밥을 먹었어요', sec: 5 },
    { label: 'prolong_mid', guide: '빨간 글자를 길게 늘여 읽어 주세요', pre: '그래서 제가 ', stretch: '지이이익접', post: ' 해 봤어요', sec: 5 },
  ],
  [
    { label: 'normal', guide: '평소처럼 읽어 주세요', text: '주말에는 집에서 영화를 보면서 쉬었어요', sec: 6 },
    { label: 'fade', guide: '처음엔 보통 크기로, 끝으로 갈수록 자신감 없이 흐려지게 읽어 주세요', text: '주말에는 집에서 영화를 보면서 쉬었어요', sec: 6 },
    { label: 'prolong_front', guide: '빨간 글자를 길게 늘여 읽어 주세요', pre: '', stretch: '그으으으러니까', post: ' 제 생각에는요', sec: 5 },
    { label: 'prolong_mid', guide: '빨간 글자를 길게 늘여 읽어 주세요', pre: '저는 이 일이 ', stretch: '저어어엉말', post: ' 하고 싶어요', sec: 5 },
  ],
];

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

// 명단에 보일 이름: 닉네임이 없으면 angel + 번호.
export function angelName(row) {
  return row.nickname || `angel${row.id}`;
}

// 안드로이드 카카오톡 인앱 브라우저인지(마이크가 불안정한 곳).
export function isKakaoAndroid(ua) {
  return /KAKAOTALK/i.test(ua) && /Android/i.test(ua);
}
