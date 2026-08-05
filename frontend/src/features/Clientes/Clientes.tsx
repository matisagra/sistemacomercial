import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Plus, Loader2, Edit } from "lucide-react";

import { Input } from "@/components/Input";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useClientes } from "@/hooks/useClientes";
import type { Cliente } from "@/api/clientes";

function obtenerMensajeError(error: unknown): string {
    const err = error as { response?: { data?: unknown } };
    const data = err?.response?.data;

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (data && typeof data === "object") {
        const obj = data as { mensaje?: string; message?: string; title?: string };
        if (obj.mensaje) return obj.mensaje;
        if (obj.message) return obj.message;
        if (obj.title) return obj.title;
    }

    return "No se pudo actualizar el estado del cliente.";
}

export function Clientes() {
    const [busqueda, setBusqueda] = useState("");
    const [toggleandoId, setToggleandoId] = useState<number | null>(null);
    const [errorToggle, setErrorToggle] = useState<string | null>(null);

    const {
        data: clientes,
        isLoading,
        isError,
        actualizarCliente,
    } = useClientes();

    const clientesFiltrados = useMemo(() => {
        if (!clientes) return [];

        const termino = busqueda.trim().toLowerCase();
        if (!termino) return clientes;

        return clientes.filter(
            (c) =>
                c.nombre.toLowerCase().includes(termino) ||
                c.apellido.toLowerCase().includes(termino) ||
                c.dni.toLowerCase().includes(termino) ||
                c.codigo.toLowerCase().includes(termino),
        );
    }, [clientes, busqueda]);

    async function handleToggleEstado(cliente: Cliente) {
        setErrorToggle(null);
        setToggleandoId(cliente.idCliente);

        const { idCliente, ...resto } = cliente;

        try {
            await actualizarCliente({
                id: idCliente,
                cliente: { ...resto, estado: !cliente.estado },
            });
        } catch (error) {
            setErrorToggle(obtenerMensajeError(error));
        } finally {
            setToggleandoId(null);
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-screen bg-zinc-950 text-white">
                <Sidebar />
                <div className="flex flex-1 flex-col">
                    <Header />
                    <main className="flex flex-1 items-center justify-center gap-2 text-zinc-500">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Cargando clientes...
                    </main>
                </div>
            </div>
        );
    }

    if (isError || !clientes) {
        return (
            <div className="flex h-screen bg-zinc-950 text-white">
                <Sidebar />
                <div className="flex flex-1 flex-col">
                    <Header />
                    <main className="p-6">
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-400">
                            No se pudieron cargar los clientes. Verificá que la API esté
                            corriendo en http://localhost:5187.
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
            <Sidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Clientes</h1>
                            <p className="mt-1 text-zinc-400">
                                {clientes.length} clientes cargados en total
                            </p>
                        </div>

                        <Link
                            to="/clientes/nuevo"
                            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-emerald-400"
                        >
                            <Plus className="h-4 w-4" />
                            Nuevo cliente
                        </Link>
                    </div>

                    {errorToggle && (
                        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {errorToggle}
                        </div>
                    )}

                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                        <Input
                            className="pl-10"
                            placeholder="Buscar por nombre, apellido, DNI o código..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
                                    <th className="px-5 py-3 font-medium">Código</th>
                                    <th className="px-5 py-3 font-medium">Nombre</th>
                                    <th className="px-5 py-3 font-medium">DNI</th>
                                    <th className="px-5 py-3 font-medium">Teléfono</th>
                                    <th className="px-5 py-3 font-medium">Email</th>
                                    <th className="px-5 py-3 font-medium text-center">Estado</th>
                                    <th className="px-5 py-3 font-medium text-center">Editar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientesFiltrados.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-5 py-10 text-center text-zinc-500"
                                        >
                                            No se encontraron clientes para "{busqueda}".
                                        </td>
                                    </tr>
                                )}

                                {clientesFiltrados.map((c, i) => {
                                    const toggleando = toggleandoId === c.idCliente;

                                    return (
                                        <motion.tr
                                            key={c.idCliente}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.02 }}
                                            className="border-b border-zinc-800/60 transition-colors last:border-0 hover:bg-zinc-800/40"
                                        >
                                            <td className="px-5 py-3 font-mono text-xs text-zinc-400">
                                                {c.codigo}
                                            </td>
                                            <td className="px-5 py-3 font-medium">
                                                {c.nombre} {c.apellido}
                                            </td>
                                            <td className="px-5 py-3 text-zinc-400">
                                                {c.dni || "—"}
                                            </td>
                                            <td className="px-5 py-3 text-zinc-400">
                                                {c.telefono || "—"}
                                            </td>
                                            <td className="px-5 py-3 text-zinc-400">
                                                {c.email || "—"}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleToggleEstado(c)}
                                                        disabled={toggleando}
                                                        title={c.estado ? "Marcar como inactivo" : "Marcar como activo"}
                                                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
                                                            c.estado ? "bg-emerald-500" : "bg-zinc-700"
                                                        }`}
                                                    >
                                                        <motion.span
                                                            animate={{ x: c.estado ? 20 : 2 }}
                                                            transition={{ duration: 0.15 }}
                                                            className="absolute top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white"
                                                        >
                                                            {toggleando && (
                                                                <Loader2 className="h-3 w-3 animate-spin text-zinc-500" />
                                                            )}
                                                        </motion.span>
                                                    </button>
                                                    <span
                                                        className={`text-xs font-medium ${
                                                            c.estado ? "text-emerald-400" : "text-zinc-500"
                                                        }`}
                                                    >
                                                        {c.estado ? "Activo" : "Inactivo"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-center">
                                                <Link
                                                    to={`/clientes/editar/${c.idCliente}`}
                                                    className="inline-flex rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                                    title="Editar"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}
