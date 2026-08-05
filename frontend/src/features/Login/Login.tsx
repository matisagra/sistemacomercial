import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

import { login } from "@/api/auth";
import { guardarToken, guardarUsuario } from "@/utils/auth";

import {
    loginSchema,
    type LoginForm,
} from "./loginSchema";

interface Props {
    setAutenticado: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Login({
    setAutenticado,
}: Props) {

    const navigate = useNavigate();

    const [mostrarPassword, setMostrarPassword] =
        useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
        },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(data: LoginForm) {
        try {

            const respuesta = await login({
                nombreUsuario: data.usuario,
                contraseña: data.contraseña,
            });

            guardarToken(respuesta.token);

            guardarUsuario({
                usuario: respuesta.usuario,
                nombre: respuesta.nombre,
                rol: respuesta.rol
            });

            setAutenticado(true);

            navigate("/");

        } catch (error) {

            console.error(error);

            alert("Usuario o contraseña incorrectos.");

        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">

            <Card className="w-full max-w-md p-8">

                <div className="mb-10 text-center">

                    <h1 className="text-3xl font-bold text-white">
                        Sistema Comercial
                    </h1>

                    <p className="mt-2 text-zinc-400">
                        Iniciá sesión para continuar
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >

                    <div>

                        <div className="relative">

                            <User
                                className="absolute left-3 top-3 text-zinc-500"
                                size={18}
                            />

                            <Input
                                className="pl-10"
                                placeholder="Usuario"
                                {...register("usuario")}
                            />

                        </div>

                        {errors.usuario && (
                            <p className="mt-2 text-sm text-red-400">
                                {errors.usuario.message}
                            </p>
                        )}

                    </div>

                    <div>

                        <div className="relative">

                            <Lock
                                className="absolute left-3 top-3 text-zinc-500"
                                size={18}
                            />

                            <Input
                                type={
                                    mostrarPassword
                                        ? "text"
                                        : "password"
                                }
                                className="pl-10 pr-10"
                                placeholder="Contraseña"
                                {...register("contraseña")}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setMostrarPassword(
                                        !mostrarPassword
                                    )
                                }
                                className="absolute right-3 top-3 text-zinc-500"
                            >
                                {mostrarPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>

                        </div>

                        {errors.contraseña && (
                            <p className="mt-2 text-sm text-red-400">
                                {errors.contraseña.message}
                            </p>
                        )}

                    </div>

                    <Button disabled={isSubmitting}>

                        {isSubmitting
                            ? "Ingresando..."
                            : "Iniciar sesión"}

                    </Button>

                </form>

            </Card>

        </main>
    );
}