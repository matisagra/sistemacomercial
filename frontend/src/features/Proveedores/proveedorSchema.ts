import { z } from "zod";

export const proveedorSchema = z.object({

    codigo: z
        .string()
        .min(1, "Ingrese el código"),

    razonSocial: z
        .string()
        .min(1, "Ingrese la razón social"),

    nombreFantasia: z
        .string()
        .optional(),

    cuit: z
        .string()
        .min(1, "Ingrese el CUIT"),

    telefono: z
        .string()
        .optional(),

    email: z
        .union([z.literal(""), z.string().email("Ingrese un email válido")])
        .optional(),

    direccion: z
        .string()
        .optional(),

    ciudad: z
        .string()
        .optional(),

    provincia: z
        .string()
        .optional(),

    observaciones: z
        .string()
        .optional(),

    estado: z
        .boolean(),

});

export type ProveedorForm = z.infer<typeof proveedorSchema>;