-- DreamCatcher Supabase 데이터베이스 스키마
-- dreams 테이블 생성
create table if not exists dreams (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  deadline date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- goals 테이블 생성
create table if not exists goals (
  id uuid primary key default uuid_generate_v4(),
  dream_id uuid references dreams(id) on delete cascade,
  title text not null,
  completed boolean default false,
  status text default 'proposed',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 목표 상태 ENUM 타입 생성 (존재하지 않을 때만)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'goal_status') then
    create type goal_status as enum ('proposed', 'accepted', 'rejected', 'completed', 'in_progress');
  end if;
end$$;

-- goals.status 필드를 ENUM으로 변경
alter table goals alter column status type goal_status using status::goal_status;

-- 인덱스 생성
create index if not exists dreams_user_id_idx on dreams(user_id);
create index if not exists goals_dream_id_idx on goals(dream_id);
create index if not exists goals_status_idx on goals(status);

-- dreams 테이블 RLS 정책 (중복 방지: DROP 후 CREATE)
alter table dreams enable row level security;
drop policy if exists "사용자는 자신의 꿈만 볼 수 있음" on dreams;
create policy "사용자는 자신의 꿈만 볼 수 있음" on dreams
  for select using (auth.uid() = user_id);
drop policy if exists "사용자는 자신의 꿈만 생성할 수 있음" on dreams;
create policy "사용자는 자신의 꿈만 생성할 수 있음" on dreams
  for insert with check (auth.uid() = user_id);
drop policy if exists "사용자는 자신의 꿈만 수정할 수 있음" on dreams;
create policy "사용자는 자신의 꿈만 수정할 수 있음" on dreams
  for update using (auth.uid() = user_id);
drop policy if exists "사용자는 자신의 꿈만 삭제할 수 있음" on dreams;
create policy "사용자는 자신의 꿈만 삭제할 수 있음" on dreams
  for delete using (auth.uid() = user_id);

-- goals 테이블 RLS 정책 (중복 방지: DROP 후 CREATE)
alter table goals enable row level security;
drop policy if exists "사용자는 자신의 꿈에 연결된 목표만 접근 가능" on goals;
create policy "사용자는 자신의 꿈에 연결된 목표만 접근 가능" on goals
  for all using (auth.uid() = (select user_id from dreams where id = goals.dream_id));

-- updated_at 자동 갱신 트리거 함수
create or replace function update_modified_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_dreams_modtime on dreams;
create trigger update_dreams_modtime
before update on dreams
for each row execute function update_modified_column();

drop trigger if exists update_goals_modtime on goals;
create trigger update_goals_modtime
before update on goals
for each row execute function update_modified_column(); 