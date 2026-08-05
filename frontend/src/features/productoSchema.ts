import { z } from "zod";

export const productoSchema = z.object({

    idCategoria: z
        .number({ message: "Seleccioná una categoría" })
        .min(1, "Seleccioná una categoría"),

    idMarca: z
        .number({ message: "Seleccioná una marca" })
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

    precioCompra: z
        .number({ message: "Ingrese un precio válido" })
        .positive("El precio de compra debe ser mayor a 0"),

    precioVenta: z
        .number({ message: "Ingrese un precio válido" })
        .positive("El precio de venta debe ser mayor a 0"),

    stockActual: z
        .number({ message: "Ingrese un stock válido" })
        .min(0, "El stock no puede ser negativo"),

    stockMinimo: z
        .number({ message: "Ingrese un stock mínimo válido" })
        .min(0, "El stock mínimo no puede ser negativo"),

    estado: z
        .boolean(),

}).refine(
    (data) => data.precioVenta > data.precioCompra,
    {
        message: "El precio de venta debe ser mayor al de compra",
        path: ["precioVenta"],
    },
);

export type ProductoForm = z.infer<typeof productoSchema>;