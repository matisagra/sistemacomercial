import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
} from "@/api/productos";

export function useProductos() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["productos"],
        queryFn: obtenerProductos,
    });

    const invalidar = () =>
        queryClient.invalidateQueries({ queryKey: ["productos"] });

    const crear = useMutation({
        mutationFn: crearProducto,
        onSuccess: invalidar,
    });

    const actualizar = useMutation({
        mutationFn: actualizarProducto,
        onSuccess: invalidar,
    });

    const eliminar = useMutation({
        mutationFn: eliminarProducto,
        onSuccess: invalidar,
    });

    return {
        ...query,
        crearProducto: crear.mutateAsync,
        actualizarProducto: actualizar.mutateAsync,
        eliminarProducto: eliminar.mutateAsync,
        creando: crear.isPending,
        actualizando: actualizar.isPending,
        eliminando: eliminar.isPending,
    };
}