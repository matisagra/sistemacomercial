import { z } from "zod";

export const loginSchema = z.object({

    usuario: z
        .string()
        .min(1, "Ingrese el usuario"),

    contraseña: z
        .string()
        .min(1, "Ingrese la contraseña"),

});

export type LoginForm = z.infer<
    typeof loginSchema
>;