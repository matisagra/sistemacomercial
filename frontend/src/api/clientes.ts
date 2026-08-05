import { api } from "./axios";

export interface Cliente {

    idCliente: number;

    codigo: string;

    nombre: string;

    apellido: string;

    dni: string;

    telefono: string;

    email: string;

    direccion: string;

    observaciones: string;

    estado: boolean;

}

export type ClienteInput = Omit<Cliente, "idCliente">;

export async function obtenerClientes() {

    const response = await api.get<Cliente[]>(
        "/Cliente",
    );

    return response.data;

}

export async function crearCliente(cliente: ClienteInput) {

    const response = await api.post<Cliente>(
        "/Cliente",
        cliente,
    );

    return response.data;

}

export async function actualizarCliente(
    { id, cliente }: { id: number; cliente: ClienteInput },
) {

    const response = await api.put<Cliente>(
        `/Cliente/${id}`,
        cliente,
    );

    return response.data;

}