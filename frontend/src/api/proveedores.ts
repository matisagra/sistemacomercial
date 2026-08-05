import { api } from "./axios";

export interface Proveedor {

    idProveedor: number;

    codigo: string;

    razonSocial: string;

    nombreFantasia: string;

    cuit: string;

    telefono: string;

    email: string;

    direccion: string;

    ciudad: string;

    provincia: string;

    observaciones: string;

    estado: boolean;

}

export type ProveedorInput = Omit<Proveedor, "idProveedor">;

export async function obtenerProveedores() {

    const response = await api.get<Proveedor[]>(
        "/Proveedor",
    );

    return response.data;

}

export async function crearProveedor(proveedor: ProveedorInput) {

    const response = await api.post<Proveedor>(
        "/Proveedor",
        proveedor,
    );

    return response.data;

}

export async function actualizarProveedor(
    { id, proveedor }: { id: number; proveedor: ProveedorInput },
) {

    const response = await api.put<Proveedor>(
        `/Proveedor/${id}`,
        proveedor,
    );

    return response.data;

}