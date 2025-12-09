import { z } from 'zod';

// Validacion de empleado
export const employeeSchema = z.object({
    cedula: z
        .string()
        .min(1, 'La cédula es requerida')
        .regex(/^\d{3}-\d{7}-\d{1}$/, 'Formato de cédula inválido (000-0000000-0)'),

    nombre: z
        .string()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres'),

    email: z
        .string()
        .min(1, 'El email es requerido')
        .email('Formato de email inválido'),

    rol: z
        .string()
        .min(1, 'Debe seleccionar un rol'),
});

// Validacion de servicio
export const serviceSchema = z.object({
    codigo: z
        .string()
        .min(1, 'El código del servicio es requerido')
        .max(50, 'El código no puede exceder 50 caracteres'),

    nombre: z
        .string()
        .min(3, 'El nombre del servicio debe tener al menos 3 caracteres')
        .max(200, 'El nombre no puede exceder 200 caracteres'),

    tipoFormulario: z
        .string()
        .min(1, 'Debe seleccionar un tipo de formulario'),

    precioTipo: z.enum(['conPrecio', 'sinCosto']),

    precio: z
        .string()
        .optional()
        .refine((val) => {
            if (!val) return true;
            const num = parseFloat(val);
            return !isNaN(num) && num > 0;
        }, 'El precio debe ser mayor a 0'),
});

// Convertimos los errores de zod a errores de form
export const zodErrorToFormErrors = (zodError) => {
    const errors = {};

    zodError.errors.forEach((error) => {
        const field = error.path[0];
        if (field && !errors[field]) {
            errors[field] = error.message;
        }
    });

    return errors;
};

// Validamos el schema
export const validateWithSchema = (schema, data) => {
    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true, errors: {} };
    }

    return {
        success: false,
        errors: zodErrorToFormErrors(result.error),
    };
};
