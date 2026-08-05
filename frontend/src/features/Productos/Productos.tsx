import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Plus, Loader2, AlertTriangle, Edit } from "lucide-react";

import { Input } from "@/components/Input";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useProductos } from "@/hooks/useProductos";
import { useCategorias } from "@/hooks/useCategorias";
import { useMarcas } from "@/hooks/useMarcas";
import type { Producto } from "@/api/productos";

const formatCurrency = (n: number) =>
    n.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    });

// Intenta sacar un mensaje legible del error que devuelve axios/la API
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

    return "No se pudo actualizar el estado del producto.";
}

export function Productos() {
    const [busqueda, setBusqueda] = useState("");
    const [categoriaFiltro, setCategoriaFiltro] = useState<string>("todas");
    const [marcaFiltro, setMarcaFiltro] = useState<string>("todas");

    const [toggleandoId, setToggleandoId] = useState<number | null>(null);
    const [errorToggle, setErrorToggle] = useState<string | null>(null);

    const {
        data: productos,
        isLoading: cargandoProductos,
        isError: errorProductos,
        actualizarProducto,
    } = useProductos();

    const {
        data: categorias,
        isLoading: cargandoCategorias,
    } = useCategorias();

    const {
        data: marcas,
        isLoading: cargandoMarcas,
    } = useMarcas();

    const nombreCategoria = useMemo(() => {
        const mapa = new Map<number, string>();
        categorias?.forEach((c) => mapa.set(c.idCategoria, c.nombre));
        return (id: number) => mapa.get(id) ?? "—";
    }, [categorias]);

    const nombreMarca = useMemo(() => {
        const mapa = new Map<number, string>();
        marcas?.forEach((m) => mapa.set(m.idMarca, m.nombre));
        return (id: number) => mapa.get(id) ?? "—";
    }, [marcas]);

    const productosFiltrados = useMemo(() => {
        if (!productos) return [];

        const termino = busqueda.trim().toLowerCase();

        return productos.filter((p) => {
            const cumpleBusqueda =
                !termino ||
                p.nombre.toLowerCase().includes(termino) ||
                p.codigo.toLowerCase().includes(termino) ||
                p.codigoBarras.toLowerCase().includes(termino);

            const cumpleCategoria =
                categoriaFiltro === "todas" || p.idCategoria.toString() === categoriaFiltro;

            const cumpleMarca =
                marcaFiltro === "todas" || p.idMarca.toString() === marcaFiltro;

            return cumpleBusqueda && cumpleCategoria && cumpleMarca;
        });
    }, [productos, busqueda, categoriaFiltro, marcaFiltro]);

    const isLoading =
        cargandoProductos || cargandoCategorias || cargandoMarcas;

    async function handleToggleEstado(producto: Producto) {
        setErrorToggle(null);
        setToggleandoId(producto.idProducto);

        const { idProducto, ...resto } = producto;

        try {
            await actualizarProducto({
                id: idProducto,
                producto: { ...resto, estado: !producto.estado },
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
                        Cargando productos...
                    </main>
                </div>
            </div>
        );
    }

    if (errorProductos || !productos) {
        return (
            <div className="flex h-screen bg-zinc-950 text-white">
                <Sidebar />
                <div className="flex flex-1 flex-col">
                    <Header />
                    <main className="p-6">
                        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 text-red-400">
                            No se pudieron cargar los productos. Verificá que la API esté
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
                            <h1 className="text-3xl font-bold">Productos</h1>
                            <p className="mt-1 text-zinc-400">
                                {productos.length} productos cargados en total
                            </p>
                        </div>

                        <Link
                            to="/productos/nuevo"
                            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-emerald-400"
                        >
                            <Plus className="h-4 w-4" />
                            Nuevo producto
                        </Link>
                    </div>

                    {errorToggle && (
                        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {errorToggle}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                            <Input
                                className="pl-10"
                                placeholder="Buscar por nombre, código o barras..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>

                        <select
                            value={categoriaFiltro}
                            onChange={(e) => setCategoriaFiltro(e.target.value)}
                            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="todas">Todas las categorías</option>
                            {categorias?.map((c) => (
                                <option key={c.idCategoria} value={c.idCategoria}>
                                    {c.nombre}
                                </option>
                            ))}
                        </select>

                        <select
                            value={marcaFiltro}
                            onChange={(e) => setMarcaFiltro(e.target.value)}
                            className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="todas">Todas las marcas</option>
                            {marcas?.map((m) => (
                                <option key={m.idMarca} value={m.idMarca}>
                                    {m.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
                                    <th className="px-5 py-3 font-medium">Código</th>
                                    <th className="px-5 py-3 font-medium">Nombre</th>
                                    <th className="px-5 py-3 font-medium">Categoría</th>
                                    <th className="px-5 py-3 font-medium">Marca</th>
                                    <th className="px-5 py-3 font-medium text-right">Precio</th>
                                    <th className="px-5 py-3 font-medium text-right">Stock</th>
                                    <th className="px-5 py-3 font-medium text-center">Estado</th>
                                    <th className="px-5 py-3 font-medium text-center">Editar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosFiltrados.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-5 py-10 text-center text-zinc-500"
                                        >
                                            No se encontraron productos con los filtros aplicados.
                                        </td>
                                    </tr>
                                )}

                                {productosFiltrados.map((p, i) => {
                                    const stockBajo = p.stockActual <= p.stockMinimo;
                                    const toggleando = toggleandoId === p.idProducto;

                                    return (
                                        <motion.tr
                                            key={p.idProducto}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.02 }}
                                            className={`border-b border-zinc-800/60 transition-colors last:border-0 hover:bg-zinc-800/40 ${
                                                stockBajo ? "bg-red-500/5" : ""
                                            }`}
                                        >
                                            <td className="px-5 py-3 font-mono text-xs text-zinc-400">
                                                {p.codigo}
                                            </td>
                                            <td className="px-5 py-3 font-medium">
                                                {p.nombre}
                                            </td>
                                            <td className="px-5 py-3 text-zinc-400">
                                                {nombreCategoria(p.idCategoria)}
                                            </td>
                                            <td className="px-5 py-3 text-zinc-400">
                                                {nombreMarca(p.idMarca)}
                                            </td>
                                            <td className="px-5 py-3 text-right font-medium">
                                                {formatCurrency(p.precioVenta)}
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                                        stockBajo
                                                            ? "bg-red-500/10 text-red-400"
                                                            : "bg-zinc-800 text-zinc-300"
                                                    }`}
                                                >
                                                    {stockBajo && (
                                                        <AlertTriangle className="h-3 w-3" />
                                                    )}
                                                    {p.stockActual}/{p.stockMinimo}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleToggleEstado(p)}
                                                        disabled={toggleando}
                                                        title={p.estado ? "Marcar como inactivo" : "Marcar como activo"}
                                                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
                                                            p.estado ? "bg-emerald-500" : "bg-zinc-700"
                                                        }`}
                                                    >
                                                        <motion.span
                                                            animate={{ x: p.estado ? 20 : 2 }}
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
                                                            p.estado ? "text-emerald-400" : "text-zinc-500"
                                                        }`}
                                                    >
                                                        {p.estado ? "Activo" : "Inactivo"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-center">
                                                <Link
                                                    to={`/productos/editar/${p.idProducto}`}
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
