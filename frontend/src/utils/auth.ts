const TOKEN_KEY = "sistema-comercial-token";
const USUARIO_KEY = "sistema-comercial-usuario";

export function guardarToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function obtenerToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function eliminarToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export function estaAutenticado() {
    return !!obtenerToken();
}

export interface UsuarioGuardado {
    usuario: string;
    nombre: string;
    rol: string;
}

export function guardarUsuario(usuario: UsuarioGuardado) {
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
}

export function obtenerUsuario(): UsuarioGuardado | null {
    const raw = localStorage.getItem(USUARIO_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as UsuarioGuardado;
    } catch {
        return null;
    }
}

export function eliminarUsuario() {
    localStorage.removeItem(USUARIO_KEY);
}

export function cerrarSesion() {
    eliminarToken();
    eliminarUsuario();
}