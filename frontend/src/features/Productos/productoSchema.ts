import { z } from "zod";

export const productoSchema = z.object({

    idCategoria: z
        .number({ error: "Seleccioná una categoría" })
        .min(1, "Seleccioná una categoría"),

    idMarca: z
        .number({ error: "Seleccioná una marca" })
        .min(1, "Seleccioná una marca"),

    codigo: z
        .string()
        .min(1, "Ingrese el código"),

    codigoBarras: z
        .string()
        .min(1, "Ingrese el código de barras"),

    nombre: z
        .string()
        .min(1, "Ingrese el nombre"),

    descripcion: z
        .string()
        .optional(),

    precioVenta: z
        .number({ error: "Ingrese un precio válido" })
        .positive("El precio de venta debe ser mayor a 0"),

    stockActual: z
        .number({ error: "Ingrese un stock válido" })
        .min(0, "El stock no puede ser negativo"),

    stockMinimo: z
        .number({ error: "Ingrese un stock mínimo válido" })
        .min(0, "El stock mínimo no puede ser negativo"),

    estado: z
        .boolean(),

});

export type ProductoForm = z.infer<typeof productoSchema>;