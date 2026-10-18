-- Supabase SQL Editor에 통째로 붙여 넣고 한 번 실행한다.
-- 녹음은 비공개 버킷에 "올리기만" 가능하고, 천사 명단(닉네임)만 누구나 읽을 수 있다.

-- 1) 녹음 버킷: 비공개, 파일당 5MB, 오디오와 기록 JSON만
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('recordings', 'recordings', false, 5242880, array['audio/*', 'application/json']);

-- 방문자는 올리기만 할 수 있다(보기·덮어쓰기·지우기 규칙은 일부러 만들지 않는다)
create policy "anon upload only"
on storage.objects for insert to anon
with check (bucket_id = 'recordings');

-- 2) 천사 명단: 번호와 닉네임만 담는다
create table public.angels (
  id bigint generated always as identity primary key,
  nickname text check (nickname is null or char_length(nickname) between 1 and 20),
  created_at timestamptz not null default now()
);

alter table public.angels enable row level security;

create policy "anyone can join" on public.angels for insert to anon with check (true);
create policy "anyone can read" on public.angels for select to anon using (true);
