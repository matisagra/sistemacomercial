import { api } from "./axios";

export interface Marca {

    idMarca: number;

    nombre: string;

    descripcion: string | null;

    estado: boolean;

}

export async function obtenerMarcas() {

    const response = await api.get<Marca[]>(
        "/Marca",
    );

    return response.data;

}