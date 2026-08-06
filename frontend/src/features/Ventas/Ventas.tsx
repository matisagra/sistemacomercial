import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Trash2,
    Plus,
    Minus,
    ShoppingCart,
    Loader2,
    Lock,
} from "lucide-react";

import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

import { ConfirmarVentaModal, type DatosVentaPendiente } from "./ConfirmarVenta";
import { useProductos } from "@/hooks/useProductos";
import { useClientes } from "@/hooks/useClientes";
import { useCaja } from "@/hooks/useCaja";
import type { Producto } from "@/api/productos";

export interface ItemCarrito {
    producto: Producto;
    cantidad: number;
}

const formatCurrency = (n: number) =>
    n.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 2,
    });

export function Ventas() {
    const inputRef = useRef<HTMLInputElement>(null);

    const [datosVentaPendiente, setDatosVentaPendiente] = useState<DatosVentaPendiente | null>(null);
    const [modalKey, setModalKey] = useState(0);

    const [busqueda, setBusqueda] = useState("");
    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    const [idClienteSeleccionado, setIdClienteSeleccionado] = useState<number | "">("");
    const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);

    const [saldoInicial, setSaldoInicial] = useState("");
    const [observacionesApertura, setObservacionesApertura] = useState("");
    const [errorApertura, setErrorApertura] = useState<string | null>(null);

    const { data: productos, isLoading: cargandoProductos } = useProductos();
    const { data: clientes, isLoading: cargandoClientes } = useClientes();
    const {
        cajaAbierta,
        isLoading: cargandoCaja,
        abrirCaja,
        abriendo,
    } = useCaja();

    // Busca un cliente "Consumidor Final" por nombre para usarlo de default
    const clienteConsumidorFinal = useMemo(() => {
        if (!clientes) return undefined;
        return clientes.find((c) =>
            `${c.nombre} ${c.apellido}`.toLowerCase().includes("consumidor"),
        );
    }, [clientes]);

    // Cliente efectivo: el que eligió el usuario, o si todavía no eligió
    // nada, el de "Consumidor Final" como default. Se calcula en el render,
    // sin efecto, para no disparar un setState extra.
    const idClienteEfectivo =
        idClienteSeleccionado !== ""
            ? idClienteSeleccionado
            : (clienteConsumidorFinal?.idCliente ?? "");

    // El buscador arranca (y vuelve a quedar) enfocado para escanear directo
    useEffect(() => {
        if (cajaAbierta) {
            inputRef.current?.focus();
        }
    }, [cajaAbierta]);

    const resultadosBusqueda = useMemo(() => {
        if (!productos || !busqueda.trim()) return [];

        const termino = busqueda.trim().toLowerCase();

        return productos
            .filter(
                (p) =>
                    p.estado &&
                    (p.nombre.toLowerCase().includes(termino) ||
                        p.codigo.toLowerCase().includes(termino) ||
                        p.codigoBarras.toLowerCase().includes(termino)),
            )
            .slice(0, 8);
    }, [productos, busqueda]);

    function agregarAlCarrito(producto: Producto) {
        setCarrito((actual) => {
            const existente = actual.find((i) => i.producto.idProducto === producto.idProducto);

            if (existente) {
                return actual.map((i) =>
                    i.producto.idProducto === producto.idProducto
                        ? { ...i, cantidad: i.cantidad + 1 }
                        : i,
                );
            }

            return [...actual, { producto, cantidad: 1 }];
        });

        setBusqueda("");
        inputRef.current?.focus();
    }

    function handleBusquedaKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key !== "Enter") return;
        e.preventDefault();

        const termino = busqueda.trim().toLowerCase();
        if (!termino || !productos) return;

        // Match exacto de código de barras = venía de un lector físico
        const porBarras = productos.find(
            (p) => p.codigoBarras.toLowerCase() === termino,
        );

        if (porBarras) {
            agregarAlCarrito(porBarras);
            return;
        }

        // Si no matcheó exacto, agrega el primer resultado de la búsqueda
        if (resultadosBusqueda.length > 0) {
            agregarAlCarrito(resultadosBusqueda[0]);
        }
    }

    function cambiarCantidad(idProducto: number, delta: number) {
        setCarrito((actual) =>
            actual
                .map((i) =>
                    i.producto.idProducto === idProducto
                        ? { ...i, cantidad: i.cantidad + delta }
                        : i,
                )
                .filter((i) => i.cantidad > 0),
        );
    }

    function quitarDelCarrito(idProducto: number) {
        setCarrito((actual) => actual.filter((i) => i.producto.idProducto !== idProducto));
    }

    const subtotal = useMemo(
        () => carrito.reduce((acc, i) => acc + i.producto.precioVenta * i.cantidad, 0),
        [carrito],
    );

    const montoDescuento = subtotal * (descuentoPorcentaje / 100);
    const total = subtotal - montoDescuento;

    async function handleAbrirCaja() {
        setErrorApertura(null);

        const saldo = Number(saldoInicial);

        if (Number.isNaN(saldo) || saldo < 0) {
            setErrorApertura("Ingresá un saldo inicial válido.");
            return;
        }

        try {
            await abrirCaja({
                saldoInicial: saldo,
                observaciones: observacionesApertura,
            });
        } catch (error) {
            console.error(error);
            setErrorApertura("No se pudo abrir la caja.");
        }
    }

    function handleProcesarVenta() {
        if (!cajaAbierta || carrito.length === 0 || idClienteEfectivo === "") return;

        setDatosVentaPendiente({
            carrito,
            idCliente: idClienteEfectivo,
            nombreCliente: clientes?.find((c) => c.idCliente === idClienteEfectivo)?.nombre ?? "",
            apellidoCliente: clientes?.find((c) => c.idCliente === idClienteEfectivo)?.apellido ?? "",
            idCaja: cajaAbierta.idCaja,
            descuentoPorcentaje,
            subtotal,
            montoDescuento,
            total,
        });

        // key nueva en cada apertura: fuerza que el modal remonte con estado
        // limpio (forma de pago, monto recibido) sin necesitar un efecto
        setModalKey((k) => k + 1);
    }

    function handleCerrarModal() {
        setDatosVentaPendiente(null);
    }

    function handleVentaConfirmada() {
        setCarrito([]);
        setDescuentoPorcentaje(0);
    }

    const cargando = cargandoProductos || cargandoClientes || cargandoCaja;

    if (cargando) {
        return (
            <div className="flex h-screen bg-zinc-950 text-white">
                <Sidebar />
                <div className="flex flex-1 flex-col">
                    <Header />
                    <main className="flex flex-1 items-center justify-center gap-2 text-zinc-500">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Cargando...
                    </main>
                </div>
            </div>
        );
    }

    // Sin caja abierta: no se puede vender, primero hay que abrir turno
    if (!cajaAbierta) {
        return (
            <div className="flex h-screen bg-zinc-950 text-white">
                <Sidebar />
                <div className="flex flex-1 flex-col">
                    <Header />
                    <main className="flex flex-1 items-center justify-center p-6">
                        <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-8">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                                <Lock className="h-6 w-6 text-amber-400" />
                            </div>
                            <h2 className="mt-4 text-lg font-semibold">No hay caja abierta</h2>
                            <p className="mt-1 text-sm text-zinc-400">
                                Antes de vender, abrí un turno de caja con el saldo inicial.
                            </p>

                            <div className="mt-6 space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        Saldo inicial
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={saldoInicial}
                                        onChange={(e) => setSaldoInicial(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        Observaciones
                                    </label>
                                    <Input
                                        placeholder="Opcional"
                                        value={observacionesApertura}
                                        onChange={(e) => setObservacionesApertura(e.target.value)}
                                    />
                                </div>

                                {errorApertura && (
                                    <p className="text-sm text-red-400">{errorApertura}</p>
                                )}

                                <Button onClick={handleAbrirCaja} disabled={abriendo}>
                                    <span className="flex items-center justify-center gap-2">
                                        {abriendo && <Loader2 className="h-4 w-4 animate-spin" />}
                                        {abriendo ? "Abriendo..." : "Abrir caja"}
                                    </span>
                                </Button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-zinc-950 text-white">
            <Sidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />

                <main className="flex flex-1 gap-6 overflow-hidden p-6">

                    {/* Columna izquierda: buscador + carrito */}
                    <div className="flex flex-1 flex-col gap-4 overflow-hidden">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                            <Input
                                ref={inputRef}
                                className="pl-10"
                                placeholder="Escaneá un código de barras o buscá por nombre..."
                                autoComplete="off"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                onKeyDown={handleBusquedaKeyDown}
                            />

                            <AnimatePresence>
                                {resultadosBusqueda.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-xl"
                                    >
                                        {resultadosBusqueda.map((p) => (
                                            <button
                                                key={p.idProducto}
                                                onClick={() => agregarAlCarrito(p)}
                                                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-zinc-800"
                                            >
                                                <div>
                                                    <p className="font-medium">{p.nombre}</p>
                                                    <p className="text-xs text-zinc-500">
                                                        {p.codigo} · Stock: {p.stockActual}
                                                    </p>
                                                </div>
                                                <span className="font-medium text-emerald-400">
                                                    {formatCurrency(p.precioVenta)}
                                                </span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex-1 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900">
                            {carrito.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center gap-2 p-10 text-zinc-600">
                                    <ShoppingCart className="h-10 w-10" />
                                    <p className="text-sm">El carrito está vacío</p>
                                </div>
                            ) : (
                                <table className="w-full text-left text-sm">
                                    <thead className="sticky top-0 bg-zinc-900">
                                        <tr className="border-b border-zinc-800 text-xs uppercase tracking-wide text-zinc-500">
                                            <th className="px-4 py-3 font-medium">Producto</th>
                                            <th className="px-4 py-3 font-medium text-right">Precio</th>
                                            <th className="px-4 py-3 font-medium text-center">Cantidad</th>
                                            <th className="px-4 py-3 font-medium text-right">Subtotal</th>
                                            <th className="px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <AnimatePresence initial={false}>
                                            {carrito.map((item) => (
                                                <motion.tr
                                                    key={item.producto.idProducto}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="border-b border-zinc-800/60 last:border-0"
                                                >
                                                    <td className="px-4 py-3 font-medium">
                                                        {item.producto.nombre}
                                                    </td>
                                                    <td className="px-4 py-3 text-right text-zinc-400">
                                                        {formatCurrency(item.producto.precioVenta)}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => cambiarCantidad(item.producto.idProducto, -1)}
                                                                className="rounded p-1 hover:bg-zinc-800"
                                                            >
                                                                <Minus className="h-3.5 w-3.5" />
                                                            </button>
                                                            <span className="w-6 text-center">{item.cantidad}</span>
                                                            <button
                                                                onClick={() => cambiarCantidad(item.producto.idProducto, 1)}
                                                                className="rounded p-1 hover:bg-zinc-800"
                                                            >
                                                                <Plus className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-medium text-emerald-400">
                                                        {formatCurrency(item.producto.precioVenta * item.cantidad)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button
                                                            onClick={() => quitarDelCarrito(item.producto.idProducto)}
                                                            className="rounded p-1 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Columna derecha: cliente + resumen */}
                    <div className="flex w-80 shrink-0 flex-col gap-4">
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                            <label className="mb-1 block text-sm text-zinc-400">
                                Cliente
                            </label>
                            <select
                                value={idClienteEfectivo}
                                onChange={(e) => setIdClienteSeleccionado(Number(e.target.value))}
                                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="" disabled>Seleccionar cliente...</option>
                                {clientes?.filter((c) => c.estado).map((c) => (
                                    <option key={c.idCliente} value={c.idCliente}>
                                        {c.nombre} {c.apellido}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                            <label className="mb-1 block text-sm text-zinc-400">
                                Descuento (%)
                            </label>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                step="0.01"
                                value={descuentoPorcentaje}
                                onChange={(e) => setDescuentoPorcentaje(Number(e.target.value) || 0)}
                            />
                        </div>

                        <div className="mt-auto space-y-2 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                            <div className="flex justify-between text-sm text-zinc-400">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-zinc-400">
                                <span>Descuento</span>
                                <span>- {formatCurrency(montoDescuento)}</span>
                            </div>
                            <div className="flex justify-between border-t border-zinc-800 pt-2 text-lg font-bold text-white">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>

                            <Button
                                onClick={handleProcesarVenta}
                                disabled={carrito.length === 0 || idClienteEfectivo === ""}
                            >
                                Procesar venta
                            </Button>
                        </div>
                    </div>

                </main>
            </div>

            <ConfirmarVentaModal
                key={modalKey}
                open={datosVentaPendiente !== null}
                datos={datosVentaPendiente}
                onClose={handleCerrarModal}
                onVentaConfirmada={handleVentaConfirmada}
            />
        </div>
    );
}