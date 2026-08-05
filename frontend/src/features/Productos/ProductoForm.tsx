import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

import { useProductos } from "@/hooks/useProductos";
import { useCategorias } from "@/hooks/useCategorias";
import { useMarcas } from "@/hooks/useMarcas";
import { useConfiguracion } from "@/hooks/useConfiguracion";
import type { ProductoInput } from "@/api/productos";

import { productoSchema, type ProductoForm as ProductoFormValues } from "./productoSchema";
import { generarSiguienteCodigo } from "@/utils/productoUtils";

export function ProductoForm() {
    'use no memo'; // <-- Evita que el compilador de React genere advertencias con useForm/watch

    const { id } = useParams();
    const navigate = useNavigate();
    const esEdicion = Boolean(id);

    const {
        data: productos,
        crearProducto,
        actualizarProducto,
        creando,
        actualizando,
    } = useProductos();

    const { data: categorias } = useCategorias();
    const { data: marcas } = useMarcas();
    const { data: configuracion } = useConfiguracion();

    const productoActual = useMemo(() => {
        if (!esEdicion || !productos) return undefined;
        return productos.find((p) => p.idProducto === Number(id));
    }, [productos, id, esEdicion]);

    const {
        register,
        handleSubmit,
        reset,
        control, // <-- Necesario para useWatch
        formState: { errors, isSubmitting },
    } = useForm<ProductoFormValues>({
        resolver: zodResolver(productoSchema),
        defaultValues: {
            estado: true,
            stockActual: 0,
            stockMinimo: 0,
        },
    });

    // Cuando llega el producto a editar, precarga el formulario
    useEffect(() => {
        if (productoActual) {
            reset({
                idCategoria: productoActual.idCategoria,
                idMarca: productoActual.idMarca,
                codigo: productoActual.codigo,
                codigoBarras: productoActual.codigoBarras,
                nombre: productoActual.nombre,
                descripcion: productoActual.descripcion ?? "",
                precioCompra: productoActual.precioCompra,
                precioVenta: productoActual.precioVenta,
                stockActual: productoActual.stockActual,
                stockMinimo: productoActual.stockMinimo,
                estado: productoActual.estado,
            });
        }
    }, [productoActual, reset]);

    const precargadoRef = useRef(false);

    useEffect(() => {
        if (esEdicion) return;
        if (precargadoRef.current) return;
        if (!productos || !configuracion) return;

        reset({
            estado: true,
            stockActual: 0,
            stockMinimo: configuracion.stockMinimoDefecto,
            codigo: generarSiguienteCodigo(productos),
        });

        precargadoRef.current = true;
    }, [esEdicion, productos, configuracion, reset]);

    // Margen de ganancia calculado de forma segura con useWatch
    const precioCompra = useWatch({ control, name: "precioCompra" }) || 0;
    const precioVenta = useWatch({ control, name: "precioVenta" }) || 0;
    const margenGanancia =
        precioCompra > 0 && precioVenta > 0
            ? Number((((precioVenta - precioCompra) / precioCompra) * 100).toFixed(2))
            : 0;

    async function onSubmit(data: ProductoFormValues) {
        const payload: ProductoInput = {
            ...data,
            descripcion: data.descripcion ?? "",
            margenGanancia,
        };

        try {
            if (esEdicion) {
                await actualizarProducto({ id: Number(id), producto: payload });
            } else {
                await crearProducto(payload);
            }

            navigate("/productos");

        } catch (error) {
            console.error(error);
            alert("No se pudo guardar el producto.");
        }
    }

    const guardando = esEdicion ? actualizando : creando;

    return (
        <div className="flex h-screen overflow-hidden bg-zinc-950 text-white">
            <Sidebar />

            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="mx-auto max-w-2xl">
                    <button
                        onClick={() => navigate("/productos")}
                        className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a productos
                    </button>

                    <Card className="max-w-2xl p-8">
                        <h1 className="mb-6 text-2xl font-bold">
                            {esEdicion ? "Editar producto" : "Nuevo producto"}
                        </h1>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        Código{" "}
                                        {!esEdicion && (
                                            <span className="text-zinc-600">(autogenerado)</span>
                                        )}
                                    </label>
                                    <Input placeholder="P0001" {...register("codigo")} />
                                    {errors.codigo && (
                                        <p className="mt-1 text-sm text-red-400">{errors.codigo.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        Código de barras
                                    </label>
                                    <Input placeholder="7790001234567" {...register("codigoBarras")} />
                                    {errors.codigoBarras && (
                                        <p className="mt-1 text-sm text-red-400">{errors.codigoBarras.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm text-zinc-400">
                                    Nombre
                                </label>
                                <Input placeholder="Harina 000 1Kg" {...register("nombre")} />
                                {errors.nombre && (
                                    <p className="mt-1 text-sm text-red-400">{errors.nombre.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm text-zinc-400">
                                    Descripción
                                </label>
                                <Input placeholder="Opcional" {...register("descripcion")} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        Categoría
                                    </label>
                                    <select
                                        {...register("idCategoria", { valueAsNumber: true })}
                                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {categorias?.map((c) => (
                                            <option key={c.idCategoria} value={c.idCategoria}>
                                                {c.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.idCategoria && (
                                        <p className="mt-1 text-sm text-red-400">{errors.idCategoria.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        Marca
                                    </label>
                                    <select
                                        {...register("idMarca", { valueAsNumber: true })}
                                        className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {marcas?.map((m) => (
                                            <option key={m.idMarca} value={m.idMarca}>
                                                {m.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.idMarca && (
                                        <p className="mt-1 text-sm text-red-400">{errors.idMarca.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        Precio de compra
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...register("precioCompra", { valueAsNumber: true })}
                                    />
                                    {errors.precioCompra && (
                                        <p className="mt-1 text-sm text-red-400">{errors.precioCompra.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        Precio de venta
                                    </label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...register("precioVenta", { valueAsNumber: true })}
                                    />
                                    {errors.precioVenta && (
                                        <p className="mt-1 text-sm text-red-400">{errors.precioVenta.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-400">
                                Margen de ganancia:{" "}
                                <span className="font-medium text-emerald-400">
                                    {margenGanancia}%
                                </span>{" "}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        Stock actual
                                    </label>
                                    <Input type="number" {...register("stockActual", { valueAsNumber: true })} />
                                    {errors.stockActual && (
                                        <p className="mt-1 text-sm text-red-400">{errors.stockActual.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        Stock mínimo
                                    </label>
                                    <Input type="number" {...register("stockMinimo", { valueAsNumber: true })} />
                                    {errors.stockMinimo && (
                                        <p className="mt-1 text-sm text-red-400">{errors.stockMinimo.message}</p>
                                    )}
                                </div>
                            </div>

                            <label className="flex items-center gap-2 text-sm text-zinc-400">
                                <input
                                    type="checkbox"
                                    {...register("estado")}
                                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
                                />
                                Producto activo
                            </label>

                            <div className="flex gap-3 pt-2">
                                <Button disabled={isSubmitting || guardando}>
                                    <span className="flex items-center gap-2 w-full justify-center">
                                        {guardando && (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        )}
                                        {guardando
                                            ? "Guardando..."
                                            : esEdicion
                                                ? "Guardar cambios"
                                                : "Crear producto"}
                                    </span>
                                </Button>
                            </div>

                        </form>
                    </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}