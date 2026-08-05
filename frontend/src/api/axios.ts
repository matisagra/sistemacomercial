import axios from "axios";
import { obtenerToken, cerrarSesion } from "@/utils/auth";

export const api = axios.create({
    baseURL: "http://localhost:5187/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Agrega el Bearer token a cada request si hay sesión activa
api.interceptors.request.use((config) => {
    const token = obtenerToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Si el token expiró o es inválido, limpia la sesión y manda al login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            cerrarSesion();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);