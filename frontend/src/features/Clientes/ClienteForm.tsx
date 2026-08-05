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

import { useClientes } from "@/hooks/useClientes";
import type { ClienteInput } from "@/api/clientes";

import { clienteSchema, type ClienteForm as ClienteFormValues } from "./clienteSchema";
import { generarSiguienteCodigo } from "@/utils/codigo";

export function ClienteForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const esEdicion = Boolean(id);

    const {
        data: clientes,
        crearCliente,
        actualizarCliente,
        creando,
        actualizando,
    } = useClientes();

    const clienteActual = useMemo(() => {
        if (!esEdicion || !clientes) return undefined;
        return clientes.find((c) => c.idCliente === Number(id));
    }, [clientes, id, esEdicion]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ClienteFormValues>({
        resolver: zodResolver(clienteSchema),
        defaultValues: {
            estado: true,
        },
    });

    // Edición: precarga el formulario con los datos del cliente
    useEffect(() => {
        if (clienteActual) {
            reset({
                codigo: clienteActual.codigo,
                nombre: clienteActual.nombre,
                apellido: clienteActual.apellido,
                dni: clienteActual.dni,
                telefono: clienteActual.telefono ?? "",
                email: clienteActual.email ?? "",
                direccion: clienteActual.direccion ?? "",
                observaciones: clienteActual.observaciones ?? "",
                estado: clienteActual.estado,
            });
        }
    }, [clienteActual, reset]);

    // Alta: precarga el código incremental una sola vez
    const precargadoRef = useRef(false);

    useEffect(() => {
        if (esEdicion) return;
        if (precargadoRef.current) return;
        if (!clientes) return;

        reset({
            estado: true,
            codigo: generarSiguienteCodigo(clientes, "C"),
        });

        precargadoRef.current = true;
    }, [esEdicion, clientes, reset]);

    async function onSubmit(data: ClienteFormValues) {
        const payload: ClienteInput = {
            ...data,
            telefono: data.telefono ?? "",
            email: data.email ?? "",
            direccion: data.direccion ?? "",
            observaciones: data.observaciones ?? "",
        };

        try {
            if (esEdicion) {
                await actualizarCliente({ id: Number(id), cliente: payload });
            } else {
                await crearCliente(payload);
            }

            navigate("/clientes");

        } catch (error) {
            console.error(error);
            alert("No se pudo guardar el cliente.");
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
                        onClick={() => navigate("/clientes")}
                        className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a clientes
                    </button>

                    <Card className="max-w-2xl p-8">
                        <h1 className="mb-6 text-2xl font-bold">
                            {esEdicion ? "Editar cliente" : "Nuevo cliente"}
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
                                    <Input placeholder="C0001" {...register("codigo")} />
                                    {errors.codigo && (
                                        <p className="mt-1 text-sm text-red-400">{errors.codigo.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        DNI
                                    </label>
                                    <Input placeholder="30123456" {...register("dni")} />
                                    {errors.dni && (
                                        <p className="mt-1 text-sm text-red-400">{errors.dni.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        Nombre
                                    </label>
                                    <Input placeholder="María" {...register("nombre")} />
                                    {errors.nombre && (
                                        <p className="mt-1 text-sm text-red-400">{errors.nombre.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm text-zinc-400">
                                        Apellido
                                    </label>
                                    <Input placeholder="Gómez" {...register("apellido")} />
                                    {errors.apellido && (
                                        <p className="mt-1 text-sm text-red-400">{errors.apellido.message}</p>
                                    )}
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
                                Cliente activo
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
                                                : "Crear cliente"}
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
