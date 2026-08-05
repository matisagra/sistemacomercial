import { api } from "./axios";

export interface Categoria {

    idCategoria: number;

    nombre: string;

    descripcion: string | null;

    estado: boolean;

}

export async function obtenerCategorias() {

    const response = await api.get<Categoria[]>(
        "/Categoria",
    );

    return response.data;

}