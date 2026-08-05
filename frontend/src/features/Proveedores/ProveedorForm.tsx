import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

import { useProveedores } from "@/hooks/useProveedores";
import type { ProveedorInput } from "@/api/proveedores";

import { proveedorSchema, type ProveedorForm as ProveedorFormValues } from "./proveedorSchema";
import { generarSiguienteCodigo } from "@/utils/codigo";

export function ProveedorForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const esEdicion = Boolean(id);

    const {
        data: proveedores,
        crearProveedor,
        actualizarProveedor,
        creando,
        actualizando,
    } = useProveedores();

    const proveedorActual = useMemo(() => {
        if (!esEdicion || !proveedores) return undefined;
        return proveedores.find((p) => p.idProveedor === Number(id));
    }, [proveedores, id, esEdicion]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProveedorFormValues>({
        resolver: zodResolver(proveedorSchema),
        defaultValues: {
            estado: true,
        },
    });

    // Edición: precarga el formulario con los datos del proveedor
    useEffect(() => {
        if (proveedorActual) {
            reset({
                codigo: proveedorActual.codigo,
                razonSocial: proveedorActual.razonSocial,
                nombreFantasia: proveedorActual.nombreFantasia ?? "",
                cuit: proveedorActual.cuit,
                telefono: proveedorActual.telefono ?? "",
                email: proveedorActual.email ?? "",
                direccion: proveedorActual.direccion ?? "",
                ciudad: proveedorActual.ciudad ?? "",
                provincia: proveedorActual.provincia ?? "",
                observaciones: proveedorActual.observaciones ?? "",
                estado: proveedorActual.estado,
            });
        }
    }, [proveedorActual, reset]);

    // Alta: precarga el código incremental una sola vez
    const precargadoRef = useRef(false);

    useEffect(() => {
        if (esEdicion) return;
        if (precargadoRef.current) return;
        if (!proveedores) return;

        reset({
            estado: true,
            codigo: generarSiguienteCodigo(proveedores, "PR"),
        });

        precargadoRef.current = true;
    }, [esEdicion, proveedores, reset]);

    async function onSubmit(data: ProveedorFormValues) {
        const payload: ProveedorInput = {
            ...data,
            nombreFantasia: data.nombreFantasia ?? "",
            telefono: data.telefono ?? "",
            email: data.email ?? "",
            direccion: data.direccion ?? "",
            ciudad: data.ciudad ?? "",
            provincia: data.provincia ?? "",
            observaciones: data.observaciones ?? "",
        };

        try {
            if (esEdicion) {
                await actualizarProveedor({ id: Number(id), proveedor: payload });
            } else {
                await crearProveedor(payload);
            }

            navigate("/proveedores");

        } catch (error) {
            console.error(error);
            alert("No se pudo guardar el proveedor.");
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
                        onClick={() => navigate("/proveedores")}
                        className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a proveedores
                    </button>

                    <Card className="max-w-2xl p-8">
                        <h1 className="mb-6 text-2xl font-bold">
                            {esEdicion ? "Editar proveedor" : "Nuevo proveedor"}
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
                                    <Input placeholder="PR0001" {...register("codigo")} />
                                    {errors.codigo && (
                                        <p className="mt-1 text-sm text-red-400">{errors.codigo.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        CUIT
                                    </label>
                                    <Input placeholder="30-12345678-9" {...register("cuit")} />
                                    {errors.cuit && (
                                        <p className="mt-1 text-sm text-red-400">{errors.cuit.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        Razón social
                                    </label>
                                    <Input placeholder="Distribuidora S.A." {...register("razonSocial")} />
                                    {errors.razonSocial && (
                                        <p className="mt-1 text-sm text-red-400">{errors.razonSocial.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        Nombre fantasía
                                    </label>
                                    <Input placeholder="Opcional" {...register("nombreFantasia")} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        Teléfono
                                    </label>
                                    <Input placeholder="Opcional" {...register("telefono")} />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        Email
                                    </label>
                                    <Input placeholder="Opcional" {...register("email")} />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm text-zinc-400">
                                    Dirección
                                </label>
                                <Input placeholder="Opcional" {...register("direccion")} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        Ciudad
                                    </label>
                                    <Input placeholder="Opcional" {...register("ciudad")} />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        Provincia
                                    </label>
                                    <Input placeholder="Opcional" {...register("provincia")} />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm text-zinc-400">
                                    Observaciones
                                </label>
                                <Input placeholder="Opcional" {...register("observaciones")} />
                            </div>

                            <label className="flex items-center gap-2 text-sm text-zinc-400">
                                <input
                                    type="checkbox"
                                    {...register("estado")}
                                    className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
                                />
                                Proveedor activo
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
                                                : "Crear proveedor"}
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