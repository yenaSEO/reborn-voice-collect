# 너의 목소리를 들려줘

폰에서 대본을 읽고 바로 녹음하는 음성 수집 웹. Re-born 1단계 CNN의 v2 학습용 실제 음성을 지인에게 모은다. 녹음은 Supabase 비공개 저장소에 저장된다.

주소: https://yenaseo.github.io/reborn-voice-collect/

## 동작 요약

- 한 시도 = 녹음 4개: 정상 → 작아짐(같은 문장) → 연장(문장 앞) → 연장(중간). 대본은 `lib.js`의 8세트 중 무작위.
- 4개를 다 끝내야 한꺼번에 올린다. 중간에 나가면 그 시도는 저장되지 않는다.
- 같은 기기는 localStorage의 번호(sid)로 같은 사람이 된다. 다시 하면 같은 폴더에 다음 시도 번호로 쌓이고, 다음 대본 세트가 나온다.
- 닉네임은 `angels` 표(복 받을 명단)에만 저장되고 녹음과 연결되지 않는다. 비워 두면 성별별 연예인 이름(말 안 할래요는 동물) 중 무작위, 겹치면 B·C가 붙는다.
- 아이폰은 녹음마다 마이크를 껐다 켜고, 안드로이드는 한 번 연 마이크를 계속 쓴다(카톡에서 권한 창이 반복되지 않게).
- 명단만 보기: https://yenaseo.github.io/reborn-voice-collect/list.html (`list.html`, `list.js`, 읽기만).
- 예시 음성 `examples/*.mp3`는 Typecast Siyeon으로 만든다: `tts-dataset/tools/make_recorder_examples.py`.

## 파일 구성

| 파일 | 하는 일 |
|---|---|
| `index.html`, `style.css` | 녹음 화면 5개(소개 → 동의 → 미션 4개 → 닉네임 → 완료)와 디자인 |
| `app.js` | 화면 전환, 녹음, 다시 듣기, 한꺼번에 올리기, 기기 기억, 명단 그리기 |
| `lib.js` | **대본 8세트**, 미션 안내 문구, **기본 닉네임 후보**, 이름 붙이기(B·C) 같은 작은 계산 — 문구·후보를 바꿀 때 여기만 고친다 |
| `list.html`, `list.js` | 명단만 보는 화면 |
| `config.js` | Supabase 주소와 공개 키 |
| `supabase-setup.sql` | 저장소(recordings)와 명단 표(angels)를 만드는 SQL |
| `examples/`, `img/` | 예시 음성 4개, 첫 화면 그림 |
| `DESIGN.md`, `PRODUCT.md` | 색·글꼴·도장 규칙, 제품 정보 |
| `check.mjs` | `lib.js` 자가 점검 |

## 처음 설정 (한 번만)

1. **Supabase**: 새 프로젝트 → SQL Editor에 `supabase-setup.sql`을 붙여 넣고 Run.
2. **연결 정보**: Project Settings → API Keys의 Project URL과 publishable(anon) key를 `config.js`에 넣는다. 이 키는 공개돼도 된다.
3. **GitHub**: 공개 저장소에 올린 뒤 Settings → Pages → Branch `main` / `(root)` → Save.
4. **시험**: 아이폰·안드로이드에서 카톡 링크로 열어 끝까지 녹음해 본다.

## 시험 데이터 비우기 (뿌리기 전)

- 명단: Table Editor → `angels` → 줄 전체 선택 → **Delete rows**. **Delete table은 누르지 않는다**(지웠다면 `supabase-setup.sql`의 표 부분만 다시 실행).
- 녹음: Storage → `recordings` 안으로 들어가 **폴더만** 지운다. 버킷 자체는 지우지 않는다.
- 시험한 폰의 사이트 데이터(`github.io`)와 카톡 캐시를 지운다. 안 지우면 "이미 명단에 있어요"로 나온다.

## 녹음 내려받기

- 무료 프로젝트는 1주일 동안 쓰지 않으면 멈추니, 모이면 바로 내려받는다.
- 폴더 하나가 한 사람(기기)이고, 파일 이름은 `시도_미션_종류`다(`2_3_prolong_front.webm` = 2번째 시도의 3번 미션). 옆의 `.json`에 대본·성별·기기·마이크 설정이 있다. **한 시도에 녹음 4개가 다 있는 것만** 쓴다.
- 전부 받으려면 secret(service_role) 키가 필요하다. 이 키는 모든 권한을 가진 열쇠라 **이 공개 저장소에는 절대 넣지 않고**, voice-cnn 쪽 `.env`(깃 제외)에만 둔다.
- 16kHz 모노 WAV로 바꿔 쓴다. 아이폰 녹음은 스테레오인데 왼쪽에만 소리가 있으니(2026-10-18 확인) 왼쪽만 쓴다. 안드로이드는 모노라 같은 명령으로 된다: `ffmpeg -i in.webm -af "pan=mono|c0=c0" -ar 16000 out.wav`
- 일부 webm은 안의 시간 표시가 전부 0으로 깨져 있어 길이가 0초처럼 읽힌다(소리는 멀쩡함, 2026-10-18 발견). 길이가 이상하면 시간 표시를 무시하고 소리만 꺼내서 바꾼다: `ffmpeg -i in.webm -af "pan=mono|c0=c0" -f s16le -ar 16000 - | ffmpeg -f s16le -ar 16000 -ac 1 -i - out.wav`. 학습용으로 받을 때는 처음부터 이 방식으로 바꾸는 게 안전하다.

## 들어 보기용으로 바꾸기

카톡으로 보내 바로 들으려면 m4a로 바꾼다(시간 표시가 깨진 파일도 되도록 소리만 꺼내는 방식):
`ffmpeg -i in.webm -af "pan=mono|c0=c0" -f s16le -ar 48000 - | ffmpeg -f s16le -ar 48000 -ac 1 -i - -c:a aac -b:a 96k out.m4a`
카톡에서는 **+ → 파일**로 보낸다.

## 점검

`node check.mjs`
