import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    obtenerClientes,
    crearCliente,
    actualizarCliente,
} from "@/api/clientes";

export function useClientes() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["clientes"],
        queryFn: obtenerClientes,
    });

    const invalidar = () =>
        queryClient.invalidateQueries({ queryKey: ["clientes"] });

    const crear = useMutation({
        mutationFn: crearCliente,
        onSuccess: invalidar,
    });

    const actualizar = useMutation({
        mutationFn: actualizarCliente,
        onSuccess: invalidar,
    });

    return {
        ...query,
        crearCliente: crear.mutateAsync,
        actualizarCliente: actualizar.mutateAsync,
        creando: crear.isPending,
        actualizando: actualizar.isPending,
    };
}