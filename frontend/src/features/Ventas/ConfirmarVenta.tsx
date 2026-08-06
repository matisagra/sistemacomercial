import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2, CheckCircle2, User, Calendar, ShoppingBag } from "lucide-react";

import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

import { useVentas } from "@/hooks/useVentas";
import { useFormasPago } from "@/hooks/useFormasPago";
import type { ItemCarrito } from "./Ventas";

export interface DatosVentaPendiente {
    carrito: ItemCarrito[];
    idCliente: number;
    nombreCliente?: string; 
    apellidoCliente?: string;
    idCaja: number;
    descuentoPorcentaje: number;
    subtotal: number;
    montoDescuento: number;
    total: number;
}

interface ConfirmarVentaModalProps {
    open: boolean;
    datos: DatosVentaPendiente | null;
    onClose: () => void;
    onVentaConfirmada: () => void;
}

const formatCurrency = (n: number) =>
    n.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 2,
    });

export function ConfirmarVentaModal({
    open,
    datos,
    onClose,
    onVentaConfirmada,
}: ConfirmarVentaModalProps) {
    const { data: formasPago, isLoading: cargandoFormasPago } = useFormasPago();
    const { crearVenta, creando } = useVentas();

    const [idFormaPago, setIdFormaPago] = useState<number | string>("");
    const [montoRecibido, setMontoRecibido] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [ventaConfirmada, setVentaConfirmada] = useState<{ numeroVenta: string } | null>(null);

    // Encontrar la forma de pago por defecto (Efectivo) de manera segura para el render
    const efectivoPorDefecto = formasPago?.find(
        (f) => f.estado && f.nombre.toLowerCase().includes("efectivo")
    );
    
    // Si el usuario no seleccionó nada todavía, usamos el ID de efectivo por defecto si ya cargó
    const formaPagoActual = idFormaPago !== "" ? idFormaPago : (efectivoPorDefecto ? efectivoPorDefecto.idFormaPago : "");

    // Buscar el objeto completo de la forma de pago seleccionada actualmente para verificar su nombre
    const formaPagoSeleccionadaObj = formasPago?.find((f) => f.idFormaPago === Number(formaPagoActual));
    const esEfectivo = formaPagoSeleccionadaObj ? formaPagoSeleccionadaObj.nombre.toLowerCase().includes("efectivo") : true;

    const recibido = Number(montoRecibido) || 0;
    const vuelto = datos ? Math.max(0, recibido - datos.total) : 0;
    const faltante = datos ? Math.max(0, datos.total - recibido) : 0;

    // Calcular total de unidades en el carrito
    const totalUnidades = datos ? datos.carrito.reduce((acc, item) => acc + item.cantidad, 0) : 0;
    const fechaActual = new Date().toLocaleString("es-AR", {
        dateStyle: "short",
        timeStyle: "short",
    });

    async function handleConfirmar() {
        if (!datos) return;

        setError(null);

        const formaPagoFinal = formaPagoActual;
        if (formaPagoFinal === "") {
            setError("Seleccioná una forma de pago.");
            return;
        }

        if (esEfectivo && faltante > 0) {
            setError("El monto recibido es menor al total de la venta.");
            return;
        }

        try {
            const respuesta = await crearVenta({
                idCliente: datos.idCliente,
                idCaja: datos.idCaja,
                descuentoPorcentaje: datos.descuentoPorcentaje,
                detalles: datos.carrito.map((item) => ({
                    idProducto: item.producto.idProducto,
                    cantidad: item.cantidad,
                })),
                pagos: [
                    {
                        idFormaPago: Number(formaPagoFinal),
                        importe: datos.total,
                    },
                ],
            });

            setVentaConfirmada({ numeroVenta: respuesta.numeroVenta });
            onVentaConfirmada();

        } catch (err) {
            console.error(err);
            setError("No se pudo registrar la venta. Verificá el stock y volvé a intentar.");
        }
    }

    function handleClose() {
        if (creando) return;
        setMontoRecibido("");
        setError(null);
        setVentaConfirmada(null);
        onClose();
    }

    return (
        <AnimatePresence>
            {open && datos && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute right-4 top-4 rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {ventaConfirmada ? (
                            <div className="flex flex-col items-center py-8 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                                    <CheckCircle2 className="h-7 w-7 text-emerald-400" />
                                </div>
                                <h2 className="mt-4 text-lg font-semibold">Venta registrada</h2>
                                <p className="mt-1 font-mono text-sm text-zinc-400">
                                    {ventaConfirmada.numeroVenta}
                                </p>

                                {esEfectivo && vuelto > 0 && (
                                    <div className="mt-4 w-full max-w-xs rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 text-center">
                                        <p className="text-xs font-medium tracking-wider text-emerald-400 uppercase">Vuelto a entregar</p>
                                        <p className="mt-1 text-3xl font-extrabold text-emerald-300">
                                            {formatCurrency(vuelto)}
                                        </p>
                                    </div>
                                )}

                                <Button className="mt-6 max-w-xs" onClick={handleClose}>
                                    Nueva venta
                                </Button>
                            </div>
                        ) : (
                            <>
                                <h2 className="mb-4 text-lg font-bold">Confirmar venta</h2>

                                <div className="grid gap-6 md:grid-cols-2">

                                    {/* Tarjeta de Detalle */}
                                    <Card className="flex flex-col justify-between p-5">
                                        <div>
                                            <div className="mb-3 flex items-center justify-between border-b border-zinc-800 pb-3">
                                                <div className="flex items-center gap-2 text-xs text-zinc-400">
                                                    <User className="h-3.5 w-3.5 text-emerald-400" />
                                                    <span className="font-medium text-zinc-200">
                                                        {datos.nombreCliente && datos.apellidoCliente
                                                            ? `${datos.nombreCliente} ${datos.apellidoCliente}`
                                                            : datos.apellidoCliente || "Consumidor Final"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span>{fechaActual}</span>
                                                </div>
                                            </div>

                                            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                                <span>Productos ({totalUnidades} un.)</span>
                                                <span>Subtotal</span>
                                            </div>

                                            <div className="max-h-44 space-y-2.5 overflow-y-auto pr-1">
                                                {datos.carrito.map((item) => (
                                                    <div
                                                        key={item.producto.idProducto}
                                                        className="flex items-center justify-between rounded-lg bg-zinc-900/40 p-2 text-sm border border-zinc-800/50"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="flex h-6 w-6 items-center justify-center rounded bg-zinc-800 text-xs font-medium text-zinc-300">
                                                                {item.cantidad}
                                                            </span>
                                                            <span className="text-zinc-200 font-medium">
                                                                {item.producto.nombre}
                                                            </span>
                                                        </div>
                                                        <span className="text-zinc-400 font-mono text-xs">
                                                            {formatCurrency(item.producto.precioVenta * item.cantidad)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-1.5 border-t border-zinc-800 pt-4 text-sm">
                                            <div className="flex justify-between text-zinc-400 text-xs">
                                                <span>Subtotal</span>
                                                <span>{formatCurrency(datos.subtotal)}</span>
                                            </div>
                                            {datos.descuentoPorcentaje > 0 && (
                                                <div className="flex justify-between text-emerald-400 text-xs font-medium">
                                                    <span>Descuento aplicado ({datos.descuentoPorcentaje}%)</span>
                                                    <span>- {formatCurrency(datos.montoDescuento)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between border-t border-zinc-800/80 pt-2 text-base font-bold text-white">
                                                <span>Total a Pagar</span>
                                                <span className="text-emerald-400">{formatCurrency(datos.total)}</span>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Tarjeta de Pago */}
                                    <Card className="p-5">
                                        <h3 className="mb-3 text-sm font-semibold text-zinc-300 flex items-center gap-2">
                                            <ShoppingBag className="h-4 w-4 text-emerald-400" />
                                            Forma de pago
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="mb-1 block text-sm text-zinc-400">
                                                    Forma de pago
                                                </label>
                                                <select
                                                    value={formaPagoActual}
                                                    onChange={(e) => setIdFormaPago(e.target.value ? Number(e.target.value) : "")}
                                                    disabled={cargandoFormasPago}
                                                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                >
                                                    <option value="" disabled>Seleccionar...</option>
                                                    {formasPago?.filter((f) => f.estado).map((f) => (
                                                        <option key={f.idFormaPago} value={String(f.idFormaPago)}>
                                                            {f.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {esEfectivo && (
                                                <>
                                                    <div>
                                                        <label className="mb-1 block text-sm text-zinc-400">
                                                            Monto recibido
                                                        </label>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="0.00"
                                                            value={montoRecibido}
                                                            onChange={(e) => setMontoRecibido(e.target.value)}
                                                        />
                                                    </div>

                                                    <div className={`rounded-xl border p-4 ${faltante > 0 ? 'border-amber-500/30 bg-amber-950/20' : 'border-emerald-500/40 bg-emerald-950/20'}`}>
                                                        {faltante > 0 ? (
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-medium uppercase tracking-wider text-amber-400">Falta abonar</span>
                                                                <span className="mt-1 text-2xl font-extrabold text-amber-400">
                                                                    {formatCurrency(faltante)}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-medium uppercase tracking-wider text-emerald-400">Vuelto</span>
                                                                <span className="mt-1 text-2xl font-extrabold text-emerald-300">
                                                                    {formatCurrency(vuelto)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}

                                            {error && (
                                                <p className="text-sm text-red-400">{error}</p>
                                            )}

                                            <Button onClick={handleConfirmar} disabled={creando} className="w-full">
                                                <span className="flex items-center justify-center gap-2">
                                                    {creando && <Loader2 className="h-4 w-4 animate-spin" />}
                                                    {creando ? "Procesando..." : "Confirmar venta"}
                                                </span>
                                            </Button>
                                        </div>
                                    </Card>

                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}