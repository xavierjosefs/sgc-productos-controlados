-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- USERS TABLE
-- Links to Supabase Auth
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  cedula text unique not null,
  email text not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for users
alter table public.users enable row level security;

-- Policies for users
create policy "Users can view their own profile" 
  on public.users for select 
  using ( auth.uid() = id );

create policy "Users can update their own profile" 
  on public.users for update 
  using ( auth.uid() = id );

-- TIPOS_SERVICIO TABLE
create table public.tipos_servicio (
  id serial primary key,
  nombre_servicio text not null
);

-- Enable RLS for tipos_servicio
alter table public.tipos_servicio enable row level security;

-- Policies for tipos_servicio
create policy "Service types are viewable by everyone" 
  on public.tipos_servicio for select 
  using ( true );

-- ESTADOS_SOLICITUD TABLE
create table public.estados_solicitud (
  id serial primary key,
  nombre_mostrar text not null
);

-- Enable RLS for estados_solicitud
alter table public.estados_solicitud enable row level security;

-- Policies for estados_solicitud
create policy "Request statuses are viewable by everyone" 
  on public.estados_solicitud for select 
  using ( true );

-- SOLICITUDES TABLE
create table public.solicitudes (
  id serial primary key,
  user_id text references public.users(cedula) not null, -- References cedula to maintain compatibility
  tipo_servicio_id int references public.tipos_servicio(id) not null,
  estado_id int references public.estados_solicitud(id) not null,
  form_data jsonb default '{}'::jsonb,
  fecha_creacion timestamp with time zone default timezone('utc'::text, now()) not null,
  tipo_solicitud text,
  solicitud_original_id int,
  fase text,
  solicitud_anterior_id int
);

-- Enable RLS for solicitudes
alter table public.solicitudes enable row level security;

-- Policies for solicitudes
-- Users can view their own requests. 
-- We link auth.uid() -> public.users.id -> public.users.cedula -> public.solicitudes.user_id
create policy "Users can view their own requests" 
  on public.solicitudes for select 
  using (
    user_id in (
      select cedula from public.users where id = auth.uid()
    )
  );

create policy "Users can insert their own requests" 
  on public.solicitudes for insert 
  with check (
    user_id in (
      select cedula from public.users where id = auth.uid()
    )
  );

create policy "Users can update their own requests" 
  on public.solicitudes for update 
  using (
    user_id in (
      select cedula from public.users where id = auth.uid()
    )
  );

-- DOCUMENTOS_SOLICITUD TABLE
create table public.documentos_solicitud (
  id serial primary key,
  solicitud_id int references public.solicitudes(id) on delete cascade not null,
  tipo_documento text,
  nombre_archivo text not null,
  mime_type text,
  tamano int,
  url text
);

-- Enable RLS for documentos_solicitud
alter table public.documentos_solicitud enable row level security;

-- Policies for documentos_solicitud
-- Users can view documents if they can view the parent request
create policy "Users can view documents of their own requests" 
  on public.documentos_solicitud for select 
  using (
    solicitud_id in (
      select id from public.solicitudes 
      where user_id in (
        select cedula from public.users where id = auth.uid()
      )
    )
  );

create policy "Users can insert documents to their own requests" 
  on public.documentos_solicitud for insert 
  with check (
    solicitud_id in (
      select id from public.solicitudes 
      where user_id in (
        select cedula from public.users where id = auth.uid()
      )
    )
  );

create policy "Users can delete documents of their own requests" 
  on public.documentos_solicitud for delete 
  using (
    solicitud_id in (
      select id from public.solicitudes 
      where user_id in (
        select cedula from public.users where id = auth.uid()
      )
    )
  );

-- STORAGE
-- Create a bucket for documents
insert into storage.buckets (id, name)
values ('documents', 'documents')
on conflict do nothing;

-- Storage Policies
create policy "Users can upload documents"
  on storage.objects for insert
  with check ( bucket_id = 'documents' and auth.role() = 'authenticated' );

create policy "Users can view their own documents"
  on storage.objects for select
  using ( bucket_id = 'documents' and auth.role() = 'authenticated' );
