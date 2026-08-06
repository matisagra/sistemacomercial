import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crearVenta, obtenerVentas } from "@/api/ventas";

export function useVentas() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["ventas"],
        queryFn: obtenerVentas,
    });

    const crear = useMutation({
        mutationFn: crearVenta,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ventas"] });
            // Al vender, el stock de los productos cambia
            queryClient.invalidateQueries({ queryKey: ["productos"] });
        },
    });

    return {
        ...query,
        crearVenta: crear.mutateAsync,
        creando: crear.isPending,
    };
}