// 녹음 웹의 화면 전환, 녹음, 업로드, 복 받을 명단을 맡는다.
// 녹음은 브라우저 MediaRecorder로 하고, 4개를 다 끝내면 파일과 기록(JSON)을 Supabase 비공개 버킷에 한꺼번에 올린다.
// 같은 기기는 localStorage의 sid로 같은 사람으로 기록한다. 중간에 나가면 그 시도는 저장되지 않는다.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.79.0/+esm';
import { SUPABASE_URL, SUPABASE_KEY } from './config.js';
import { SCRIPTS, missionsFor, shuffled, extFor, baseMime, clipPath, cleanNickname, defaultNick, labelAngels, isKakaoAndroid } from './lib.js';

const db = createClient(SUPABASE_URL, SUPABASE_KEY);
const $ = (id) => document.getElementById(id);

// 같은 기기 기록: sid(사람 번호), attempts(시작한 횟수), order(대본 세트 순서), angel(명단 줄).
// 사생활 보호 모드 등으로 저장이 안 되면 이번 방문에서만 쓴다.
const STORE_KEY = 'voice-collect';
function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || null; } catch { return null; }
}
function saveStore() {
  const { sid, attempts, order, angel } = state;
  try { localStorage.setItem(STORE_KEY, JSON.stringify({ sid, attempts, order, angel })); } catch { /* 저장 못 해도 진행 */ }
}

