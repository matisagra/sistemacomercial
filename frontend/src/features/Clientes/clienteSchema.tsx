import { z } from "zod";

export const clienteSchema = z.object({

    codigo: z
        .string()
        .min(1, "Ingrese el código"),

    nombre: z
        .string()
        .min(1, "Ingrese el nombre"),

    apellido: z
        .string()
        .min(1, "Ingrese el apellido"),

    dni: z
        .string()
        .min(1, "Ingrese el DNI"),

    telefono: z
        .string()
        .optional(),

    email: z
        .union([z.literal(""), z.string().email("Ingrese un email válido")])
        .optional(),

    direccion: z
        .string()
        .optional(),

    observaciones: z
        .string()
        .optional(),

    estado: z
        .boolean(),

});

export type ClienteForm = z.infer<typeof clienteSchema>;