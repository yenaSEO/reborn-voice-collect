// 녹음 웹의 화면 전환, 녹음, 업로드, 천사 명단을 맡는다.
// 녹음은 브라우저 MediaRecorder로 하고, 파일과 기록(JSON)을 Supabase 비공개 버킷에 올린다.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.79.0/+esm';
import { SUPABASE_URL, SUPABASE_KEY } from './config.js';
import { SETS, extFor, baseMime, clipPath, cleanNickname, angelName, isKakaoAndroid } from './lib.js';

const db = createClient(SUPABASE_URL, SUPABASE_KEY);
const $ = (id) => document.getElementById(id);

const state = {
  sid: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  gender: '',
  round: 0, // 몇 번째 세트인지(더 녹음하기마다 +1, 파일명이 겹치지 않게)
  n: 0,
  stream: null,
  recorder: null,
  chunks: [],
  blob: null,
  duration: 0,
  t0: 0,
  timer: 0,
  angel: null,
};

// 지금 미션(세트는 순서대로 돌아가며 쓴다).
const mission = () => SETS[state.round % SETS.length][state.n];

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
  const script = $('script');
  if (m.stretch) {
    const em = document.createElement('em');
    em.textContent = m.stretch;
    script.replaceChildren(m.pre, em, m.post);
  } else {
    script.textContent = m.text;
  }
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

// 마이크를 한 번만 연다. 자동 음량 조절 등은 끄도록 요청한다.
async function openMic() {
  if (state.stream) return state.stream;
  state.stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, autoGainControl: false, noiseSuppression: false, channelCount: 1 },
  });
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
  } catch {
    setMsg('마이크를 쓸 수 없어요. 브라우저에서 마이크를 허용한 뒤 새로고침해 주세요.');
    return;
  }
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
  $('rec').classList.remove('is-recording');
  $('rec-label').textContent = '녹음 시작';
  if (state.duration < 1) {
    setMsg('너무 짧아요. 문장을 끝까지 읽어 주세요.');
    return;
  }
  state.blob = new Blob(state.chunks, { type: state.recorder.mimeType || 'audio/webm' });
  const audio = $('playback');
  if (audio.src) URL.revokeObjectURL(audio.src);
  audio.src = URL.createObjectURL(state.blob);
  $('dock-record').hidden = true;
  $('dock-review').hidden = false;
  setMsg('한 번 들어 보고, 괜찮으면 "이걸로 할게요"를 눌러 주세요.');
}

// 녹음 파일과 기록(JSON)을 올린다. 실패하면 녹음을 지우지 않고 다시 누르게 한다.
async function accept() {
  const m = mission();
  const type = state.blob.type;
  const path = clipPath(state.sid, state.round, state.n, m.label, extFor(type));
  const meta = {
    sid: state.sid, set: state.round + 1, n: state.n + 1, label: m.label,
    script: m.text || `${m.pre}${m.stretch}${m.post}`, target_sec: m.sec,
    duration_sec: Number(state.duration.toFixed(2)), mime: type, gender: state.gender,
    ua: navigator.userAgent, mic: state.stream.getAudioTracks()[0]?.getSettings?.() || null,
    at: new Date().toISOString(),
  };
  const btn = $('accept');
  btn.disabled = true;
  setMsg('올리는 중이에요…');
  const opts = { upsert: false };
  const a = await db.storage.from('recordings').upload(path, state.blob, { ...opts, contentType: baseMime(type) });
  const b = a.error ? a : await db.storage.from('recordings').upload(path.replace(/\.\w+$/, '.json'),
    new Blob([JSON.stringify(meta)], { type: 'application/json' }), { ...opts, contentType: 'application/json' });
  btn.disabled = false;
  if (a.error || b.error) {
    setMsg('올리기에 실패했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.');
    return;
  }
  stampAndNext();
}

// 도장을 찍는 연출 뒤 다음 미션으로 간다.
function stampAndNext() {
  drawCard($('card'), state.n + 1);
  $('card').children[state.n].classList.add('stamp-in');
  setMsg('미션 성공!');
  $('dock-review').hidden = true;
  setTimeout(() => {
    state.n += 1;
    if (state.n < 4) return drawMission();
    if (state.angel) return showDone(); // 추가 녹음이면 명단은 이미 올라가 있다
    drawCard($('card-full'), 4);
    show('nickname');
  }, 900);
}

// 천사 명단에 올리고 완료 화면으로 간다.
async function join() {
  $('join').disabled = true;
  const { data, error } = await db.from('angels')
    .insert({ nickname: cleanNickname($('nick').value) }).select('id, nickname').single();
  $('join').disabled = false;
  if (error) {
    $('nick-msg').textContent = '명단에 올리지 못했어요. 잠시 뒤 다시 눌러 주세요.';
    return;
  }
  state.angel = data;
  showDone();
}

async function showDone() {
  $('thanks').textContent = `${angelName(state.angel)}님, 고마워요!`;
  show('done');
  await drawAngels($('angels'));
}

// 명단을 불러와 그린다. 닉네임은 textContent로만 넣는다(태그 주입 방지).
async function drawAngels(list) {
  const { data, error } = await db.from('angels').select('id, nickname').order('id', { ascending: true }).limit(500);
  if (error) {
    list.replaceChildren();
    return;
  }
  list.replaceChildren(...data.map((row) => {
    const li = document.createElement('li');
    li.textContent = angelName(row);
    if (state.angel && row.id === state.angel.id) li.classList.add('is-me');
    return li;
  }));
}

// 소개 화면에 지금까지 참여한 사람 수를 보여 준다.
async function drawCount() {
  const { count } = await db.from('angels').select('id', { count: 'exact', head: true });
  if (count) $('angel-count').textContent = `지금까지 천사 ${count}명이 도와줬어요`;
}

// --- 연결 ---
if (isKakaoAndroid(navigator.userAgent)) $('kakao-banner').hidden = false;
$('open-external').onclick = () => {
  location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(location.href)}`;
};
document.querySelectorAll('[data-go]').forEach((b) => { b.onclick = () => show(b.dataset.go); });
$('agree').onchange = (e) => { $('begin').disabled = !e.target.checked; };
$('begin').onclick = () => {
  state.gender = document.querySelector('input[name=gender]:checked').value;
  drawMission();
  show('mission');
};
$('rec').onclick = () => (state.recorder?.state === 'recording' ? stopRec() : startRec());
$('retry').onclick = drawMission;
$('accept').onclick = accept;
$('join').onclick = join;
$('more').onclick = () => {
  state.round += 1;
  state.n = 0;
  drawMission();
  show('mission');
};
drawCount();
