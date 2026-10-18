# 목소리 도장판

폰에서 대본을 읽고 바로 녹음하는 음성 수집 웹. 녹음은 Supabase 비공개 저장소에 저장된다.

## 처음 설정 (한 번만)

1. **Supabase**: 새 프로젝트 만들기 → SQL Editor에 `supabase-setup.sql` 내용을 붙여 넣고 Run.
2. **연결 정보**: Project Settings → API의 Project URL과 anon(또는 publishable) key를 `config.js`에 넣는다.
3. **GitHub**: 공개 저장소 `reborn-voice-collect`에 올린 뒤 Settings → Pages → Branch `main` / `(root)` → Save.
4. **시험**: `https://<아이디>.github.io/reborn-voice-collect/`를 아이폰·안드로이드에서 카톡 링크로 열어 끝까지 녹음해 본다.

## 녹음 내려받기

Supabase 대시보드 → Storage → `recordings`에서 받거나 CLI로 받는다. 무료 프로젝트는 1주일 동안 쓰지 않으면 멈추니, 다 모이면 바로 내려받는다. 받은 파일은 ffmpeg로 16kHz 모노 WAV로 바꿔 쓴다. 아이폰 녹음은 스테레오인데 왼쪽에만 소리가 있으니(오른쪽은 무음, 2026-10-18 확인) 두 채널을 섞지 말고 왼쪽만 쓴다: `ffmpeg -i in.webm -af "pan=mono|c0=c0" -ar 16000 out.wav`

## 점검

`node check.mjs`
