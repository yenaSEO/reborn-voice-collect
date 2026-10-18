// 복 받을 명단 화면: Supabase angels 표를 읽어 이름표로 그린다(읽기만 한다).
// 이름 붙이기(B, C)는 녹음 화면과 같은 labelAngels를 쓴다.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.79.0/+esm';
import { SUPABASE_URL, SUPABASE_KEY } from './config.js';
import { labelAngels } from './lib.js';

const { data, error } = await createClient(SUPABASE_URL, SUPABASE_KEY)
  .from('angels').select('id, nickname').order('id', { ascending: true }).limit(500);
const count = document.getElementById('count');
if (error) {
  count.textContent = '명단을 불러오지 못했어요. 잠시 뒤 새로고침해 주세요.';
} else {
  const rows = labelAngels(data);
  count.textContent = `지금까지 ${rows.length}명이 함께해 주셨어요`;
  // 닉네임은 textContent로만 넣는다(태그 주입 방지)
  document.getElementById('angels').replaceChildren(...rows.map((r) => {
    const li = document.createElement('li');
    li.textContent = r.name;
    return li;
  }));
}
