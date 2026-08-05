import { api } from "./axios";

export interface Configuracion {

    idConfiguracion: number;

    nombreNegocio: string;

    razonSocial: string;

    cuit: string;

    direccion: string;

    telefono: string;

    email: string;

    logo: string;

    moneda: string;

    permitirStockNegativo: boolean;

    sugerirPrecioVenta: boolean;

    stockMinimoDefecto: number;

    intentosLogin: number;

}

export async function obtenerConfiguracion() {

    const response = await api.get<Configuracion>(
        "/Configuracion",
    );

    return response.data;

}