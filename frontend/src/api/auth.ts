import { api } from "./axios";

export interface LoginRequest {

    nombreUsuario: string;

    contraseña: string;

}

export interface LoginResponse {

    token: string;

    usuario: string;

    nombre: string;

    rol: string;

}

export async function login(
    data: LoginRequest,
) {

    const response = await api.post<LoginResponse>(
        "/Auth/login",
        data,
    );

    return response.data;

}