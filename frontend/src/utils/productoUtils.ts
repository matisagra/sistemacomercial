import type { Producto } from "@/api/productos";
import { generarSiguienteCodigo as generarCodigo } from "@/utils/codigo";

export function generarSiguienteCodigo(productos: Producto[]): string {
    return generarCodigo(productos, "P");
}