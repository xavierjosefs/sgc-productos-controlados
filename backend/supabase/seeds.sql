-- Seed data for estados_solicitud
-- IDs inferred from backend/src/controllers/request.controllers.js
INSERT INTO public.estados_solicitud (id, nombre_mostrar) VALUES
(1, 'Borrador'), -- Assumed based on 'Pending' context usually being 1 or similar
(3, 'Devuelta'),
(5, 'Devuelta por corrección'),
(10, 'Aprobada'),
(12, 'Enviada')
ON CONFLICT (id) DO NOTHING;

-- Seed data for tipos_servicio
-- You should populate this with actual service types
INSERT INTO public.tipos_servicio (id, nombre_servicio) VALUES
(1, 'Importación de Drogas'),
(2, 'Exportación de Drogas'),
(3, 'Permiso de Funcionamiento')
ON CONFLICT (id) DO NOTHING;
