import { api } from "./axios";

export interface Venta {

    idVenta: number;

    idCliente: number;

    idUsuario: number;

    idCaja: number;

    numeroVenta: string;

    fechaHora: string;

    subTotal: number;

    estado: string;

}

export async function obtenerVentas() {

    const response = await api.get<Venta[]>(
        "/Venta",
    );

    return response.data;

}