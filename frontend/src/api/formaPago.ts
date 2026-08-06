import { api } from "./axios";

export interface FormaPago {

    idFormaPago: number;

    nombre: string;

    estado: boolean;

}

export async function obtenerFormasPago() {

    const response = await api.get<FormaPago[]>(
        "/FormaPago",
    );

    return response.data;

}