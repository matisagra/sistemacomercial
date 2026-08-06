import { api } from "./axios";

export interface Caja {

    idCaja: number;

    numeroCaja: string;

    idUsuario: number;

    fechaApertura: string;

    fechaCierre: string | null;

    saldoInicial: number;

    saldoFinal: number;

    saldoEsperado: number;

    diferencia: number;

    observaciones: string;

    estado: string; // "Abierta" | "Cerrada"

}

export interface AbrirCajaInput {
    saldoInicial: number;
    observaciones: string;
}

// Ojo: tu Swagger muestra el mismo body (saldoInicial + observaciones)
// para cerrar. Lo dejo tal cual lo pasaste; si en la práctica el cierre
// necesita el saldo final contado, avisame y lo ajustamos.
export interface CerrarCajaInput {
    saldoInicial: number;
    observaciones: string;
}

export async function obtenerCajas() {

    const response = await api.get<Caja[]>(
        "/Caja",
    );

    return response.data;

}

export async function abrirCaja(data: AbrirCajaInput) {

    const response = await api.post<Caja>(
        "/Caja/abrir",
        data,
    );

    return response.data;

}

export async function cerrarCaja(
    { id, data }: { id: number; data: CerrarCajaInput },
) {

    const response = await api.put<Caja>(
        `/Caja/cerrar/${id}`,
        data,
    );

    return response.data;

}