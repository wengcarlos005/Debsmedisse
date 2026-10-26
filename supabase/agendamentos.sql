-- ============================================================
-- AGENDAMENTOS + PIX — rode tudo de uma vez no SQL Editor.
-- ANTES: troque o e-mail na linha marcada pelo e-mail de login da Débora.
-- ============================================================

-- 1) Quem é admin (só esse e-mail edita o site e vê os clientes)
create table if not exists admins (email text primary key);
insert into admins (email) values (lower('EMAIL_DA_DEBORA@exemplo.com'))   -- ← TROQUE AQUI
on conflict do nothing;
alter table admins enable row level security;   -- ninguém lê pela API

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where email = lower(auth.jwt() ->> 'email'));
$$;

-- 2) Textos do site: só a admin salva (antes qualquer conta logada podia)
drop policy if exists "Autenticado salva"    on site_config;
drop policy if exists "Autenticado atualiza" on site_config;
drop policy if exists "Admin salva"          on site_config;
drop policy if exists "Admin atualiza"       on site_config;
create policy "Admin salva"    on site_config for insert with check (is_admin());
create policy "Admin atualiza" on site_config for update using (is_admin());

-- 3) Agendamentos
create table if not exists agendamentos (
  id         text primary key,
  criado_em  timestamptz not null default now(),
  nome       text not null check (char_length(nome) between 1 and 80),
  whatsapp   text not null check (whatsapp ~ '^[0-9]{10,13}$'),
  oraculo    text not null check (char_length(oraculo) <= 40),
  pacote     text not null check (char_length(pacote) <= 80),
  valor      numeric(10,2) not null check (valor >= 0),
  inicio     timestamptz not null,
  fim        timestamptz not null,
  tema       text check (char_length(tema) <= 80),
  mensagem   text check (char_length(mensagem) <= 1000),
  status     text not null default 'aguardando_pagamento'
             check (status in ('aguardando_pagamento','confirmado','concluido','cancelado')),
  check (fim > inicio and fim - inicio <= interval '4 hours')
);
create index if not exists agendamentos_inicio_idx on agendamentos (inicio);

alter table agendamentos enable row level security;
drop policy if exists "Cliente reserva"  on agendamentos;
drop policy if exists "Admin le"         on agendamentos;
drop policy if exists "Admin atualiza"   on agendamentos;
create policy "Cliente reserva" on agendamentos for insert
  with check (status = 'aguardando_pagamento' and inicio > now());
create policy "Admin le"        on agendamentos for select using (is_admin());
create policy "Admin atualiza"  on agendamentos for update using (is_admin());

-- 4) Horário reservado e não pago por 60 min volta a ficar livre
create or replace function horarios_ocupados(de timestamptz, ate timestamptz)
returns table (inicio timestamptz, fim timestamptz)
language sql stable security definer set search_path = public as $$
  select a.inicio, a.fim from agendamentos a
  where a.inicio < ate and a.fim > de
    and (a.status = 'confirmado'
         or (a.status = 'aguardando_pagamento' and a.criado_em > now() - interval '60 minutes'));
$$;
grant execute on function horarios_ocupados(timestamptz, timestamptz) to anon, authenticated;

-- 5) Impede duas pessoas no mesmo horário (mesmo clicando ao mesmo tempo)
create or replace function checar_horario() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform pg_advisory_xact_lock(hashtext('agenda'));
  if exists (select 1 from horarios_ocupados(new.inicio, new.fim)) then
    raise exception 'horario_indisponivel';
  end if;
  return new;
end $$;
drop trigger if exists agendamentos_checar on agendamentos;
create trigger agendamentos_checar before insert on agendamentos
  for each row execute function checar_horario();
