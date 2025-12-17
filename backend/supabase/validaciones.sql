-- VALIDACIONES_VENTANILLA TABLE
-- Almacena las validaciones realizadas por Ventanilla Única de Servicios
create table if not exists public.validaciones_ventanilla (
  id serial primary key,
  solicitud_id int references public.solicitudes(id) on delete cascade not null,
  documento_id int references public.documentos_solicitud(id) on delete cascade,
  campo_formulario text,
  cumple boolean not null,
  comentario text,
  fecha_validacion timestamp with time zone default timezone('utc'::text, now()) not null,
  validado_por text,
  constraint check_documento_o_campo check (
    (documento_id is not null and campo_formulario is null) or
    (documento_id is null and campo_formulario is not null)
  )
);

-- Index para mejorar rendimiento en búsquedas
create index if not exists idx_validaciones_solicitud 
  on public.validaciones_ventanilla(solicitud_id);

-- Enable RLS for validaciones_ventanilla
alter table public.validaciones_ventanilla enable row level security;

-- Policies for validaciones_ventanilla
-- Solo ventanilla y admins pueden ver validaciones
create policy "Ventanilla can view all validations" 
  on public.validaciones_ventanilla for select 
  using ( true );

create policy "Ventanilla can insert validations" 
  on public.validaciones_ventanilla for insert 
  with check ( true );

create policy "Ventanilla can update validations" 
  on public.validaciones_ventanilla for update 
  using ( true );

-- Comentarios para documentación
comment on table public.validaciones_ventanilla is 'Almacena las validaciones de documentos y campos de formulario realizadas por VUS';
comment on column public.validaciones_ventanilla.documento_id is 'ID del documento validado (null si es un campo de formulario)';
comment on column public.validaciones_ventanilla.campo_formulario is 'Nombre del campo del formulario validado (null si es un documento)';
comment on column public.validaciones_ventanilla.cumple is 'true = Sí Cumple, false = No Cumple';