const saved = loadStore();
const state = {
  sid: saved?.sid || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`),
  attempts: saved?.attempts || 0, // 이 기기에서 미션을 시작한 횟수(파일 경로와 대본 세트가 겹치지 않게)
  order: saved?.order || shuffled(SCRIPTS.length), // 이 사람이 받을 대본 세트 순서
  angel: saved?.angel || null, // 이미 명단에 올라갔으면 그 줄
  gender: '',
  n: 0,
  clips: [], // 이번 시도에서 고른 녹음(다 모이면 한꺼번에 올린다)
  uploaded: 0, // 올리다 실패했을 때 이어서 올릴 위치
  stream: null,
  mic: null, // 실제 적용된 마이크 설정(자동 음량 조절이 꺼졌는지 등)
  recorder: null,
  chunks: [],
  blob: null,
  duration: 0,
  t0: 0,
  timer: 0,
};
saveStore();

// 지금 미션(세트는 순서대로 돌아가며 쓴다).
const setId = () => state.order[(state.attempts - 1) % SCRIPTS.length];
const mission = () => missionsFor(setId())[state.n];

// 화면 하나만 보이게 바꾼다.
function show(name) {
  document.querySelectorAll('[data-screen]').forEach((s) => { s.hidden = s.dataset.screen !== name; });
  window.scrollTo(0, 0);
}

// 도장 4칸을 그린다. done개까지 도장이 찍혀 있다.
function drawCard(el, done) {
  el.replaceChildren(...[0, 1, 2, 3].map((i) => {
    const slot = document.createElement('span');
    slot.className = 'slot';
    if (i < done) {
      slot.classList.add('is-stamped');
      slot.innerHTML = '<b>성공</b>';
    } else {
      if (i === done) slot.classList.add('is-current');
      slot.innerHTML = `<i>${i + 1}</i>`;
    }
    return slot;
  }));
}

// 지금 미션의 대본·안내·막대를 보여 준다.
function drawMission() {
  const m = mission();
  drawCard($('card'), state.n);
  $('card').setAttribute('aria-label', `미션 ${state.n + 1} / 4`);
  $('guide').textContent = m.guide;
  $('why').textContent = m.why;
  const script = $('script');
  if (m.stretch) {
    const em = document.createElement('em');
    em.textContent = m.stretch;
    const bar = document.createElement('span');
    bar.className = 'stretch'; // 빨간 글자 뒤에 늘어나는 막대
    script.replaceChildren(m.pre, em, bar, m.post);
  } else {
    script.textContent = m.text;
  }
  $('example').src = `examples/${m.label}.mp3`;
  setBar(0, m.sec);
  setMsg('');
  $('dock-record').hidden = false;
  $('dock-review').hidden = true;
  $('rec').classList.remove('is-recording');
  $('rec-label').textContent = '녹음 시작';
}

// 시간 막대: 막대 전체 길이 = 목표 초.
function setBar(elapsed, sec) {
  $('timebar-fill').style.width = `${Math.min(elapsed / sec, 1) * 100}%`;
  $('time').textContent = `${elapsed.toFixed(1)}초 / 약 ${sec}초`;
}

function setMsg(text) { $('msg').textContent = text; }

// 녹음마다 마이크를 새로 연다. 자동 음량 조절 등은 끄도록 요청한다.
async function openMic() {
  try {
    state.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, autoGainControl: false, noiseSuppression: false, channelCount: 1 },
    });
  } catch (e) {
    // 일부 노트북 마이크는 처리 끄기 요청에 NotReadableError를 낸다 → 기본 설정으로 다시 연다.
    // 실제 적용된 설정은 녹음 기록(mic)에 남으니 나중에 거를 수 있다.
    if (e.name === 'NotAllowedError' || e.name === 'SecurityError') throw e;
    state.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  }
  return state.stream;
}

// 녹음 형식은 브라우저가 지원하는 것 중 앞에서부터 고른다.
function pickMime() {
  return ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm'].find((t) => MediaRecorder.isTypeSupported?.(t)) || '';
}

async function startRec() {
  let stream;
  try {
    stream = await openMic();
  } catch (e) {
    setMsg(e.name === 'NotAllowedError'
      ? '마이크 권한이 막혀 있어요. 주소창 왼쪽 아이콘에서 마이크를 허용한 뒤 새로고침해 주세요.'
      : `마이크를 열 수 없어요(${e.name}). 다른 앱이 마이크를 쓰고 있다면 끄고 새로고침해 주세요.`);
    return;
  }
  state.mic = stream.getAudioTracks()[0]?.getSettings?.() || null;
  const mime = pickMime();
  const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
  state.recorder = rec;
  state.chunks = [];
  rec.ondataavailable = (e) => { if (e.data.size) state.chunks.push(e.data); };
  rec.onstop = onStopped;
  rec.start();
  state.t0 = performance.now();
  const sec = mission().sec;
  state.timer = setInterval(() => {
    const el = (performance.now() - state.t0) / 1000;
    setBar(el, sec);
    if (el > sec + 4) stopRec(); // 너무 길어지면 자동으로 멈춘다
  }, 100);
  $('rec').classList.add('is-recording');
  $('rec-label').textContent = '다 읽었어요';
  setMsg('');
}

function stopRec() {
  clearInterval(state.timer);
  state.duration = (performance.now() - state.t0) / 1000;
  if (state.recorder?.state === 'recording') state.recorder.stop();
}

// 녹음이 끝나면 다시 듣기 화면으로 바꾼다.
function onStopped() {
  // 아이폰은 마이크가 켜져 있으면 소리를 통화용 스피커로 작게 내고, 재생 뒤 마이크가 멈추기도 한다 → 바로 끈다.
  state.stream.getTracks().forEach((t) => t.stop());
  $('rec').classList.remove('is-recording');
  $('rec-label').textContent = '녹음 시작';
  if (state.duration < 1) {
    setMsg('너무 짧아요. 문장을 끝까지 읽어 주세요.');
    return;
  }
  state.blob = new Blob(state.chunks, { type: state.recorder.mimeType || 'audio/webm' });
  if (state.blob.size < 2000) { // 1초 넘게 녹음했는데 이보다 작으면 소리가 담기지 않은 것
    setMsg('녹음이 비어 있어요. 다시 녹음해 주세요.');
    return;
  }
  const audio = $('playback');
  if (audio.src) URL.revokeObjectURL(audio.src);
  audio.src = URL.createObjectURL(state.blob);
  $('dock-record').hidden = true;
  $('dock-review').hidden = false;
  setMsg('한 번 들어 보고, 괜찮으면 "이걸로 할게요"를 눌러 주세요.');
}

// 고른 녹음을 담아 두고 도장을 찍는다(올리기는 4개를 다 모은 뒤에).
function accept() {
  const m = mission();
  const type = state.blob.type;
  state.clips[state.n] = {
    path: clipPath(state.sid, state.attempts - 1, state.n, m.label, extFor(type)),
    blob: state.blob,
    meta: {
      sid: state.sid, attempt: state.attempts, script_set: setId() + 1, n: state.n + 1, label: m.label,
      script: m.text, stretch: m.stretch || null, target_sec: m.sec,
      duration_sec: Number(state.duration.toFixed(2)), mime: type, gender: state.gender,
      ua: navigator.userAgent, mic: state.mic,
      at: new Date().toISOString(),
    },
  };
  stampAndNext();
}

// 도장을 찍는 연출 뒤 다음 미션으로, 4개째면 올리기로 간다.
function stampAndNext() {
  drawCard($('card'), state.n + 1);
  $('card').children[state.n].classList.add('stamp-in');
  setMsg('성공!');
  $('dock-review').hidden = true;
  setTimeout(() => {
    state.n += 1;
    if (state.n < 4) return drawMission();
    uploadAll();
  }, 900);
}

// 4개 녹음과 기록을 차례로 올린다. 실패하면 녹음을 지우지 않고 "다시 올리기"로 이어서 올린다.
async function uploadAll() {
  $('dock-upload').hidden = true;
  const opts = { upsert: false };
  for (; state.uploaded < state.clips.length; state.uploaded++) {
    const c = state.clips[state.uploaded];
    setMsg(`올리는 중이에요… ${state.uploaded + 1}/4`);
    const a = await db.storage.from('recordings').upload(c.path, c.blob, { ...opts, contentType: baseMime(c.blob.type) });
    const b = a.error ? a : await db.storage.from('recordings').upload(c.path.replace(/\.\w+$/, '.json'),
      new Blob([JSON.stringify(c.meta)], { type: 'application/json' }), { ...opts, contentType: 'application/json' });
    if (a.error || b.error) {
      setMsg('올리기에 실패했어요. 인터넷 연결을 확인하고 다시 올려 주세요.');
      $('dock-upload').hidden = false;
      return;
    }
  }
  state.clips = [];
  state.uploaded = 0;
  if (state.angel) return showDone(); // 이 기기는 이미 명단에 있다
  drawCard($('card-full'), 4);
  // 도장 4개가 차례로 쾅쾅 찍힌다
  [...$('card-full').children].forEach((slot, i) => {
    slot.classList.add('stamp-in');
    slot.style.animationDelay = `${i * 160}ms`;
  });
  $('nick').placeholder = `비워 두면 '${defaultNick(state.gender)} A'처럼 올라가요`;
  show('nickname');
}

// 복 받을 명단에 올리고 완료 화면으로 간다.
async function join() {
  $('join').disabled = true;
  const { data, error } = await db.from('angels')
    .insert({ nickname: cleanNickname($('nick').value) || defaultNick(state.gender) }).select('id, nickname').single();
  $('join').disabled = false;
  if (error) {
    $('nick-msg').textContent = '명단에 올리지 못했어요. 잠시 뒤 다시 눌러 주세요.';
    return;
  }
  state.angel = data;
  saveStore();
  showDone();
}

async function showDone() {
  $('thanks').textContent = '고마워요!';
  show('done');
  const me = await drawAngels($('angels'));
  if (me) $('thanks').textContent = `${me}님, 고마워요!`;
}

// 명단을 불러와 그리고, 내 이름(글자 붙은 것)을 돌려준다. 닉네임은 textContent로만 넣는다(태그 주입 방지).
async function drawAngels(list) {
  const { data, error } = await db.from('angels').select('id, nickname').order('id', { ascending: true }).limit(500);
  if (error) {
    list.replaceChildren();
    return null;
  }
  let me = null;
  list.replaceChildren(...labelAngels(data).map((row) => {
    const li = document.createElement('li');
    li.textContent = row.name;
    if (state.angel && row.id === state.angel.id) {
      li.classList.add('is-me');
      me = row.name;
    }
    return li;
  }));
  return me;
}

// --- 연결 ---
if (isKakaoAndroid(navigator.userAgent)) $('kakao-banner').hidden = false;
$('open-external').onclick = () => {
  location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(location.href)}`;
};
document.querySelectorAll('[data-go]').forEach((b) => { b.onclick = () => show(b.dataset.go); });
// 동의 체크와 성별 선택(셋 중 하나)이 모두 있어야 시작할 수 있다.
const gender = () => document.querySelector('input[name=gender]:checked')?.value;
$('consent-form').onchange = () => {
  const ok = $('agree').checked && Boolean(gender());
  $('begin').disabled = !ok;
  $('begin-hint').hidden = ok; // 왜 버튼이 꺼져 있는지 알려 준다
};
$('begin').onclick = () => {
  state.gender = gender();
  state.attempts += 1; // 시작하자마자 저장: 중간에 나가도 다음엔 새 세트·새 경로
  state.n = 0;
  state.clips = [];
  state.uploaded = 0;
  saveStore();
  drawMission();
  show('mission');
};
$('rec').onclick = () => (state.recorder?.state === 'recording' ? stopRec() : startRec());
$('retry').onclick = drawMission;
$('play-example').onclick = () => {
  $('example').play().catch(() => setMsg('예시를 아직 준비 중이에요.'));
};
$('accept').onclick = accept;
$('upload-retry').onclick = uploadAll;
$('join').onclick = join;
// 친구에게 공유: 폰은 공유 창, 안 되면 링크 복사.
$('share').onclick = async () => {
  const url = location.origin + location.pathname;
  if (navigator.share) {
    await navigator.share({ title: '너의 목소리를 들려줘', url }).catch(() => {}); // 취소해도 그냥 둔다
    return;
  }
  try {
    await navigator.clipboard.writeText(url);
    $('done-msg').textContent = '링크를 복사했어요. 카톡에 붙여 넣어 보내 주세요!';
  } catch {
    $('done-msg').textContent = `이 주소를 보내 주세요: ${url}`;
  }
};
// 녹음 중이거나 아직 안 올린 녹음이 있으면 나가기 전에 경고한다(나가면 이번 시도는 저장되지 않는다).
window.addEventListener('beforeunload', (e) => {
  if (state.recorder?.state === 'recording' || state.clips.length) {
    e.preventDefault();
    e.returnValue = ''; // 예전 사파리용
  }
});
