import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    obtenerProveedores,
    crearProveedor,
    actualizarProveedor,
} from "@/api/proveedores";

export function useProveedores() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["proveedores"],
        queryFn: obtenerProveedores,
    });

    const invalidar = () =>
        queryClient.invalidateQueries({ queryKey: ["proveedores"] });

    const crear = useMutation({
        mutationFn: crearProveedor,
        onSuccess: invalidar,
    });

    const actualizar = useMutation({
        mutationFn: actualizarProveedor,
        onSuccess: invalidar,
    });

    return {
        ...query,
        crearProveedor: crear.mutateAsync,
        actualizarProveedor: actualizar.mutateAsync,
        creando: crear.isPending,
        actualizando: actualizar.isPending,
    };
}