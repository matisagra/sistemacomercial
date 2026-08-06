import { api } from "./axios";

export interface Producto {

    idProducto: number;

    idCategoria: number;

    idMarca: number;

    codigo: string;

    codigoBarras: string;

    nombre: string;

    descripcion: string;

    precioCompra: number;

    precioVenta: number;

    margenGanancia: number;

    stockActual: number;

    stockMinimo: number;

    estado: boolean;

}


export type ProductoInput = Omit<
    Producto,
    "idProducto" | "precioCompra" | "margenGanancia"
>;

export async function obtenerProductos() {

    const response = await api.get<Producto[]>(
        "/Producto",
    );

    return response.data;

}

export async function crearProducto(producto: ProductoInput) {

    const response = await api.post<Producto>(
        "/Producto",
        producto,
    );

    return response.data;

}

export async function actualizarProducto(
    { id, producto }: { id: number; producto: ProductoInput },
) {

    const response = await api.put<Producto>(
        `/Producto/${id}`,
        producto,
    );

    return response.data;

}