# reborn-voice-collect

지인들이 카톡 링크를 폰으로 열어 대본을 읽고 바로 녹음하는 웹이다. Re-born 1단계 CNN의 v2 정확도 개선용 실제 음성(정상·작아짐·연장)을 모은다.

- 계획과 결정: `C:\Users\seoyn\RebornProject\voice-cnn\.scratch\recorder-web\spec.md` (조사: 같은 폴더 `research\storage-hosting.md`)
- 상위 프로젝트: `C:\Users\seoyn\RebornProject\voice-cnn` (CLAUDE.md, `.scratch\stage1-cnn-v1\map.md`)
- 디자인: 스탬프 투어 도장판. 색·글꼴·도장 규칙은 `DESIGN.md`, 방향 계약은 `.impeccable/surfaces/index-html.md`(깃 제외), 제품 정보는 `PRODUCT.md`. UI를 고칠 때는 impeccable 스킬을 쓰고, 바꾸기 전에 미리보기를 먼저 보여 준다.
- 구성: 빌드 없는 정적 HTML/CSS/JS, GitHub Pages(개인 공개 저장소), Supabase(비공개 버킷 `recordings`는 올리기만, `angels` 표만 공개 읽기).
- 자가 점검: `node check.mjs`

## 규칙

- 사용자는 ML·웹 초보다. 한국어로, 쉬운 말로 한 단계씩 설명한다.
- 코드를 쓰거나 고치기 전에 ponytail 스킬을 먼저 부른다. 필요 없는 코드는 만들지 않는다.
- 파일 맨 위에 하는 일 2~3줄, 함수 위에 역할 한 줄. 주석은 짧게.
- 커밋은 사용자가 직접 한다. 형식: `종류: 한국어 한 줄 요약` (feat/fix/refactor/docs/test/chore).
- 화면 문구는 부드러운 존댓말. "Re-born" 이름은 설명 접기 안에서만 보인다.
- 파일명에 닉네임을 쓰지 않는다. 닉네임은 화면 표시에는 textContent로만 넣는다.
- secret(service_role) 키는 이 공개 저장소에 절대 넣지 않는다. 명단 표·녹음 버킷 자체를 지우는 안내를 하지 않는다(줄·폴더만).
